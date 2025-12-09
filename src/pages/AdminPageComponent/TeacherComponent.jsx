import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CaretSortIcon, Cross2Icon, PlusIcon, Pencil1Icon, TrashIcon, EyeOpenIcon } from "@radix-ui/react-icons";
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
import { useDispatch } from "react-redux";
import { deleteUser } from "@/store/Slices/AuthSlice";

const TeachersComponent = ({ teachers, tests }) => {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch()
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState({
    name: "",
    email: "",
    classroom: "",
    rollNo: "",
    prn: ""
  });

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedData = () => {
    if (!teachers || !Array.isArray(teachers)) return [];
    
    return teachers
      .filter((teacher) =>
        Object.values(teacher).some((value) =>
          value && typeof value === 'string' && 
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

  // const handleEditClick = (teacher) => {
  //   setEditingTeacher({
  //     _id: teacher._id,
  //     name: teacher.name,
  //     email: teacher.email,
  //     classroom: teacher.classroom,
  //     rollNo: teacher.rollNo,
  //     prn: teacher.prn
  //   });
  //   setIsEditModalOpen(true);
  // };

  // const handleEditSave = () => {
  //   // Here you would dispatch an update action
  //   console.log("Updating teacher:", editingTeacher);
  //   // dispatch(updateTeacher(editingTeacher));
  //   setIsEditModalOpen(false);
  // };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      console.log("Deleting teacher:", teacherId);
      dispatch(deleteUser(teacherId))
    }
  };

  const getTeacherStats = (teacherId) => {
    if (!tests || !Array.isArray(tests)) return { totalTests: 0, activeTests: 0 };
    
    const teacherTests = tests.filter(test => test.teacherId === teacherId);
    const now = new Date();
    const activeTests = teacherTests.filter(test => {
      const testDate = new Date(test.testDate);
      return testDate >= now;
    });
    
    return {
      totalTests: teacherTests.length,
      activeTests: activeTests.length,
      percentage: teacherTests.length > 0 ? `${Math.round((activeTests.length / teacherTests.length) * 100)}%` : "0%"
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teachers</h2>
          <p className="text-gray-500">Manage your teacher records</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          {/* <Button 
            onClick={() => {
              setEditingTeacher({
                name: "",
                email: "",
                classroom: "",
                rollNo: "",
                prn: ""
              });
              setIsEditModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Teacher
          </Button> */}
        </div>
      </div>

      <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="py-3 px-4 text-left font-medium text-gray-700">
                  <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-gray-700">
                  <Button variant="ghost" onClick={() => handleSort("email")} className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    Email
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="py-3 text-left font-medium text-gray-700">
                  <Button variant="ghost" onClick={() => handleSort("branch")} className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    Branch
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="flex justify-center py-3 px-4 text-left font-medium text-gray-700">Tests Created</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData().length > 0 ? (
                filteredAndSortedData().map((teacher) => {
                  const stats = getTeacherStats(teacher._id);
                  return (
                    <TableRow key={teacher._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <TableCell className="py-4 px-4">
                        <div className="font-medium text-gray-900">{teacher.name}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-gray-600">{teacher.email}</TableCell>
                      <TableCell className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {teacher.branch}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-full max-w-xs">
                            <div className="flex justify-center text-l text-gray-600 mb-1">
                              {/* <span>{stats.activeTests}/{stats.totalTests} active tests</span> */}
                              {stats.totalTests}
                            </div>
                            {/* <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: stats.percentage }}
                              ></div>
                            </div> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setIsModalOpen(true);
                            }}
                          >
                            <EyeOpenIcon className="h-4 w-4" />
                          </Button>
                          {/* <Button 
                            variant="outline" 
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            onClick={() => handleEditClick(teacher)}
                          >
                            <Pencil1Icon className="h-4 w-4" />
                          </Button> */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteTeacher(teacher._id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                    No teachers found. Add a new teacher or adjust your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Details Modal */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-blue-600 text-white">
              <h3 className="text-xl font-semibold">{selectedTeacher.name}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-blue-700 rounded-full p-1">
                <Cross2Icon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              

              <div>
                <h3 className="text-lg font-semibold mb-4">Created Tests</h3>
                {tests && tests.filter(test => test.teacherId === selectedTeacher._id).length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Test Name</TableHead>
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Date</TableHead>
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Duration</TableHead>
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tests
                          .filter(test => test.teacherId === selectedTeacher._id)
                          .map((test) => {
                            const testDate = new Date(test.testDate);
                            const now = new Date();
                            const isActive = testDate >= now;
                            
                            return (
                              <TableRow key={test._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <TableCell className="py-3 px-4 font-medium">{test.testName}</TableCell>
                                <TableCell className="py-3 px-4">{new Date(test.testDate).toLocaleDateString()}</TableCell>
                                <TableCell className="py-3 px-4">{test.duration} min</TableCell>
                                <TableCell className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {isActive ? 'Active' : 'Completed'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No tests created yet</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end bg-gray-50">
              <Button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {/* {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-blue-600 text-white">
              <h3 className="text-xl font-semibold">
                {editingTeacher._id ? "Edit Teacher" : "Add New Teacher"}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-blue-700 rounded-full p-1">
                <Cross2Icon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter teacher name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
                  <Input
                    value={editingTeacher.classroom}
                    onChange={(e) => setEditingTeacher({...editingTeacher, classroom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter classroom"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <Input
                      value={editingTeacher.rollNo}
                      onChange={(e) => setEditingTeacher({...editingTeacher, rollNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter ID number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PRN</label>
                    <Input
                      value={editingTeacher.prn}
                      onChange={(e) => setEditingTeacher({...editingTeacher, prn: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter PRN"
                    />
                  </div>
                </div>
                {!editingTeacher._id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input
                      type="password"
                      onChange={(e) => setEditingTeacher({...editingTeacher, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Create password"
                    />
                    <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end bg-gray-50">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {editingTeacher._id ? "Update Teacher" : "Create Teacher"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TeachersComponent;