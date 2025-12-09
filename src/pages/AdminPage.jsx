import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  ClipboardList,
  Settings,
  BarChart2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents, getAllTeachers } from "@/store/Slices/AuthSlice";
import { getTests } from "@/store/Slices/TestSlice";
import { useNavigate } from "react-router-dom";

import StudentsComponent from "./AdminPageComponent/StudentComponent";
import TeachersComponent from "./AdminPageComponent/TeacherComponent";
import TestsComponent from "./AdminPageComponent/TestComponent";
import TopicManager from "./TopicManager";
import { logout } from "@/store/Slices/AuthSlice";
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("students");
  const { students, teachers } = useSelector((state) => state.auth);
  const { tests } = useSelector((state) => state.test);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllStudents());
    dispatch(getAllTeachers());
    dispatch(getTests());
  }, [dispatch]);
  
  // Dashboard summary data
  const summaryData = {
    students: students?.length || 0,
    teachers: teachers?.length || 0,
    tests: tests?.length || 0,
    completionRate: 78,
  };
  
  const handleSignOut = async () => {
    const response = await dispatch(logout());
    if (response.payload.success) {
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                {/* <svg
                  className="w-8 h-8 text-blue-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                > */}
              </div>
              <div>
                <h1 className="text-2xl font-bold">SkillHub Admin</h1>
                <p className="text-sm text-blue-100">
                  Shah And Anchor Kutchhi Engineering College
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-md h-screen sticky top-0 pt-6">
          <nav className="px-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection("students")}
                  className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === "students"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span className="font-medium">Students</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("teachers")}
                  className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === "teachers"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <GraduationCap className="mr-3 h-5 w-5" />
                  <span className="font-medium">Teachers</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("tests")}
                  className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === "tests"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ClipboardList className="mr-3 h-5 w-5" />
                  <span className="font-medium">Tests</span>
                </button>
              </li>
              <li className="pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === "dashboard"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  <span className="font-medium">Topic Manager</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 px-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeSection === "students" && "Student Management"}
              {activeSection === "teachers" && "Teacher Management"}
              {activeSection === "tests" && "Test Management"}
            </h2>
            <p className="text-gray-500 mt-1">
              {activeSection === "students" && "View and manage all students"}
              {activeSection === "teachers" && "View and manage all teachers"}
              {activeSection === "tests" && "View and manage all tests"}
            </p>
          </div>

          {/* Summary Cards */}
          {activeSection !== "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Students
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {summaryData.students}
                    </h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Teachers
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {summaryData.teachers}
                    </h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Tests
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {summaryData.tests}
                    </h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Main Content Components */}
          <div className="bg-white rounded-lg shadow-sm ">
            {activeSection === "students" && (
              <StudentsComponent students={students} />
            )}
            {activeSection === "teachers" && (
              <TeachersComponent teachers={teachers} tests={tests} />
            )}
            {activeSection === "tests" && (
              <TestsComponent
                tests={tests}
                teachers={teachers}
                students={students}
              />
            )}
            {activeSection === "dashboard" && <TopicManager />}
          </div>
        </main>
      </div>
    </div>
  );
}
