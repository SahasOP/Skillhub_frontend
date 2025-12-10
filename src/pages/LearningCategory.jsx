import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "../../components/ui/card";
import Button from "@/ui/Button";
import Sidebar from "@/custom/Sidebar";
import SubHeading from "@/custom/StudentSubheading";
import AddQuestionForm from "../custom/AddQuestionForm";

import { ArrowLeft, Edit, Trash2, Plus, X } from "lucide-react";

import {
  getTopicsByCategoryId,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../store/Slices/TopicSlice";

import { fetchStudent } from "../store/Slices/StudentSlice";
import {
  fetchSolvedQuestions,
  updateStudentSolvedQuestions,
} from "@/store/Slices/AuthSlice";

import Leetcode from "../assets/leetcode.png";
import gfg from "../assets/gfg.jpg";
import CodeChef from "../assets/codechef.jpg";
import CodeForces from "../assets/codeforces.webp";
import CodingNinja from "../assets/codingninja.jpeg";

const platformImages = {
  leetcode: Leetcode,
  gfg: gfg,
  codechef: CodeChef,
  codeforces: CodeForces,
  codingninja: CodingNinja,
};

const emptyQuestion = {
  problem: "",
  practice: "",
  platform: "leetcode",
  difficulty: "Medium",
};

const LearningPath = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const { topics = [], categories = [], loading } = useSelector((state) => state.topic);
  const { student } = useSelector((state) => state.student);
  const { solvedQuestions = [] } = useSelector((state) => state.auth);

  // Local state
  const [viewMode, setViewMode] = useState("topics"); // "topics" or "questions"
  const [isTeacherRole, setIsTeacherRole] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState(emptyQuestion);
  const [localSolvedQuestions, setLocalSolvedQuestions] = useState([]);

  // Set role and fetch data on mount/categoryId change
  useEffect(() => {
    setIsTeacherRole(localStorage.getItem("role")?.replace(/"/g, "") === "teacher");
    dispatch(fetchStudent());
    if (categoryId) dispatch(getTopicsByCategoryId(categoryId));
    // fetchSolvedQuestions will only work if there's a logged-in user
    dispatch(fetchSolvedQuestions());
  }, [dispatch, categoryId]);

  // Keep local solved questions in sync with Redux
  useEffect(() => {
    setLocalSolvedQuestions(Array.isArray(solvedQuestions) ? solvedQuestions : []);
  }, [solvedQuestions]);

  const navigateBack = () => {
    if (viewMode === "topics") {
      navigate("/learningpath");
    } else {
      showTopics();
    }
  };

  const showTopics = () => {
    setViewMode("topics");
    setSelectedTopic(null);
    setShowForm(false);
    setEditingQuestionIndex(null);
  };

  const showQuestions = useCallback((topic) => {
    // Attach completed status for each question
    if (student && Array.isArray(topic?.questions)) {
      const updatedQuestions = topic.questions.map((question) => ({
        ...question,
        status: localSolvedQuestions.some(
          (sq) => sq?.questionId === question?._id && sq?.status === "true"
        ),
      }));
      setSelectedTopic({ ...topic, questions: updatedQuestions });
    } else {
      setSelectedTopic(topic);
    }
    setViewMode("questions");
    setShowForm(false);
    setEditingQuestionIndex(null);
  }, [localSolvedQuestions, student]);

  // Add/Edit question form input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewQuestion(emptyQuestion);
    setEditingQuestionIndex(null);
    setShowForm(false);
  };

  // Add or update question
  const handleAddOrUpdateQuestion = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return;

    try {
      if (editingQuestionIndex !== null) {
        // Update
        const existingQuestion = selectedTopic.questions?.[editingQuestionIndex];
        if (!existingQuestion) return;
        const updatedQuestion = { ...existingQuestion, ...newQuestion };
        await dispatch(
          updateQuestion({
            categoryId,
            topicId: selectedTopic._id,
            questionId: existingQuestion._id,
            updatedQuestion,
          })
        ).unwrap();
        // UI update
        setSelectedTopic((prev) => {
          const updatedQuestions = [...prev.questions];
          updatedQuestions[editingQuestionIndex] = updatedQuestion;
          return { ...prev, questions: updatedQuestions };
        });
      } else {
        // Add
        const result = await dispatch(
          addQuestion({
            categoryId,
            topicId: selectedTopic._id,
            question: { ...newQuestion, status: false },
          })
        ).unwrap();
        if (result?.topic) setSelectedTopic(result.topic);
      }
      resetForm();
    } catch (err) {
      alert("Failed to save question. Please try again.");
    }
  };

  const handleToggleQuestionStatus = async (questionId, index, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      setSelectedTopic((prev) => {
        const updatedQuestions = [...prev.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], status: newStatus };
        return { ...prev, questions: updatedQuestions };
      });

      setLocalSolvedQuestions((prev) => {
        const idx = prev.findIndex((q) => q.questionId === questionId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], status: String(newStatus) };
          return updated;
        } else {
          return [...prev, { questionId, status: String(newStatus) }];
        }
      });

      // Will update the actual user's solvedQuestions in DB,
      // and Redux store's solvedQuestions
      await dispatch(updateStudentSolvedQuestions({ questionId, status: newStatus })).unwrap();
    } catch (err) {
      setSelectedTopic((prev) => {
        const revertedQuestions = [...prev.questions];
        revertedQuestions[index] = { ...revertedQuestions[index], status: currentStatus };
        return { ...prev, questions: revertedQuestions };
      });
      alert("Failed to update question status. Please try again.");
    }
  };


  // Edit question
  const handleEditQuestion = (index) => {
    const question = selectedTopic.questions?.[index];
    if (!question) return;
    setNewQuestion({
      problem: question.problem || "",
      practice: question.practice || "",
      platform: question.platform || "leetcode",
      difficulty: question.difficulty || "Medium",
    });
    setEditingQuestionIndex(index);
    setShowForm(true);
  };

  // Delete a question
  const handleDeleteQuestion = async (questionId, index) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await dispatch(
        deleteQuestion({
          categoryId,
          topicId: selectedTopic._id,
          questionId,
        })
      ).unwrap();
      setSelectedTopic((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    } catch (err) {
      alert("Failed to delete question. Please try again.");
    }
  };

  // Render topics
  const renderTopics = () => {
    if (loading) {
      return (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading topics...</p>
        </div>
      );
    }
    if (!Array.isArray(topics) || !topics.length) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No topics available for this category.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          if (!topic) return null;
          const completedQuestions =
            topic.questions?.filter((q) =>
              localSolvedQuestions.some(
                (sq) => sq?.questionId === q?._id && sq?.status === "true"
              )
            ).length || 0;

          return (
            <Card
              key={topic._id}
              className="hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all"
              onClick={() => showQuestions(topic)}
              role="button"
              tabIndex={0}
            >
              <CardContent className="p-6">
                <div className={`${topic.color || "bg-blue-500"} text-white p-4 rounded-lg mb-4 inline-block`}>
                  {topic.icon || "📚"}
                </div>
                <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                <p className="text-gray-600">{topic.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {completedQuestions} / {topic.questions?.length || 0} completed
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Render questions
  const renderQuestions = () => {
    if (!selectedTopic) return null;
    const questionsArr = selectedTopic.questions || [];
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Problem</th>
                <th className="p-4 text-left">Practice</th>
                <th className="p-4 text-left">Difficulty</th>
                {isTeacherRole && <th className="p-4 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {questionsArr.length ? (
                questionsArr.map((question, index) => (
                  <tr key={question._id || index} className="border-t">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={localSolvedQuestions.some(
                          (sq) => sq?.questionId === question?._id && sq?.status === "true"
                        )}
                        onChange={() =>
                          handleToggleQuestionStatus(
                            question._id,
                            index,
                            question.status
                          )
                        }
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="p-4">{question.problem}</td>
                    <td className="p-4">
                      <a
                        href={question.practice}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={platformImages[question.platform?.toLowerCase()] || Leetcode}
                          alt={question.platform || "Platform"}
                          className="h-8 w-14 object-contain"
                        />
                      </a>
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          `px-3 py-1 rounded-full text-sm ` +
                          (question.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : question.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800")
                        }
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    {isTeacherRole && (
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditQuestion(index)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteQuestion(question._id, index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isTeacherRole ? 5 : 4} className="p-4 text-center text-gray-500">
                    No questions available for this topic yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isTeacherRole && (
          <>
            <Button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showForm ? <><X size={20} /><span>Cancel</span></> : <><Plus size={20} /><span>Add New Question</span></>}
            </Button>
            {showForm && (
              <Card className="my-6 p-4">
                <AddQuestionForm
                  newQuestion={newQuestion}
                  onInputChange={handleFormChange}
                  onSubmit={handleAddOrUpdateQuestion}
                  onCancel={resetForm}
                  isEditing={editingQuestionIndex !== null}
                />
              </Card>
            )}
          </>
        )}
      </div>
    );
  };

  // UI render
  // Find selected category by id
  const selectedCategory =
    categories && categories.find((c) => c._id === categoryId);

  return (
    <div className="flex">
      <div className="h-screen fixed">
        <Sidebar />
      </div>
      <div className="w-full">
        <SubHeading />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button
                onClick={navigateBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                <span>{viewMode === "topics" ? "Back to Categories" : "Back to Topics"}</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {viewMode === "topics"
                  ? `${selectedCategory?.name || "Category"} Topics`
                  : selectedTopic?.title}
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {viewMode === "topics"
                  ? `Choose a topic to start learning in this category. Each topic contains curated problems to help master concepts.`
                  : selectedTopic?.description}
              </p>
            </div>
          </div>
          {viewMode === "topics" ? renderTopics() : renderQuestions()}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
