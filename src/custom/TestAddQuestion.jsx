import React, { useState, useCallback, useRef, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import Button from "@/ui/Button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import {
  Edit,
  Trash,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Save,
} from "lucide-react";
import QuestionUpload from "./QuestionUpload/QuestionUpload";

const TestAddQuestion = ({
  questions,
  setQuestions,
  newQuestion,
  setNewQuestion,
  editingIndex,
  setEditingIndex,
}) => {
  const [hoveredOption, setHoveredOption] = useState(null);

  // Set selectedOption for MCQ correctAnswer highlighting
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Update selectedOption when editing a question
    if (newQuestion.type === "mcq") {
      setSelectedOption(newQuestion.correctAnswer);
    } else {
      setSelectedOption(null);
    }
  }, [newQuestion]);

  const resetForm = () => {
    setNewQuestion({
      questionNumber: questions.length + 1,
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setSelectedOption(null);
    setEditingIndex(null);
  };

  // Handle adding or updating question
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (newQuestion.type === "mcq") {
      if (newQuestion.options.some((opt) => !opt.trim())) {
        alert("Please fill all options");
        return;
      }
      if (!newQuestion.correctAnswer) {
        alert("Please select a correct answer");
        return;
      }
    } else if (newQuestion.type === "directAnswer") {
      if (!newQuestion.correctAnswer.trim()) {
        alert("Please enter the answer");
        return;
      }
    }

    if (editingIndex !== null) {
      // Update existing question
      const updated = [...questions];
      updated[editingIndex] = { ...newQuestion };
      setQuestions(updated);
    } else {
      // Add new question
      setQuestions([...questions, { ...newQuestion }]);
    }

    resetForm();
  };

  const handleEdit = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const filtered = questions.filter((_, i) => i !== index);
    const reIndexed = filtered.map((q, i) => ({ ...q, questionNumber: i + 1 }));
    setQuestions(reIndexed);
    resetForm();
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="space-y-6">
      <QuestionUpload onQuestionsLoaded={(newQuestions) => {
        // Append uploaded questions to existing list
        setQuestions((prev) => {
          // Avoid duplicates or assign new question numbers appropriately
          const updated = [...prev, ...newQuestions.map((q, i) => ({ ...q, questionNumber: prev.length + i + 1 }))];
          return updated;
        });
      }} />

      <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                {editingIndex !== null ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                {editingIndex !== null ? "Edit Question" : "Add New Question"}
              </h2>
              <p className="text-blue-100 text-sm">
                {editingIndex !== null
                  ? "Modify existing question"
                  : "Create question"}
              </p>
            </div>
            <Badge className="flex bg-blue-400/20 text-white border-blue-400/30 px-3 py-1.5">
              Question {newQuestion.questionNumber}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6 bg-white">
          {/* Question Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              Question Type
            </label>
            <div className="flex gap-3">
              <Button
                variant={newQuestion.type === "mcq" ? "default" : "outline"}
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    type: "mcq",
                    options: newQuestion.options.length ? newQuestion.options : ["", "", "", ""],
                    correctAnswer: "",
                  })
                }
              >
                Multiple Choice
              </Button>
              <Button
                variant={newQuestion.type === "directAnswer" ? "default" : "outline"}
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    type: "directAnswer",
                    options: [],
                    correctAnswer: "",
                  })
                }
              >
                Direct Answer
              </Button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              Question Text
            </label>
            <Textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Type your question here..."
              className="w-full min-h-[100px] border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* MCQ Options */}
          {newQuestion.type === "mcq" && (
            <>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Answer Options
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  {newQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`relative transform transition-all duration-300 ${hoveredOption === index ? "scale-[1.02]" : ""
                        }`}
                      onMouseEnter={() => setHoveredOption(index)}
                      onMouseLeave={() => setHoveredOption(null)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${newQuestion.correctAnswer === String.fromCharCode(65 + index)
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: newOptions });
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="w-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Select Correct Answer
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["A", "B", "C", "D"].map((letter) => (
                    <Button
                      key={letter}
                      onClick={() => {
                        setSelectedOption(letter);
                        setNewQuestion({ ...newQuestion, correctAnswer: letter });
                      }}
                      className={`h-12 transition-all duration-300 ${newQuestion.correctAnswer === letter
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Direct Answer input */}
          {newQuestion.type === "directAnswer" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Answer
              </label>
              <Textarea
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                placeholder="Type the answer here..."
                className="w-full min-h-[100px] border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddQuestion}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-blue-700 text-white h-12 font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
            >
              {editingIndex !== null ? (
                <>
                  <Save className="mr-2 h-5 w-5" /> Update Question
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" /> Add Question
                </>
              )}
            </Button>
            {editingIndex !== null && (
              <Button
                onClick={handleCancelEdit}
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-12 px-6 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Previous Questions Section */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Previous Questions
          </h3>

          {questions.map((q, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-700 px-2 py-1">
                    Question {q.questionNumber}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-800 font-medium">{q.question}</p>

                {/* Render options for MCQ else show answer text */}
                {q.type === "mcq" ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {q.options?.map((option, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${q.correctAnswer === String.fromCharCode(65 + i)
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                          }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-medium mr-2">Answer: </span>
                    {q.correctAnswer}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestAddQuestion;
