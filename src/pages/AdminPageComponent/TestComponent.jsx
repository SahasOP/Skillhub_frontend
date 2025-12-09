import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import { Card } from "../../../components/ui/card";
import Modal from "../../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteTest, editTest } from "@/store/Slices/TestSlice";

const TestsComponent = ({ tests, teachers, students }) => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("testName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [editingTest, setEditingTest] = useState({
    testName: "",
    testDate: "",
    testTime: "",
    duration: "",
    instructions: "",
    teacherId: "",
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: "1",
  });
  const dispatch = useDispatch()
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedData = () => {
    if (!tests || !Array.isArray(tests)) return [];

    return tests
      .filter((test) =>
        Object.values(test).some(
          (value) =>
            value &&
            typeof value === "string" &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (!a[sortColumn] || !b[sortColumn]) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  };

  const getTeacherName = (teacherId) => {
    if (!teachers || !Array.isArray(teachers)) return "Unknown";
    const teacher = teachers.find((t) => t._id === teacherId);
    return teacher ? teacher.name : "Unknown";
  };

  const handleEditClick = (test) => {
    setEditingTest({
      _id: test._id,
      testName: test.testName,
      testDate: test.testDate,
      testTime: test.testTime,
      duration: test.duration,
      instructions: test.instructions,
      teacherId: test.teacherId,
      questions: [...test.questions],
    });
    setIsEditModalOpen(true);
    // const response = await
  };
  const handleEditSave = () => {
    const testId = editingTest._id;
    console.log("Updating test:", editingTest);
    
    dispatch(editTest({
        data: editingTest,
        testId: testId
    }));
    
    setIsEditModalOpen(false);
};
  const handleDeleteTest = (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      dispatch(deleteTest(testId))
      console.log("Deleting test:", testId);
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.question) return;

    setEditingTest({
      ...editingTest,
      questions: [
        ...editingTest.questions,
        {
          ...currentQuestion,
          _id: Date.now().toString(), // Temporary ID for new questions
        },
      ],
    });

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: "1",
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const removeQuestion = (questionId) => {
    setEditingTest({
      ...editingTest,
      questions: editingTest.questions.filter((q) => q._id !== questionId),
    });
  };

  const getStudentAppearanceCount = (testId) => {
    if (!students || !Array.isArray(students)) return 0;

    let count = 0;
    students.forEach((student) => {
      if (student.test_appeared && Array.isArray(student.test_appeared)) {
        const appeared = student.test_appeared.some(
          (test) => test.test_id === testId
        );
        if (appeared) count++;
      }
    });

    return count;
  };

  // Format instructions for proper display
  const formatInstructions = (instructions) => {
    if (!instructions) return "";
    return instructions.trim();
  };

  const navigateToTestDetails = (testId) => {
    window.open(`/admin/getmarks/${testId}`, "_blank");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tests</h2>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button
            onClick={() => {
              setEditingTest({
                testName: "",
                testDate: "",
                testTime: "",
                duration: "",
                instructions:
                  "**Test Instructions:**\n* **Duration:** 60 minutes\n* **Total Marks:** 100\n* All questions are **mandatory**.\n* No use of external resources allowed.\n* Ensure a stable internet connection.\nPlease modify the details as needed before sharing with students.",
                teacherId:
                  teachers && teachers.length > 0 ? teachers[0]._id : "",
                questions: [],
              });
              setIsEditModalOpen(true);
            }}
          >
            Create New Test
          </Button>
        </div>
      </div>

      <Card className="mt-4">
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("testName")}
                    className="flex"
                  >
                    Test Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("testDate")}
                    className="flex"
                  >
                    Date
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData().map((test) => (
                <TableRow key={test._id}>
                  <TableCell>{test.testName}</TableCell>
                  <TableCell>{test.testDate}</TableCell>
                  <TableCell>{getTeacherName(test.teacherId)}</TableCell>
                  <TableCell>{test.duration} min</TableCell>
                  <TableCell>
                    {test.questions ? test.questions.length : 0}
                  </TableCell>
                  <TableCell>
                    {getStudentAppearanceCount(test._id)} appeared
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        className="text-xs"
                        onClick={() => navigateToTestDetails(test._id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleEditClick(test)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="text-xs text-red-500"
                        onClick={() => handleDeleteTest(test._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Details Modal */}
      {isModalOpen && selectedTest && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">{selectedTest.testName}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Test Date</p>
                <p className="text-sm text-gray-900">{selectedTest.testDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Test Time</p>
                <p className="text-sm text-gray-900">{selectedTest.testTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-sm text-gray-900">
                  {selectedTest.duration} minutes
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Teacher</p>
                <p className="text-sm text-gray-900">
                  {getTeacherName(selectedTest.teacherId)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <div className="prose text-sm text-gray-900">
                {formatInstructions(selectedTest.instructions)
                  .split("\n")
                  .map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              {selectedTest.questions && selectedTest.questions.length > 0 ? (
                selectedTest.questions.map((question, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <p className="font-medium">
                      {index + 1}. {question.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded text-sm ${
                            String.fromCharCode(97 + optIndex) ===
                            question.correctAnswer
                              ? "bg-green-100 border border-green-300"
                              : "bg-gray-50"
                          }`}
                        >
                          {String.fromCharCode(97 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {question.correctAnswer}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Marks:</span>{" "}
                      {question.marks}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No questions in this test
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit/Add Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
            <div className="space-y-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl bg-blue-600 text-white font-bold mb-4">
                {editingTest._id ? "Edit Test" : "Create New Test"}
              </h2>
              <div className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Test Name
                  </label>
                  <Input
                    value={editingTest.testName}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        testName: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Test Date
                    </label>
                    <Input
                      type="date"
                      value={editingTest.testDate}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          testDate: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Test Time
                    </label>
                    <Input
                      type="time"
                      value={editingTest.testTime}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          testTime: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <Input
                      type="number"
                      value={editingTest.duration}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          duration: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Teacher
                    </label>
                    <select
                      value={editingTest.teacherId}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          teacherId: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {teachers &&
                        teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Instructions
                  </label>
                  <textarea
                    value={editingTest.instructions}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        instructions: e.target.value,
                      })
                    }
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use Markdown for formatting. Example: **bold**, *italic*
                  </p>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-4">Questions</h3>

                  {/* Existing Questions */}
                  {editingTest.questions &&
                    editingTest.questions.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h4 className="font-medium">Current Questions</h4>
                        {editingTest.questions.map((q, index) => (
                          <div
                            key={q._id || index}
                            className="border p-4 rounded-md relative"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                              onClick={() => removeQuestion(q._id)}
                            >
                              X
                            </Button>
                            <p className="font-medium">
                              {index + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {q.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded text-sm ${
                                    String.fromCharCode(97 + optIndex) ===
                                    q.correctAnswer
                                      ? "bg-green-100 border border-green-300"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  {String.fromCharCode(97 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-medium">
                                Correct Answer:
                              </span>{" "}
                              {q.correctAnswer}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Marks:</span>{" "}
                              {q.marks}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Add New Question Form */}
                  <div className="border p-4 rounded-md">
                    <h4 className="font-medium mb-3">Add New Question</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question
                        </label>
                        <Input
                          value={currentQuestion.question}
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              question: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options
                        </label>
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="flex items-center">
                            <span className="mr-2 text-sm">
                              {String.fromCharCode(97 + index)})
                            </span>
                            <Input
                              value={currentQuestion.options[index]}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Correct Answer
                          </label>
                          <select
                            value={currentQuestion.correctAnswer}
                            onChange={(e) =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                correctAnswer: e.target.value,
                              })
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select answer</option>
                            <option value="a">a</option>
                            <option value="b">b</option>
                            <option value="c">c</option>
                            <option value="d">d</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Marks
                          </label>
                          <Input
                            type="number"
                            value={currentQuestion.marks}
                            onChange={(e) =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                marks: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={addQuestion}
                        disabled={
                          !currentQuestion.question ||
                          !currentQuestion.correctAnswer
                        }
                        className="mt-2"
                      >
                        Add Question
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSave}
                  disabled={
                    !editingTest.testName ||
                    !editingTest.teacherId ||
                    editingTest.questions.length === 0
                  }
                >
                  {editingTest._id ? "Update Test" : "Create Test"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestsComponent;
