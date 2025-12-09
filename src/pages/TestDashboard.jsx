import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import SubHeading from "../custom/StudentSubheading";
import { Link, useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import {
  Calendar,
  Clock,
  Search,
  BookOpen,
  Timer,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BarChart2,
  GraduationCap,
  Target,
  Trophy,
  Users,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  ChevronRight,
  LifeBuoy,
  BookOpenCheck,
  Bell,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getMarksbystudentid, getTests, getTestsByStudentId } from "../store/Slices/TestSlice";

const TestCard = ({ test, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [score, setScore] = useState(null);
  const { data } = useSelector((state) => state.auth)
  const student_id = data?._id
  const testId = test?._id
  // console.log('This is teacher',teacher);
  // console.log('THis is test',test);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const marks = useSelector((state) => state.test && state.test.marks ? state.test.marks : []);

  // useEffect(() => {
  //   if (!marks.length) {
  //     dispatch(getMarksbystudentid()); // Dispatch an action to fetch marks
  //   }
  // }, [dispatch, marks.length]);

  useEffect(() => {
    // console.log(marks, "founds");
    const foundMark = marks?.find((mark) => mark.test_id === test._id);
    if (foundMark) {
      setScore(foundMark.marks_obtained);
    }
  }, [marks, test._id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);


  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-50 text-green-600 border-green-200";
      case "upcoming":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "completed":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ongoing":
        return <Timer className="w-4 h-4 mr-1" />;
      case "upcoming":
        return <Clock className="w-4 h-4 mr-1" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };
  const handleNavigate = (test) => {
    // testId = test._id
    navigate('/marksheet', { state: { student_id, testId } })
  }

  const handleClick = (id) => {
    window.location.href = `/test/${id}`; // Replace with the actual route path
  };

  const calculateTimeDifference = (testDate, testTime) => {
    const now = new Date();
    const testDateTime = new Date(`${testDate}T${testTime}:00`);

    const diffMilliseconds = testDateTime.getTime() - now.getTime();

    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    if (diffSeconds < 0) {
      return null; // Return null if the time difference is negative
    }

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds`;
    }

    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} hours`;
  };

  const [timeDifference, setTimeDifference] = useState(
    calculateTimeDifference(test.testDate, test.testTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeDifference = calculateTimeDifference(test.testDate, test.testTime);
      if (newTimeDifference === null) {
        clearInterval(interval); // Stop the interval if time difference is negative
        // Optionally, you can trigger a state update or callback to remove the test
      } else {
        setTimeDifference(newTimeDifference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [test.testDate, test.testTime]);

  return (
    <Card
      className={`transform cursor-pointer transition-all duration-500 ease-out bg-white border-gray-100 hover:shadow-lg hover:scale-[1.02] mb-6 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    // onClick={() => handleClick(test._id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Badge
                className={`px-3 py-1 ${getStatusColor(test.status)} flex items-center`}
              >
                {getStatusIcon(test.status)}
                {test.status?.charAt(0).toUpperCase() + test.status?.slice(1)}
              </Badge>
              {test.importance && (
                <Badge className="bg-red-50 text-red-600 border-red-200 flex items-center px-3 py-1">
                  <Bell className="w-3 h-3 mr-1" />
                  High Priority
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {test.testName}
              </h3>
              {test.participants && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  {test.participants.length} participants
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{test.subject}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{test.testDate}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{test.duration} minutes</span>
                </div>
              </div>

              {test.instructions && (
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                    <Target className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Total Marks: {test.questions.length * test.marksPerQuestion}</span>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                    <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{test.teacherName}</span>
                  </div>
                  {test.status === "completed" && (
                    <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                      <Trophy className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-medium text-green-600">
                        {score !== null ? score : "Loading..."}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ml-6 flex flex-col items-end space-y-2 text-white">
            {test.status === "ongoing" && (
              <Link to="/test">
                <Button
                  onClick={() => handleClick(test._id)}
                  className="bg-blue-600 hover:bg-blue-700 transition-all flex">
                  Start Test <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            )}
            {test.status === "upcoming" && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Starts in</p>
                <p className="text-lg font-semibold text-blue-600">
                  {calculateTimeDifference(test.testDate, test.testTime)}
                </p>
              </div>
            )}
            {test.status === "completed" && (
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 transition-all flex "
                onClick={() => handleNavigate(test)}
              >
                View Results <BarChart2 className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentTestDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const { data } = useSelector((state) => state.auth)
  const { tests, loading, error, marks } = useSelector((state) => state.test);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMarksbystudentid());
  }, [dispatch]);
  useEffect(() => {
    if (!data || !data._id) return;
    dispatch(getTestsByStudentId(data._id));
  }, [data?._id]); // optional: remove dispatch if it’s stable

  // Process tests to add status
  const processedTests = tests.map((test) => {
    const testDateTime = new Date(`${test.testDate}T${test.testTime}:00`);
    const now = new Date();
    const testEndTime = new Date(testDateTime);
    testEndTime.setMinutes(testEndTime.getMinutes() + (test.duration || 0));
    const endOfTestDay = new Date(testDateTime);
    endOfTestDay.setHours(23, 59, 59, 999);

    const isCompleted =
      !!test.Students_appeared &&
      Array.isArray(test.Students_appeared) &&
      !!data?._id &&
      test.Students_appeared.some(
        (stu) =>
          stu?.student &&
          String(stu.student).trim() === String(data._id).trim()
      );


    let status = "not visited";
    if (now < testDateTime) {
      status = "upcoming";
    } else if (isCompleted) {
      status = "completed";
    } else if (now >= testDateTime && now <= testEndTime && now <= endOfTestDay) {
      status = "ongoing";
    }

    return { ...test, status };
  });

  // Filter tests based on search query
  const filteredTests = processedTests.filter(test => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      test.testName?.toLowerCase().includes(searchLower) ||
      test.subject?.toLowerCase().includes(searchLower) ||
      test.teacherName?.toLowerCase().includes(searchLower)
    );
  });

  // Get tests for specific status
  const getTestsByStatus = (status) => {
    return status === "all"
      ? filteredTests
      : filteredTests.filter(test => test.status === status);
  };

  const getStatusCount = (status) => {
    return processedTests.filter((test) => test.status === status).length;
  };

  // Render test cards with loading and empty states
  const renderTestsList = (tests) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (tests.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tests found
          </h3>
          <p className="text-gray-500">
            {searchQuery ? "Try adjusting your search terms" : "No tests available yet"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {tests.map((test, index) => (
          <TestCard key={test._id} test={test} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="h-screen fixed">
        <Sidebar>
        </Sidebar>
      </div>

      <div className="w-full">
        <SubHeading />
        <div className="flex bg-gray-50">
          <div className="w-full">
            <div className="min-h-screen">
              <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Title and Search Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl font-bold text-gray-900">
                        My Tests
                      </h1>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 p-2">
                        {tests?.length} Tests
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      View and manage your academic assessments
                    </p>
                  </div>

                  {/* Search Section */}
                  <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search by test name, subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Status Cards Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* All Tests Card */}
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10 transition-opacity duration-300 hover:opacity-20" />
                      <div
                        className="relative p-6 bg-white border-2 border-blue-100 rounded-xl hover:border-blue-300 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedTab("all")}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-blue-600">
                              All Tests
                            </p>
                            <p className="text-3xl font-bold text-blue-700 mt-2">
                              {tests?.length}
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <BookOpenCheck className="w-6 h-6 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ongoing Tests Card */}
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-10 transition-opacity duration-300 hover:opacity-20" />
                      <div
                        className="relative p-6 bg-white border-2 border-green-100 rounded-xl hover:border-green-300 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedTab("ongoing")}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-green-600">
                              Ongoing
                            </p>
                            <p className="text-3xl font-bold text-green-700 mt-2">
                              {getStatusCount("ongoing")}
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <Timer className="w-6 h-6 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Tests Card */}
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-10 transition-opacity duration-300 hover:opacity-20" />
                      <div
                        className="relative p-6 bg-white border-2 border-purple-100 rounded-xl hover:border-purple-300 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedTab("upcoming")}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-purple-600">
                              Upcoming
                            </p>
                            <p className="text-3xl font-bold text-purple-700 mt-2">
                              {getStatusCount("upcoming")}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Completed Tests Card */}
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-10 transition-opacity duration-300 hover:opacity-20" />
                      <div
                        className="relative p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-gray-300 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedTab("completed")}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-600">
                              Completed
                            </p>
                            <p className="text-3xl font-bold text-gray-700 mt-2">
                              {getStatusCount("completed")}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Section */}
                <Tabs
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  className="w-full bg-white rounded-lg shadow-sm p-2 mb-6"
                >
                  <TabsList className="flex w-full space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-1">
                    <TabsTrigger
                      value="all"
                      className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedTab === "all"
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                          : "text-white hover:bg-white/20"
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <BookOpenCheck className="w-4 h-4" />
                        <span>All Tests</span>
                      </div>
                    </TabsTrigger>

                    <TabsTrigger
                      value="ongoing"
                      className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedTab === "ongoing"
                          ? "bg-white text-green-600 shadow-sm ring-1 ring-black/5"
                          : "text-white hover:bg-white/20"
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Timer className="w-4 h-4" />
                        <span>Ongoing</span>
                      </div>
                    </TabsTrigger>

                    <TabsTrigger
                      value="upcoming"
                      className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedTab === "upcoming"
                          ? "bg-white text-purple-600 shadow-sm ring-1 ring-black/5"
                          : "text-white hover:bg-white/20"
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Upcoming</span>
                      </div>
                    </TabsTrigger>

                    <TabsTrigger
                      value="completed"
                      className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedTab === "completed"
                          ? "bg-white text-gray-800 shadow-sm ring-1 ring-black/5"
                          : "text-white hover:bg-white/20"
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content */}
                  <div className="mt-6">
                    <TabsContent
                      value="all"
                      className="space-y-6 animate-in fade-in-50 duration-200"
                    >
                      {renderTestsList(getTestsByStatus("all"))}
                    </TabsContent>

                    <TabsContent
                      value="ongoing"
                      className="space-y-6 animate-in fade-in-50 duration-200"
                    >
                      {renderTestsList(getTestsByStatus("ongoing"))}
                    </TabsContent>

                    <TabsContent
                      value="upcoming"
                      className="space-y-6 animate-in fade-in-50 duration-200"
                    >
                      {renderTestsList(getTestsByStatus("upcoming"))}
                    </TabsContent>

                    <TabsContent
                      value="completed"
                      className="space-y-6 animate-in fade-in-50 duration-200"
                    >
                      {renderTestsList(getTestsByStatus("completed"))}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default StudentTestDashboard;
