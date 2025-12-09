import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUp, ArrowDown, Medal, TrendingUp } from 'lucide-react';
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import SubHeading from "../custom/Subheading";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
  Camera,
  User2,
  ChevronUp,
} from "lucide-react";

const StudentMarksPage = () => {
  const testData = [
    { testName: 'Test 1', marks: 85, totalMarks: 100, date: '2024-01-10' },
    { testName: 'Test 2', marks: 92, totalMarks: 100, date: '2024-01-25' },
    { testName: 'Test 3', marks: 78, totalMarks: 100, date: '2024-02-08' },
    { testName: 'Test 4', marks: 88, totalMarks: 100, date: '2024-02-22' },
    { testName: 'Test 5', marks: 95, totalMarks: 100, date: '2024-03-07' },
  ];

  const subjectWiseData = [
    { subject: 'Mathematics', marks: 92, average: 85 },
    { subject: 'Physics', marks: 88, average: 82 },
    { subject: 'Chemistry', marks: 85, average: 80 },
    { subject: 'Biology', marks: 90, average: 83 },
  ];

  const calculateProgress = () => {
    const lastTwo = testData.slice(-2);
    return {
      difference: lastTwo[1].marks - lastTwo[0].marks,
      percentage: ((lastTwo[1].marks - lastTwo[0].marks) / lastTwo[0].marks * 100).toFixed(1)
    };
  };

  const progress = calculateProgress();
  const averageScore = (testData.reduce((acc, curr) => acc + curr.marks, 0) / testData.length).toFixed(1);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-screen fixed left-0 bg-white border-r border-gray-200">
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
<div className='w-full'>
<SubHeading/>
{/* Main Content */}
<div className="flex-1 p-8">
        
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Latest Score</p>
                  <h3 className="text-2xl font-bold">{testData[testData.length - 1].marks}%</h3>
                </div>
                {progress.difference >= 0 ? (
                  <ArrowUp className="text-green-500 h-8 w-8" />
                ) : (
                  <ArrowDown className="text-red-500 h-8 w-8" />
                )}
              </div>
              <p className={`text-sm mt-2 ${progress.difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {progress.difference >= 0 ? '+' : ''}{progress.percentage}% since last test
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Score</p>
                  <h3 className="text-2xl font-bold">{averageScore}%</h3>
                </div>
                <Medal className="text-blue-500 h-8 w-8" />
              </div>
              <p className="text-sm mt-2 text-gray-500">Across all tests</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Tests Taken</p>
                  <h3 className="text-2xl font-bold">{testData.length}</h3>
                </div>
                <TrendingUp className="text-purple-500 h-8 w-8" />
              </div>
              <p className="text-sm mt-2 text-gray-500">Total assessments completed</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="gap-6">
            {/* Progress Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Score Progress</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={testData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="testName" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="marks"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Tests Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Test Name</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Marks</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {testData.slice().reverse().map((test, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">{test.testName}</td>
                      <td className="py-3 px-4">{new Date(test.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{test.marks}</td>
                      <td className="py-3 px-4">{test.totalMarks}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {(test.marks / test.totalMarks * 100).toFixed(1)}%
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
</div>
      
    </div>
  );
};

export default StudentMarksPage;