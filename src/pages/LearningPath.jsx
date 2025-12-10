import React, { useState, useEffect } from "react";
import Leetcode from "../assets/leetcode.png";
import gfg from "../assets/gfg.jpg";
import CodeChef from "../assets/codechef.jpg";
import CodeForces from "../assets/codeforces.webp";
import CodingNinja from "../assets/codingninja.jpeg";
import { Card, CardContent } from "../../components/ui/card";
import Button from "@/ui/Button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopics,
  addTopic,
  updateTopic,
  deleteTopic,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  // getDsaCategory,
} from "../store/Slices/TopicSlice";
import { fetchStudent, updateStudentSolvedQuestions } from "../store/Slices/StudentSlice";
import { Textarea } from "../../components/ui/textarea";
import {
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Edit,
  Trash2,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
  Plus,
  ArrowLeft,
  Delete,
  X,
} from "lucide-react";
import Header from "@/custom/header";
import Sidebar, { SidebarItem } from "@/custom/Sidebar";
import SubHeading from "@/custom/StudentSubheading";
import AddQuestionForm from "../custom/AddQuestionForm";

const getPlatformImage = (platform) => {
  const platforms = {
    leetcode: Leetcode,
    gfg: gfg,
    codechef: CodeChef,
    codeforces: CodeForces,
    codingninja: CodingNinja,
  };
  return platforms[platform?.toLowerCase()] || Leetcode;
};

