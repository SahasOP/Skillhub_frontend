import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Button from "@/ui/button";
import Sidebar from "../custom/Sidebar";
import SubHeading from "../custom/Subheading";
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
  ArrowUpDown,
  Download,
  Search,
  Users,
  Target,
  Trophy,
  Award,
  Clock,
  BookOpen,
} from "lucide-react";

import { getTestByid, getmarksbytestId } from "@/store/Slices/TestSlice";

const TestResultsDashboard = () => {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const { testById, marks = [], loading, error } = useSelector(
    (state) => state.test
  );

  useEffect(() => {
    if (testId) {
      dispatch(getTestByid(testId));
      dispatch(getmarksbytestId(testId));
    }
  }, [dispatch, testId]);

  // Use students from testById.Students_appeared for accurate and consistent data.
  const students = Array.isArray(testById?.Students_appeared)
    ? testById.Students_appeared
    : [];

  const totalMarks = Number(testById?.totalMarks) || 0;
  const passingMarks = (totalMarks * 0.4).toFixed(1);

  const transformedData = students.map((student, idx) => {
    const marksObtained = Number(student.marks_obtained) || 0;
    const percent = totalMarks
      ? ((marksObtained / totalMarks) * 100).toFixed(1)
      : "0.0";

    return {
      id: idx + 1,
      name: student.name || "Unknown",
      prn: student.prn || "N/A",
      email: student.email || "N/A",
      marks: marksObtained,
      percent: parseFloat(percent),
    };
  });

  const stats = useMemo(() => {
    if (transformedData.length === 0) {
      return {
        totalStudents: 0,
        averageMarks: 0,
        topPerformers: 0,
        passRate: 0,
      };
    }
    const marksArr = transformedData.map((s) => s.marks);
    const totalStudents = transformedData.length;
    const averageMarks =
      marksArr.reduce((a, b) => a + b, 0) / totalStudents || 0;
    const passRate = (marksArr.filter((m) => m >= passingMarks).length / totalStudents) * 100 || 0;
    const topPerformers = marksArr.filter((m) => m >= 90).length || 0;
    return { totalStudents, averageMarks, passRate, topPerformers };
  }, [transformedData, passingMarks]);

  const frequencyDistribution = useMemo(() => {
    const bins = [
      { range: "0-20%", count: 0 },
      { range: "21-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ];
    transformedData.forEach(({ percent }) => {
      if (percent <= 20) bins[0].count++;
      else if (percent <= 40) bins[1].count++;
      else if (percent <= 60) bins[2].count++;
      else if (percent <= 80) bins[3].count++;
      else bins[4].count++;
    });
    return bins;
  }, [transformedData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("percent");
  const [sortDirection, setSortDirection] = useState("desc");

  const filteredAndSortedData = useMemo(() => {
    return transformedData
      .filter(({ name, prn, email }) => {
        const term = searchTerm.toLowerCase();
        return (
          name.toLowerCase().includes(term) ||
          prn.toLowerCase().includes(term) ||
          email.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal === bVal) return 0;
        if (sortDirection === "asc") return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
  }, [transformedData, searchTerm, sortField, sortDirection]);

  const exportToCSV = () => {
    const header = ["Name", "PRN", "Email", "Marks", "Percentage"];
    const rows = filteredAndSortedData.map(
      (s) => [s.name, s.prn, s.email, s.marks, s.percent].join(",")
    );
    const csvContent = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${testById?.testName || "test"}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <div className="h-screen fixed left-0 bg-white border-r border-gray-200 shadow-md">
        <Sidebar>
        </Sidebar>
      </div>

      <div className="w-full">
        <SubHeading />

        {/* Test Info & Marks */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800">
                {testById?.testName || "Test Name"}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {testById?.teacherName || "Teacher"} | {testById?.subject || "Subject"}
              </CardDescription>
            </div>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-700">{totalMarks} Marks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-700">{testById?.duration || "-"} mins</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-700">Passing Marks: {passingMarks}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-blue-800 font-semibold">{testById?.testDate || "N/A"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Students Appeared</p>
              <p className="text-blue-800 font-semibold">
                {students.length} / {testById?.Students_alloted?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-green-600 font-bold">{stats.averageMarks.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-transform">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500">Enrolled</p>
            </CardContent>
          </Card>
          {/* <Card className="hover:shadow-lg transition-transform">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Top Performers
              </CardTitle>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.topPerformers}</p>
              <p className="text-xs text-gray-500">Above 90%</p>
            </CardContent>
          </Card> */}
          <Card className="hover:shadow-lg transition-transform">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
              <Award className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.passRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Success rate</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-transform">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Distinctions</CardTitle>
              <Target className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {transformedData.filter((s) => s.percent >= 75).length}
              </p>
              <p className="text-xs text-gray-500">Above 75%</p>
            </CardContent>
          </Card>
        </div>

        {/* Marks Distribution Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Marks Distribution</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search & Export */}
        <div className="flex items-center space-x-4 mb-4 max-w-md">
          <div className="relative flex-grow">
            <Input
              placeholder="Search by name, PRN, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </Button>
        </div>

        {/* Students Table */}
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full rounded-lg border-collapse bg-white">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    PRN
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transformedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  transformedData.map(
                    ({ id, name, prn, email, marks, percent }) => (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                          {prn}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                          {email}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold">
                          {marks}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-sm font-semibold ${
                            percent >= 80
                              ? "text-green-600"
                              : percent >= 60
                              ? "text-blue-600"
                              : percent >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {percent}%
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestResultsDashboard;
