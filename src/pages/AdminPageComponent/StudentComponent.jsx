import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllTeachers } from "@/store/Slices/AuthSlice";

const StudentsComponent = ({ students }) => {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState({
    name: "",
    email: "",
    classroom: "",
    rollNo: "",
    prn: ""
  }); 
  const dispatch = useDispatch();
  const { Teachers } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllTeachers());
  }, [dispatch]);

  const getTeacherNameById = (teacherId) => {
    console.log(Teachers, "teachers");
    console.log(teacherId, "teacherId");
    const teacher = Teachers?.find((t) => t._id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedData = () => {
    if (!students || !Array.isArray(students)) return [];
    
    return students
      .filter((student) =>
        Object.values(student).some((value) =>
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

  // const handleEditClick = (student) => {
  //   setEditingStudent({
  //     _id: student._id,
  //     name: student.name,
  //     email: student.email,
  //     classroom: student.classroom,
  //     rollNo: student.rollNo,
  //     prn: student.prn
  //   });
  //   setIsEditModalOpen(true);
  // };

  // const handleEditSave = () => {
  //   // Here you would dispatch an update action
  //   console.log("Updating student:", editingStudent);
  //   // dispatch(updateStudent(editingStudent));
  //   setIsEditModalOpen(false);
  // };

  const handleDeleteStudent = async(studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      console.log("Deleting student:", studentId);
      dispatch(deleteUser(studentId))
    }
  };

  const calculateStudentProgress = (student) => {
    if (!student.test_appeared) return { completed: 0, total: 0, percentage: "0%" };
    
    const testsCompleted = student.test_appeared.length;
    // Assuming total assigned is a property you'd add or derive
    const totalAssigned = testsCompleted; // Placeholder
    
    return {
      completed: testsCompleted,
      total: totalAssigned,
      percentage: totalAssigned > 0 ? `${Math.round((testsCompleted / totalAssigned) * 100)}%` : "0%"
    };
  };

  const calculateAverageScore = (student) => {
    if (!student.test_appeared || student.test_appeared.length === 0) return "N/A";
    
    const totalMarks = student.test_appeared.reduce((sum, test) => sum + test.marks_obtained, 0);
    return `${Math.round((totalMarks / student.test_appeared.length))}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-500">Manage your student records</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Search students..."
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
              setEditingStudent({
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
            Add New Student
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
                <TableHead className="py-3 px-4 text-left font-medium text-gray-700">
                  <Button variant="ghost" onClick={() => handleSort("classroom")} className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    Class
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Roll No</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Tests Status</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData().length > 0 ? (
                filteredAndSortedData().map((student) => {
                  const progress = calculateStudentProgress(student);
                  return (
                    <TableRow key={student._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <TableCell className="py-4 px-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-gray-600">{student.email}</TableCell>
                      <TableCell className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.classroom}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-gray-600">{student.rollNo}</TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-full max-w-xs">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{progress.completed}/{progress.total} tests</span>
                              <span>Avg: {calculateAverageScore(student)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: progress.percentage }}
                              ></div>
                            </div>
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
                              setSelectedStudent(student);
                              setIsModalOpen(true);
                            }}
                          >
                            <EyeOpenIcon className="h-4 w-4" />
                          </Button>
                          {/* <Button 
                            variant="outline" 
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            onClick={() => handleEditClick(student)}
                          >
                            <Pencil1Icon className="h-4 w-4" />
                          </Button> */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteStudent(student._id)}
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
                    No students found. Add a new student or adjust your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-blue-600 text-white">
              <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-blue-700 rounded-full p-1">
                <Cross2Icon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
                    <div className="space-y-2">
                      <p className="flex items-center text-gray-800">
                        <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedStudent.email}
                      </p>
                      <p className="flex items-center text-gray-800">
                        <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Last Login: {new Date(selectedStudent.lastLogin).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Academic Information</h4>
                    <div className="space-y-2">
                      <p className="flex items-center text-gray-800">
                        <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Class: {selectedStudent.classroom}
                      </p>
                      <p className="flex items-center text-gray-800">
                        <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Roll No: {selectedStudent.rollNo}
                      </p>
                      <p className="flex items-center text-gray-800">
                        <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        PRN: {selectedStudent.prn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                {selectedStudent.test_appeared && selectedStudent.test_appeared.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Subject</TableHead>
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Marks</TableHead>
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Teacher</TableHead>
                          <TableHead className="py-3 px-4 text-left font-medium text-gray-700">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.test_appeared.map((test, index) => (
                          <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell className="py-3 px-4 font-medium">{test.subject_name}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                test.marks_obtained >= 70 ? 'bg-green-100 text-green-800' :
                                test.marks_obtained >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {test.marks_obtained}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-gray-600">{getTeacherNameById(test.teacher_name)}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                test.marks_obtained >= 40 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {test.marks_obtained >= 40 ? 'Pass' : 'Fail'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No test results available</p>
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
                {editingStudent._id ? "Edit Student" : "Add New Student"}
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
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
                  <Input
                    value={editingStudent.classroom}
                    onChange={(e) => setEditingStudent({...editingStudent, classroom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter classroom"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                    <Input
                      value={editingStudent.rollNo}
                      onChange={(e) => setEditingStudent({...editingStudent, rollNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter roll number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PRN</label>
                    <Input
                      value={editingStudent.prn}
                      onChange={(e) => setEditingStudent({...editingStudent, prn: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter PRN"
                    />
                  </div>
                </div>
                {!editingStudent._id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input
                      type="password"
                      onChange={(e) => setEditingStudent({...editingStudent, password: e.target.value})}
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
                  {editingStudent._id ? "Update Student" : "Create Student"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default StudentsComponent;