import React, { useState, useCallback, useRef, useEffect } from "react";
import QuestionForm from "../custom/TestAddQuestion";
import TestDetailsSection from "../custom/TestDetailsSection";
import Sidebar from "@/custom/Sidebar";
import { SidebarItem } from "../custom/Sidebar";
import SubHeading from "@/custom/Subheading";

const TeacherTestCreation = () => {
  const [testDetails, setTestDetails] = useState({
    testName: "",
    duration: "",
    instructions: "",
  });
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionNumber: 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  return (
    <div className="flex h-screen">
      <Sidebar>
      </Sidebar>
      <div className="flex-1 min-h-screen pb-8 overflow-y-auto">
        <SubHeading />
        <div className="max-w-5xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-8">
            Create Aptitude Test
          </h1>
          <TestDetailsSection
            setQuestions={setQuestions}
            testDetails={testDetails}
            setTestDetails={setTestDetails}
            questions={questions} // Add this line
          />
          <QuestionForm
            questions={questions}
            setQuestions={setQuestions}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherTestCreation;
