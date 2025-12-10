import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
  Target,
  Clock,
  Bookmark,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Sidebar, { SidebarItem } from "@/custom/Sidebar";
import SubHeading from "@/custom/Subheading";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentTestMarks, getTestByid } from "@/store/Slices/TestSlice";

const calculatePercentage = (obtained, total) =>
  total > 0 ? ((obtained / total) * 100).toFixed(1) : "0.0";

const getGradeColor = (grade) => {
  const colors = {
    A: "bg-green-500",
    B: "bg-blue-500",
    C: "bg-yellow-500",
    D: "bg-orange-500",
    F: "bg-red-500",
  };
  return colors[grade] || "bg-gray-500";
};

const getGrade = (percentage) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

const StudentTestResults = ({
  studentName = "",
  prn = "",
  branch = "",
  year = "",
  testName = "Test",
  totalMarks = 0,
  marksScored = 0,
  questions = [],
  analytics = {
    attemptsBreakdown: {
      correct: 0,
      incorrect: 0,
      skipped: 0,
    },
    timeManagement: {
      averageTimePerQuestion: "",
      totalTimeTaken: "",
      timeLimit: "",
    },
  },
  submittedAt = new Date().toISOString(),
}) => {
  const { currentTest, testById } = useSelector((state) => state.test);

  // Calculate counts from currentTest data if available
  const correctans =
    currentTest?.question_appeared?.filter(
      (q) => q.correct_answer === q.your_answer
    ).length || analytics.attemptsBreakdown.correct || 0;

  const incorrectans =
    currentTest?.question_appeared?.filter(
      (q) => q.your_answer && q.correct_answer !== q.your_answer
    ).length || analytics.attemptsBreakdown.incorrect || 0;

  const skippedans =
    currentTest?.question_appeared?.filter((q) => !q.your_answer).length ||
    analytics.attemptsBreakdown.skipped ||
    0;

  const totalQuestions = testById?.questions?.length || questions.length || 1;
  const duration = testById?.duration || analytics.timeManagement.timeLimit || 60;

  const percentage = calculatePercentage(marksScored, totalMarks);
  const grade = getGrade(percentage);

  const attemptData = [
    {
      name: "Correct",
      value: correctans,
      color: "#22c55e",
    },
    {
      name: "Incorrect",
      value: incorrectans,
      color: "#ef4444",
    },
    {
      name: "Skipped",
      value: skippedans,
      color: "#6b7280",
    },
  ];

  return (
    <div className="flex">
      <div className="h-screen fixed left-0 bg-white border-r border-gray-200 print:hidden">
        <Sidebar>
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            alert
          />
          <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
          <SidebarItem icon={<UserCircle size={20} />} text="Users" />
          <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
          <SidebarItem icon={<Package size={20} />} text="Orders" alert />
          <SidebarItem icon={<Receipt size={20} />} text="Billings" />
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
        </Sidebar>
      </div>

      <div className="w-full print:ml-0">
        <SubHeading />
        <div className="min-h-screen bg-gray-50 p-6">
          {/* Header Card */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold text-blue-800">
                Shah & Anchor Kutchhi Engineering College
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-semibold text-blue-800">{studentName}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">PRN</p>
                <p className="font-semibold text-blue-800">{prn}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-semibold text-blue-800">{branch}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-semibold text-blue-800">{year}</p>
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="max-w-5xl mx-auto shadow-lg">
            <CardHeader className="border-b pb-4 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-blue-800">
                  {testName} - Test Results
                </CardTitle>
                <Badge
                  className={`${getGradeColor(grade)} text-white text-2xl px-6 py-3`}
                >
                  Grade {grade}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-gradient-to-r from-white-50 to-white-100">
              {/* Score Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">
                          Total Marks
                        </p>
                        <p className="text-2xl font-bold text-blue-800">
                          {totalMarks}
                        </p>
                      </div>
                      <Bookmark className="text-blue-500" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">
                          Marks Scored
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          {marksScored}
                        </p>
                      </div>
                      <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">
                          Percentage
                        </p>
                        <p className="text-2xl font-bold text-purple-800">{percentage}%</p>
                      </div>
                      <BarChart3 className="text-purple-500" size={24} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Performance Overview */}
                <div className="flex-1">
                  <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
                    <h4 className="font-semibold text-xl mb-4 flex items-center gap-2">
                      <Target className="text-green-500" />
                      Attempts Analysis
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attemptData}>
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Time Management */}
                <div className="flex-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="text-orange-500" />
                        Time Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-orange-600">Average Time/Question</p>
                          <p className="text-xl font-semibold text-orange-700">
                            {(duration / totalQuestions).toFixed(1)} minutes
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-600">Total Time Taken</p>
                          <p className="text-xl font-semibold text-green-700">
                            {analytics.timeManagement.totalTimeTaken || duration} minutes
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-600">Time Limit</p>
                          <p className="text-xl font-semibold text-blue-700">
                            {duration} minutes
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Questions Section Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Question Analysis
                </h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-sm text-gray-600">
                      Correct: {correctans}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="text-red-500" size={20} />
                    <span className="text-sm text-gray-600">
                      Incorrect: {incorrectans}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-gray-500" size={20} />
                    <span className="text-sm text-gray-600">
                      Skipped: {skippedans}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Grid */}
              {questions.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {questions.map((question, index) => {
                    const userAnswerObj =
                      currentTest?.question_appeared?.[index] || {};
                    const userAnswer = userAnswerObj.your_answer || "";

                    const isCorrect =
                      question.type === "mcq"
                        ? userAnswer === question.correctAnswer
                        : userAnswer.trim().toLowerCase() ===
                        (question.correctAnswer || "").trim().toLowerCase();

                    if (question.type === "mcq") {
                      return (
                        <Card
                          key={index}
                          className="hover:shadow-lg transition-shadow duration-300"
                        >
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                              Question {index + 1}: {question.text}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {question.options.map((option, optionIndex) => {
                                let optionClasses =
                                  "p-3 rounded-lg border flex justify-between items-center transition-all duration-300";

                                if (option.isSelected) {
                                  optionClasses += option.isCorrect
                                    ? " bg-green-100 border-green-400 text-green-700"
                                    : " bg-red-100 border-red-400 text-red-700";
                                } else if (option.isCorrect) {
                                  optionClasses += " bg-green-50 border-green-300 text-green-700";
                                } else {
                                  optionClasses += " border-gray-300";
                                }

                                return (
                                  <div key={optionIndex} className={optionClasses}>
                                    <span>{option.text}</span>
                                    {option.isSelected && !option.isCorrect && (
                                      <XCircle className="text-red-500" size={18} />
                                    )}
                                    {option.isCorrect && (
                                      <CheckCircle2 className="text-green-500" size={18} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    } else if (question.type === "directAnswer") {
                      return (
                        <Card
                          key={index}
                          className="hover:shadow-lg transition-shadow duration-300"
                        >
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                              Question {index + 1}: {question.text}
                            </h3>
                            <div className="bg-gray-50 rounded p-3 border text-gray-800">
                              <p>
                                <strong>Your Answer:</strong>{" "}
                                {userAnswer || "No answer provided"}
                              </p>
                              <p>
                                <strong>Correct Answer:</strong>{" "}
                                {question.correctAnswer}
                              </p>
                              <p>
                                Result:{" "}
                                <Badge
                                  className={
                                    isCorrect
                                      ? "bg-green-500 text-white"
                                      : "bg-red-500 text-white"
                                  }
                                >
                                  {isCorrect ? "Correct" : "Incorrect"}
                                </Badge>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No questions available for this test.
                </div>
              )}

              <div className="mt-6 text-center text-gray-500 text-sm">
                Submitted on: {new Date(submittedAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TestResultsPage = () => {
  const location = useLocation();
  const { student_id, testId } = location.state || {};
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.auth);
  const { currentTest, testById, loading, error } = useSelector(
    (state) => state.test
  );

  useEffect(() => {
    if (testId) {
      dispatch(getCurrentTestMarks(testId));
      dispatch(getTestByid(testId));
    }
  }, [dispatch, testId]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!testById || !currentTest) {
    return <div>No test results found. Please try again later.</div>;

  }
  const totalQuestions = testById?.questions?.length || 0;
  const duration = testById?.duration || 60;

  const propsForResults = {
    studentName: data?.name || "",
    prn: data?.prn || "",
    branch: data?.branch || "",
    year: data?.year || "",
    testName: testById?.testName || "",
    totalMarks: testById?.totalMarks || 0,
    marksScored: currentTest?.marks_obtained || 0,
    analytics: {
      attemptsBreakdown: {
        correct:
          currentTest?.question_appeared?.filter(
            (q) => q.correct_answer === q.your_answer
          ).length || 0,
        incorrect:
          currentTest?.question_appeared?.filter(
            (q) => q.your_answer && q.correct_answer !== q.your_answer
          ).length || 0,
        skipped:
          currentTest?.question_appeared?.filter((q) => !q.your_answer)
            .length || 0,
      },
      timeManagement: {
        averageTimePerQuestion: (duration / totalQuestions).toFixed(1),
        totalTimeTaken: duration,
        timeLimit: duration,
      },
    },
    submittedAt: currentTest?.submittedAt || new Date().toISOString(),
    questions:
      testById?.questions?.map((question, index) => {
        const appearedQuestion = currentTest?.question_appeared?.[index] || {};
        return {
          text: question.question,
          type: question.type,
          options:
            question.options?.map((option) => ({
              text: option,
              isSelected: appearedQuestion?.your_answer === option,
              isCorrect: option === question.correctAnswer,
            })) || [],
          correctAnswer: question.correctAnswer,
        };
      }) || [],
  };

  return <StudentTestResults {...propsForResults} />;
};

export default TestResultsPage;
