import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
  Users,
  Target,
  Trophy,
  Award,
  Download,
  Search,
  ArrowUpDown,
  BookOpen,
  Clock,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getTestByid, getmarksbytestId } from "@/store/Slices/TestSlice";
import { useParams } from "react-router-dom";

const AdminTestResultsDashboard = () => {
  const { testId } = useParams();
  console.log("this is testid", testId);
  const dispatch = useDispatch();
  const { testById, marks = [] } = useSelector((state) => state.test);
  console.log("This is test by id", testById);
  console.log("This is marks", marks);
  useEffect(() => {
    dispatch(getTestByid(testId));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getmarksbytestId(testId));
  }, [dispatch]);
  // ... [previous state and data definitions remain the same]
  const gradeDistribution = [
    { grade: "A+", count: 15, avgAttendance: 95, performance: 95 },
    { grade: "A", count: 22, avgAttendance: 88, performance: 85 },
    { grade: "B+", count: 28, avgAttendance: 82, performance: 75 },
    { grade: "B", count: 20, avgAttendance: 75, performance: 65 },
    { grade: "C+", count: 12, avgAttendance: 70, performance: 55 },
    { grade: "C", count: 8, avgAttendance: 65, performance: 45 },
    { grade: "F", count: 5, avgAttendance: 45, performance: 30 },
  ];
  const marksArray = Array.isArray(marks) ? marks : [];
  const transformedData = marksArray.map((entry, index) => ({
    id: index + 1, // Assign a sequential ID
    name: entry.name,
    prn: entry.prn,
    email: entry.email,
    marks: entry.marks_obtained,
  }));

  const exportToCSV = () => {
    const csvContent = [
      "Name,PRN,Email,Marks",
      ...filteredAndSortedData.map(
        (student) =>
          `${student.name},${student.prn},${student.email},${student.marks}%`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "students_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // New data for performance correlation
  const performanceData = transformedData.map((student) => ({
    name: student.name,
    marks: student.marks,
    attendance: Math.random() * 30 + 70, // Mock attendance data
    assignments: Math.random() * 20 + 80, // Mock assignments score
    size: Math.random() * 100 + 50, // Size variable for bubble size
  }));

  // New data for performance trend (using area chart)
  const performanceTrend = [
    {
      week: "Week 1",
      below40: 20,
      between4060: 30,
      between6080: 35,
      above80: 15,
    },
    {
      week: "Week 2",
      below40: 15,
      between4060: 35,
      between6080: 30,
      above80: 20,
    },
    {
      week: "Week 3",
      below40: 10,
      between4060: 30,
      between6080: 40,
      above80: 20,
    },
    {
      week: "Week 4",
      below40: 8,
      between4060: 25,
      between6080: 42,
      above80: 25,
    },
    {
      week: "Week 5",
      below40: 5,
      between4060: 20,
      between6080: 45,
      above80: 30,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("marks");
  const [sortDirection, setSortDirection] = useState("desc");

  // Calculate statistics
  const stats = useMemo(() => {
    const marks = transformedData.map((student) => student.marks);
    return {
      totalStudents: transformedData.length,
      averageMarks: marks.reduce((a, b) => a + b, 0) / marks.length,
      highestMarks: Math.max(...marks),
      passRate:
        (marks.filter((mark) => mark >= 40).length / marks.length) * 100,
      distinctionRate:
        (marks.filter((mark) => mark >= 75).length / marks.length) * 100,
      medianMarks: marks.sort((a, b) => a - b)[Math.floor(marks.length / 2)],
      topPerformers: marks.filter((mark) => mark >= 90).length,
      belowAverage: marks.filter(
        (mark) => mark < marks.reduce((a, b) => a + b, 0) / marks.length
      ).length,
    };
  }, [transformedData]);

  // Trend data for line chart (mock data - replace with actual trend)
  const trendData = [
    { name: "Week 1", avgMarks: 65 },
    { name: "Week 2", avgMarks: 70 },
    { name: "Week 3", avgMarks: 68 },
    { name: "Week 4", avgMarks: 75 },
    { name: "Week 5", avgMarks: 72 },
    { name: "Current", avgMarks: stats.averageMarks },
  ];

  // Calculate frequency distribution
  const frequencyDistribution = useMemo(() => {
    const bins = [
      { range: "0-20%", count: 0 },
      { range: "21-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ];

    transformedData.forEach((student) => {
      const mark = student.marks;
      if (mark <= 20) bins[0].count++;
      else if (mark <= 40) bins[1].count++;
      else if (mark <= 60) bins[2].count++;
      else if (mark <= 80) bins[3].count++;
      else bins[4].count++;
    });

    return bins;
  }, [transformedData]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    return transformedData
      .filter((student) => {
        const name = student?.name?.toLowerCase() || "";
        const prn = student?.prn?.toLowerCase() || "";
        const email = student?.email?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return (
          name.includes(term) || prn.includes(term) || email.includes(term)
        );
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
            ? 1
            : -1;
      });
  }, [transformedData, searchTerm, sortField, sortDirection]);

  const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#F44336"];

  const passingmarks = Math.floor(testById?.totalMarks * 0.4);
  // const marksArray = Array.isArray(marks) ? marks : [];

  const uniqueStudents =
    marksArray.length > 0
      ? new Set(marksArray.map((entry) => entry.student))
      : new Set();

  const testDetails = {
    name: testById?.testName || "",
    branch: testById?.teacherName || "",
    semester: testById?.subject || "",
    totalMarks: testById?.totalMarks || 0,
    passingMarks: passingmarks,
    date: testById?.testDate || "",
    duration: testById?.duration || "",
    maxStudents: testById?.Students_alloted.length,
    attendedStudents: uniqueStudents.size,
  };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SkillHub Admin</h1>
                <p className="text-sm text-blue-100">
                  Shah And Anchor Kutchhi Engineering College
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                <Settings className="w-4 h-4 inline mr-1" /> Settings
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                  <span className="font-bold">SA</span>
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex bg-gray-50">
        {/* Sidebar */}
        
        <div className="h-screen fixed left-0 bg-white border-r border-gray-200 shadow-md">
          
        </div>

        <div className="w-full">
          {/* Test Details Card */}
          <Card className="m-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-800">
                  {testDetails.name}
                </CardTitle>
                <CardDescription className="text-blue-600">
                  {testDetails.branch} | {testDetails.semester}
                </CardDescription>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">
                    {testDetails.totalMarks} Marks
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">
                    {testDetails.duration}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-blue-800">
                  {testDetails.date}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Passing Marks</p>
                <p className="font-semibold text-blue-800">
                  {testDetails.passingMarks}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">
                  Total Students Appeared for the Test
                </p>
                <p className="font-semibold text-blue-800">
                  {testDetails.attendedStudents} / {testDetails.maxStudents}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Existing content */}
          <div className="space-y-6 m-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-8 gap-4">
              <Card className="col-span-2 transform transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalStudents}
                  </div>
                  <p className="text-xs text-gray-500">Enrolled in test</p>
                </CardContent>
              </Card>
              <Card className="col-span-2 transform transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Marks
                  </CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageMarks.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">Class average</p>
                </CardContent>
              </Card>
              <Card className="col-span-2 transform transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Performers
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.topPerformers}
                  </div>
                  <p className="text-xs text-gray-500">Above 90%</p>
                </CardContent>
              </Card>
              <Card className="col-span-2 transform transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pass Rate
                  </CardTitle>
                  <Award className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.passRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">Success rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Marks Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Marks Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={frequencyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Search and Table section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow max-w-sm">
                  <Input
                    placeholder="Search by name, PRN, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => {
                            setSortField("name");
                            setSortDirection(
                              sortDirection === "asc" ? "desc" : "asc"
                            );
                          }}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        PRN
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => {
                            setSortField("marks");
                            setSortDirection(
                              sortDirection === "asc" ? "desc" : "asc"
                            );
                          }}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>Marks</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedData.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.prn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`font-medium ${
                              student.marks >= 80
                                ? "text-green-600"
                                : student.marks >= 60
                                  ? "text-blue-600"
                                  : student.marks >= 40
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                          >
                            {student.marks}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default AdminTestResultsDashboard;
