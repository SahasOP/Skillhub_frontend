// QuestionList.jsx - simplified state and handlers; uses Modal and QuestionForm
import React, { useState, useEffect } from "react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ChevronDown, ChevronRight, Edit2, Plus, Trash2, ExternalLink, X } from "lucide-react";
import QuestionForm from "./QuestionForm";

import Modal from "./Modal";

const difficultyColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

const QuestionList = ({
  topic,
  onEditTopic,
  onDeleteTopic,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  loading,
  selectedCategory,
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [modalData, setModalData] = useState({ show: false, question: null, mode: null });

  useEffect(() => {
    setExpandedQuestion(null);
    setModalData({ show: false, question: null, mode: null });
  }, [topic]);

  const toggleExpand = (idx) => setExpandedQuestion(expandedQuestion === idx ? null : idx);

  const difficultyBadge = (difficulty) => (
    <Badge className={`${difficultyColors[difficulty]}`}>{difficulty}</Badge>
  );

  // Unified modal handlers
  const openAddModal = () => setModalData({ show: true, question: null, mode: "add" });
  const openEditModal = (question) => setModalData({ show: true, question, mode: "edit" });
  const closeModal = () => setModalData({ show: false, question: null, mode: null });

  // Unified submit handler
  const handleSubmit = async (questionData) => {
    try {
      if (modalData.mode === "add") {
        await onAddQuestion(topic._id, questionData, selectedCategory?.id);
      } else if (modalData.mode === "edit") {
        const idx = topic.questions.findIndex(q => q === modalData.question);
        await onUpdateQuestion(topic._id, idx, questionData);
      }
      closeModal();
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      await onDeleteQuestion(topic._id, index);
      if (expandedQuestion === index) setExpandedQuestion(null);
    } catch (e) {
      console.error("Failed to delete question:", e);
    }
  };

  if (!topic) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6 text-center text-gray-500">Select a topic to view questions</CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 flex justify-between items-center text-white">
        <CardTitle className="flex items-center gap-2">
          <span>{topic.icon}</span>
          {topic.title}
          <Badge variant="secondary">{topic.questions?.length || 0} questions</Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEditTopic(topic)} disabled={loading}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit Topic
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDeleteTopic(topic._id)} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p className="mb-6 text-gray-700">{topic.description || "No description provided."}</p>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAddModal} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8 space-x-2 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-blue-600"></span>
            ))}
          </div>
        ) : topic.questions?.length ? (
          topic.questions.map((question, i) => (
            <div key={i} className="border rounded-lg hover:shadow-md transition-shadow mb-3">
              <div
                onClick={() => toggleExpand(i)}
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
              >
                <div className="flex items-center space-x-4 font-medium text-gray-900">
                  <div>{question.problem}</div>
                  {difficultyBadge(question.difficulty)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">TC: {question.timeComplexity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={e => e.stopPropagation() || toggleExpand(i)}>
                    {expandedQuestion === i ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {expandedQuestion === i && (
                <div className="bg-white border-t p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Time Complexity</h4>
                      <p className="text-sm">{question.timeComplexity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Space Complexity</h4>
                      <p className="text-sm">{question.spaceComplexity}</p>
                    </div>
                  </div>

                  {question.practice && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Practice Link</h4>
                      <a href={question.practice} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center">
                        {question.practice} <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={e => e.stopPropagation() || openEditModal(question)} disabled={loading}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={e => e.stopPropagation() || handleDelete(i)}
                      disabled={loading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50 text-gray-500">
            No questions added yet
            <Button variant="link" className="mt-2 text-blue-600" onClick={openAddModal} disabled={loading}>
              <Plus className="mr-2 h-4 w-4" /> Add your first question
            </Button>
          </div>
        )}
      </CardContent>

      {modalData.show && (
        <Modal title={modalData.mode === "add" ? `Add Question to ${topic.title}` : "Edit Question"} onClose={closeModal}>
          <QuestionForm
            initialData={modalData.question}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </Card>
  );
};

export default QuestionList;