const LearningPath = () => {
  const dispatch = useDispatch();
  const [isTeacherRole, setIsTeacherRole] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { topic, categoriess } = useSelector((state) => state.topic);
  const { student } = useSelector((state) => state.student);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    problem: "",
    practice: "",
    platform: "",
    difficulty: "Medium",
  });

  useEffect(() => {
    setIsTeacherRole(localStorage.getItem('role') === '"teacher"');
  }, []);

  useEffect(() => {
    // dispatch(getDsaCategory());
    dispatch(fetchStudent());
  }, [dispatch]);

  // Update questions status based on student data when it's available
  useEffect(() => {
    if (student && selectedTopic && selectedTopic.questions) {
      const updatedQuestions = selectedTopic.questions.map(question => ({
        ...question,
        status: student.topics?.questionIds?.includes(question._id) || false
      }));
      
      setSelectedTopic({
        ...selectedTopic,
        questions: updatedQuestions
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    e.preventDefault();
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = async (index) => {
    if (!selectedTopic || !selectedTopic.questions) return;

    // Create a deep copy of the selected topic
    const updatedTopic = {
      ...selectedTopic,
      questions: [...selectedTopic.questions]
    };
    
    // Update the specific question
    const question = {...updatedTopic.questions[index]};
    question.status = !question.status;
    updatedTopic.questions[index] = question;
    
    // Update the state
    setSelectedTopic(updatedTopic);

    try {
      await dispatch(
        updateQuestion({
          topicId: selectedTopic._id,
          questionId: question._id,
          updatedQuestion: question,
        })
      ).unwrap();

      await dispatch(
        updateStudentSolvedQuestions({
          questionId: question._id,
          status: question.status,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleCancel = () => {
    setNewQuestion({
      problem: "",
      practice: "",
      platform: "",
      difficulty: "Medium",
    });
    setEditingQuestionIndex(null);
    setShowForm(false);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return;

    // Create a new question object
    const questionToAdd = {
      status: false,
      ...newQuestion,
    };

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...selectedTopic.questions];
      updatedQuestions[editingQuestionIndex] = {
        ...updatedQuestions[editingQuestionIndex],
        ...newQuestion
      };

      setSelectedTopic({
        ...selectedTopic,
        questions: updatedQuestions
      });

      try {
        await dispatch(
          updateQuestion({
            topicId: selectedTopic._id,
            questionId: updatedQuestions[editingQuestionIndex]._id,
            updatedQuestion: updatedQuestions[editingQuestionIndex],
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to update question:", error);
      }
    } else {
      // Add new question
      try {
        const resultAction = await dispatch(
          addQuestion({
            topicId: selectedTopic._id,
            question: questionToAdd,
          })
        ).unwrap();
        
        // Assuming the API returns the updated topic or at least the new question with ID
        if (resultAction && resultAction.topic) {
          setSelectedTopic(resultAction.topic);
        } else {
          // If we don't get a proper response, at least update the UI optimistically
          setSelectedTopic({
            ...selectedTopic,
            questions: [...selectedTopic.questions, questionToAdd]
          });
        }
      } catch (error) {
        console.error("Failed to add question:", error);
      }
    }

    // Reset the form
    handleCancel();
  };

  const handleUpdateQuestion = (index) => {
    const question = selectedTopic.questions[index];
    setNewQuestion({
      problem: question.problem,
      practice: question.practice,
      platform: question.platform || "leetcode",
      difficulty: question.difficulty,
    });
    setEditingQuestionIndex(index);
    setShowForm(true);
  };

  const handleDeleteQuestion = async (index) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    if (!selectedTopic || !selectedTopic.questions || !selectedTopic.questions[index]) return;
    
    const questionId = selectedTopic.questions[index]._id;
    
    try {
      await dispatch(
        deleteQuestion({
          topicId: selectedTopic._id,
          questionId: questionId,
        })
      ).unwrap();
      
      // Update local state by removing the question
      const updatedQuestions = selectedTopic.questions.filter((_, i) => i !== index);
      setSelectedTopic({
        ...selectedTopic,
        questions: updatedQuestions
      });
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
  };

  const TopicCards = () => {
    if (!categoriess?.topics) {
      return <div>Loading topics...</div>;
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(categoriess.topics || {}).map((topic) => (
          <Card
            key={topic._id}
            className="hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleSelectTopic(topic)}
          >
            <CardContent className="p-6">
              <div
                className={`${topic?.color || "bg-blue-500"} text-white p-4 rounded-lg mb-4 inline-block`}
              >
                {topic.icon || "📚"}
              </div>
              <h3 className="text-xl font-bold mb-2">{topic?.title}</h3>
              <p className="text-gray-600">{topic.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                {topic.questions?.filter((q) => q.status).length || 0}{" "}
                / {topic.questions?.length || 0} completed
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const TopicQuestions = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span>Back to Topics</span>
        </button>
        <h2 className="text-2xl font-bold">{selectedTopic?.title}</h2>
      </div>

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
            {selectedTopic?.questions?.map((question, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={question.status || false}
                    onChange={() => handleCheckboxChange(index)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="p-4">{question.problem}</td>
                <td className="p-4">
                  <a
                    href={question.practice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img
                      src={getPlatformImage(question.platform)}
                      alt={question.platform || "Platform"}
                      className="h-8 w-14 object-contain"
                    />
                  </a>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      question.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : question.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </td>
                {isTeacherRole && (
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdateQuestion(index)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteQuestion(index)}
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
            ))}
            {(!selectedTopic?.questions || selectedTopic.questions.length === 0) && (
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
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {showForm ? (
            <div className="flex space-x-2">
              <X size={20} /> <span>Cancel</span>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Plus size={20} /> <span>Add New Question</span>
            </div>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex">
      <div className="h-screen fixed">
        <Sidebar />
      </div>

      <div className="w-full">
        <SubHeading />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Learning Path
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a topic to start your learning journey. Each section
              contains carefully curated problems to help you master the
              concepts.
            </p>
          </div>

          {selectedTopic ? <TopicQuestions /> : <TopicCards />}
          {showForm && (
            <Card className="my-8">
              <AddQuestionForm
                newQuestion={newQuestion}
                onInputChange={handleInputChange}
                onSubmit={handleAddQuestion}
                onCancel={handleCancel}
                isEditing={editingQuestionIndex !== null}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;