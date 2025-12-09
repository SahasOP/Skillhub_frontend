import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import Leetcode from "../assets/leetcode.png";

// Component for Arrays topic
export const ArraysComponent = ({ questions, onStatusChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Arrays</h3>
        <p className="text-blue-700">
          Master array manipulation, traversal techniques, and common patterns for solving array-based problems.
        </p>
      </div>
      
      <QuestionsTable 
        questions={questions} 
        onStatusChange={onStatusChange}
        topic="arrays"
      />
    </div>
  );
};

// Component for Linked Lists topic
export const LinkedListsComponent = ({ questions, onStatusChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-green-900 mb-2">Linked Lists</h3>
        <p className="text-green-700">
          Learn to manipulate pointers, handle edge cases, and solve common linked list problems.
        </p>
      </div>
      
      <QuestionsTable 
        questions={questions} 
        onStatusChange={onStatusChange}
        topic="linked-lists"
      />
    </div>
  );
};

// Component for Trees topic
export const TreesComponent = ({ questions, onStatusChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-purple-900 mb-2">Trees</h3>
        <p className="text-purple-700">
          Practice tree traversals, binary search trees, and advanced tree concepts.
        </p>
      </div>
      
      <QuestionsTable 
        questions={questions} 
        onStatusChange={onStatusChange}
        topic="trees"
      />
    </div>
  );
};

// Reusable Questions Table Component
const QuestionsTable = ({ questions, onStatusChange, topic }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Problem</th>
            <th className="p-4 text-left">Practice</th>
            <th className="p-4 text-left">Difficulty</th>
            <th className="p-4 text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={question.status}
                  onChange={() => onStatusChange(topic, index)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="p-4">
                <div className="font-medium">{question.problem}</div>
                {question.notes && (
                  <div className="text-sm text-gray-500 mt-1">{question.notes}</div>
                )}
              </td>
              <td className="p-4">
                <a
                  href={question.practice}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:opacity-80 transition-opacity"
                >
                  <img src={Leetcode} alt="LeetCode" className="h-8 w-14" />
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
              <td className="p-4">
                <span className="text-sm text-gray-600">{question.category}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TopicDetails = ({ topic, questions, onStatusChange }) => {
  const components = {
    arrays: ArraysComponent,
    linkedLists: LinkedListsComponent,
    trees: TreesComponent,
    // Add more topic components as needed
  };

  const TopicComponent = components[topic];
  
  return TopicComponent ? (
    <TopicComponent questions={questions} onStatusChange={onStatusChange} />
  ) : (
    <div>Topic not found</div>
  );
};