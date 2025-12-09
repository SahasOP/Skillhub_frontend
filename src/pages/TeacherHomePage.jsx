import React, { useEffect } from "react";
import {
  Bell,
  FileText,
  PieChart,
  Users,
  ChevronRight,
  BarChart3,
  Calendar,
  BookOpen,
  Layers,
  Award,
  TrendingUp,
  UserCircle,
  Settings,
} from "lucide-react";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getTestsbyTeacherid } from "@/store/Slices/TestSlice";

const HomePage = () => {

  const { data } = useSelector((state) => state.auth)
  const { tests } = useSelector((state) => state.test)
  console.log(tests)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTestsbyTeacherid(data?._id))
  }, [dispatch])

  const getTotalStudentsAlloted = () => {
    return tests?.reduce((total, test) => {
      return total + (test.Students_alloted?.length || 0);
    }, 0);
  };

  const getUpcomingTests = () => {
    if (!tests) return [];
    const today = new Date().toISOString().split('T')[0];
    return [...tests]
      .filter(test => test?.testDate >= today)
      .sort((a, b) => new Date(a?.testDate) - new Date(b?.testDate))
      .slice(0, 3);
  };

  const getRecentActivities = () => {
    if (!tests) return [];
    return [...tests]
      .sort((a, b) => new Date(b?.testCreationDate) - new Date(a?.testCreationDate))
      .slice(0, 3);
  };

  return (
    <div className="flex bg-gray-50">
      <div className="flex h-screen fixed">
        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen pb-8 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, {data?.name}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-md">
                {data?.name
                  ?.split(' ')
                  .filter(Boolean)
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
                  .replace(/^(.)/, (m) => m.toUpperCase())
                  .replace(/^(.)(.)$/, (match, p1, p2) => p1.toUpperCase() + p2.toUpperCase())}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Welcome to Skill Hub!
                </h3>
                <p className="text-blue-100 mb-4 max-w-3xl">
                  Streamline your teaching experience with our comprehensive
                  test management system. Create tests, assign them to students,
                  and view detailed performance reports.
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition shadow">
                  Explore Features
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Tests</span>
              </div>
              <h4 className="text-2xl font-bold mb-1">{tests.length}</h4>
              <p className="text-sm text-gray-500">Total tests created</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Students
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-1">{getTotalStudentsAlloted()}</h4>
              <p className="text-sm text-gray-500">Active students</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Completed
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-1">87%</h4>
              <p className="text-sm text-gray-500">Test completion rate</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Performance
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-1">76%</h4>
              <p className="text-sm text-gray-500">Average score</p>
            </div>
          </div>

          {/* Quick Actions */}
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Create Test Button */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Create Test</h4>
                    <p className="text-blue-100">
                      Design a new assessment for your students
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <button className="mt-4 flex items-center text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition">
                  <span>Get Started</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* View Results Button */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl shadow hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">View Results</h4>
                    <p className="text-green-100">
                      Analyze student performance data
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white">
                    <PieChart className="h-6 w-6" />
                  </div>
                </div>
                <button className="mt-4 flex items-center text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition">
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Assign Tests Button */}
            {/* <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl shadow hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Assign Tests</h4>
                    <p className="text-purple-100">
                      Distribute tests to student groups
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <button className="mt-4 flex items-center text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition">
                  <span>Assign Now</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div> */}
          </div>

          {/* Recent Activity & Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {getRecentActivities().map((test) => (
                  <div key={test._id} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {test.testName} Created
                      </h4>
                      <p className="text-sm text-gray-500">
                        You created a new test in {test.subject} with {test.questions?.length || 0} questions
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(test.testCreationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700">
                View All Activity
              </button>
            </div>

            {/* Upcoming Tests */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Upcoming Tests</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {getUpcomingTests().map((test) => (
                  <div key={test._id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-medium">{test.testName}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(test.testDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {test.Students_alloted?.length || 0} students
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700">
                View Calendar
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <p className="text-gray-600 mb-1">
                  Email: support@skillhub.com
                </p>
                <p className="text-gray-600 mb-1">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-600">
                  Address: 123 Learning Street, Education City
                </p>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Support Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600">Weekend: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
