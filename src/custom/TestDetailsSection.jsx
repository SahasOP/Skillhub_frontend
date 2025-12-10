import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";

import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import Button from "@/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LayoutDashboard, Search, X, UserPlus, School, Calendar, GraduationCap, Book, Timer, CalendarClock, Calculator, Bookmark, HelpCircle, BookOpen } from "lucide-react";
import { createTest } from "../store/Slices/TestSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents } from "@/store/Slices/AuthSlice";
import { toast } from "react-hot-toast";
import Field from "./common/Field";
import SelectField from "./common/SelectField";
import StudentListItem from "./common/StudentListItem";

// Department and year options
const departments = [
  { value: "CM", label: "Computer Science" },
  { value: "IT", label: "Information Technology" },
  { value: "ETC", label: "Electronics & Telecommunication" },
  { value: "AIDS", label: "AI & Data Science" },
];

const years = [
  { value: "FY", label: "First Year" },
  { value: "SY", label: "Second Year" },
  { value: "TY", label: "Third Year" },
  { value: "LY", label: "Fourth Year" },
];

// --------- Custom Hook for Student Management -----------
const useStudentManagement = (initialStudents = []) => {
  const [selectedStudents, setSelectedStudents] = useState(initialStudents);

  const addStudent = (student) => {
    setSelectedStudents((prev) => (prev.some((s) => s._id === student._id) ? prev : [...prev, student]));
  };
  const removeStudent = (studentId) => setSelectedStudents((prev) => prev.filter((s) => s._id !== studentId));
  const removeAll = () => setSelectedStudents([]);
  const addAll = (studentsToAdd) => setSelectedStudents((prev) => [...prev, ...studentsToAdd.filter((s) => !prev.some((p) => p._id === s._id))]);

  return { selectedStudents, addStudent, removeStudent, removeAll, addAll };
};

// ---------- Main Component ----------
const TestDetailsSection = ({ setQuestions, questions, setNewQuestion }) => {
  const dispatch = useDispatch();
  const { students, data } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);
  const currentDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { selectedStudents, addStudent, removeStudent, removeAll, addAll } = useStudentManagement([]);

  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [testDetails, setTestDetails] = useState({
    testName: "",
    duration: 0,
    testDate: "",
    testTime: "",
    testCreationDate: currentDate,
    marksPerQuestion: 0,
    totalMarks: 0, // Added total marks field
    department: "",
    year: "",
    subject: "",
    teacherName: data?.name || "",
    instructions: "<h3><strong>Test Instructions:</strong></h3><ul><li><strong>Duration:</strong> 60 minutes</li><li><strong>Total Marks:</strong> 100</li><li>All questions are <strong>mandatory</strong>.</li><li>No use of external resources allowed.</li><li>Ensure a stable internet connection.</li></ul><p>Please modify the details as needed before sharing with students.</p>",
  });

  // Sync teacher's name if changed
  useEffect(() => {
    if (data?.name) setTestDetails((prev) => ({ ...prev, teacherName: data.name }));
  }, [data?.name]);

  // Fetch all students on mount
  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter available students based on search, year, department, and exclusion of selected
  const availableStudents = useMemo(() => {
    if (!searchQuery && !testDetails.year && !testDetails.department) return [];
    return students.filter((s) => (!testDetails.year || s.year === testDetails.year) && (!testDetails.department || s.branch === testDetails.department) && !selectedStudents.some((ss) => ss._id === s._id)).filter((s) => (searchQuery ? [s.name, s.prn, s.email].some((f) => String(f).toLowerCase().includes(searchQuery.toLowerCase())) : true));
  }, [searchQuery, testDetails.year, testDetails.department, students, selectedStudents]);

  const hasAvailableStudents = availableStudents.length > 0;
  const hasSelectedStudents = selectedStudents.length > 0;

  // Handlers to update state
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (type === "number") {
      val = Math.max(0, parseInt(value) || 0);
    }
    setTestDetails((prev) => ({ ...prev, [name]: val }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setTestDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (searchQuery || testDetails.year || testDetails.department) setShowDropdown(true);
  }, [searchQuery, testDetails.year, testDetails.department]);

  // ---- Handle Create Test with totalMarks and question count logic ----
  const handleCreateTest = async () => {
    const { testName, duration, instructions, totalMarks, marksPerQuestion } = testDetails;

    if (!testName || !duration || !instructions) {
      toast.error("Please fill all required fields");
      return;
    }
    if (totalMarks <= 0 || marksPerQuestion <= 0) {
      toast.error("Total Marks and Marks Per Question must be greater than zero");
      return;
    }
    if (totalMarks % marksPerQuestion !== 0) {
      toast.error("Total Marks must be divisible by Marks Per Question");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    const numberOfQuestionsAllowed = Math.floor(totalMarks / marksPerQuestion);
    if (numberOfQuestionsAllowed === 0) {
      toast.error("Marks per question cannot exceed total marks");
      return;
    }

    // Take only the first N questions allowed
    const truncatedQuestions = questions.slice(0, numberOfQuestionsAllowed);

    const preparedQuestions = truncatedQuestions.map((q) => {
      if (q.type === "mcq") {
        return {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          type: "mcq",
        };
      } else if (q.type === "directanswer") {
        return {
          question: q.question,
          correctAnswer: q.correctAnswer,
          type: "directAnswer",
        };
      }
      return q;
    });

    const testPayload = {
      ...testDetails,
      students: selectedStudents.map((student) => ({
        _id: student._id,
        name: student.name,
        email: student.email,
        prn: student.prn,
        year: student.year,
        branch: student.branch,
      })),
      questions: preparedQuestions,
    };

    try {
      const response = await dispatch(createTest(testPayload));
      if (response?.payload?.success) {
        toast.success("Test created successfully");

        // Reset state
        setTestDetails({
          testName: "",
          duration: 0,
          testDate: "",
          testTime: "",
          testCreationDate: currentDate,
          marksPerQuestion: 0,
          totalMarks: 0,
          department: "",
          year: "",
          subject: "",
          teacherName: data?.name || "",
          instructions: "",
        });
        setSearchQuery("");
        setNewQuestion({
          type: "mcq",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          questionNumber: 1,
        });
        removeAll();
        setQuestions([]);
      } else {
        toast.error(response.payload.message || "Failed to create Test");
      }
    } catch (error) {
      toast.error("Failed to create Test");
    }
  };

  if (!students) return null;

  return (
    <Card className="mb-8 overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6" />
              Test Details
            </h2>
            <p className="text-blue-100 text-sm">Fill in the basic information about your test</p>
          </div>
          <Badge className="flex bg-blue-400/20 text-white border-blue-400/30 px-3 py-1.5">
            <Book className="w-4 h-4 mr-1" />
            New Test
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6 bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Name */}
          <Field label="Test Name" icon={<GraduationCap />}>
            <div className={`relative transition-all duration-300 ${focused ? "scale-[1.02]" : ""}`}>
              <Input name="testName" value={testDetails.testName} onChange={handleInputChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Enter test name" className="w-full pr-10" required />
              <Bookmark className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </Field>

          {/* Duration */}
          <Field label="Duration (minutes)" icon={<Timer />}>
            <Input
              name="duration"
              type="number"
              min="0"
              value={testDetails.duration}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: "duration",
                    value: Math.max(0, parseInt(e.target.value) || 0),
                  },
                })
              }
              placeholder="Enter test duration"
              className="w-full pr-10"
              required
            />
          </Field>

          {/* Subject */}
          <Field label="Subject" icon={<BookOpen />}>
            <Input name="subject" value={testDetails.subject} onChange={handleInputChange} placeholder="Enter subject name" className="w-full" />
          </Field>

          {/* Test Date */}
          <Field label="Test Date" icon={<Calendar />}>
            <Input name="testDate" type="date" value={testDetails.testDate} onChange={handleInputChange} min={currentDate} className="w-full" />
          </Field>

          {/* Test Time */}
          <Field label="Test Time" icon={<CalendarClock />}>
            <Input name="testTime" type="time" value={testDetails.testTime} onChange={handleInputChange} className="w-full" />
          </Field>

          {/* Marks per Question */}
          <Field label="Marks per Question" icon={<Calculator />}>
            <Input name="marksPerQuestion" type="number" min="1" value={testDetails.marksPerQuestion} onChange={handleInputChange} className="w-full" />
          </Field>

          {/* Total Marks - NEW */}
          <Field label="Total Marks" icon={<Calculator />}>
            <Input name="totalMarks" type="number" min="1" value={testDetails.totalMarks} onChange={handleInputChange} className="w-full" placeholder="Enter total marks" />
          </Field>

          {/* Created Date */}
          <Field label="Created Date" icon={<Calendar />}>
            <Input type="date" value={currentDate} disabled className="w-full bg-gray-50 cursor-not-allowed" />
          </Field>

          {/* Department */}
          <SelectField label="Department" icon={<School />} value={testDetails.department} onChange={(v) => handleSelectChange("department", v)} options={departments} placeholder="Select department" />

          {/* Year */}
          <SelectField label="Year" icon={<Calendar />} value={testDetails.year} onChange={(v) => handleSelectChange("year", v)} options={years} placeholder="Select year" />
        </div>

        {/* Student Selector */}
        <div className="space-y-4" ref={dropdownRef}>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={handleSearchFocus}
                placeholder="Search students by name, PRN, or email"
                className="w-full pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => addAll(availableStudents)} variant="outline" size="sm" disabled={!hasAvailableStudents} className={`whitespace-nowrap ${!hasAvailableStudents ? "opacity-50 cursor-not-allowed" : ""}`}>
                <UserPlus className="h-4 w-4 mr-2" />
                Select All
              </Button>
              <Button onClick={removeAll} variant="outline" size="sm" disabled={!hasSelectedStudents} className={`whitespace-nowrap ${!hasSelectedStudents ? "opacity-50 cursor-not-allowed" : ""}`}>
                <X className="h-4 w-4 mr-2" />
                Remove All
              </Button>
            </div>
          </div>

          {showDropdown && availableStudents.length > 0 && (
            <div className="z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {availableStudents.map((student) => (
                <StudentListItem key={student._id} student={student} onAdd={addStudent} isSelected={false} />
              ))}
            </div>
          )}
        </div>

        {/* Selected Students */}
        {hasSelectedStudents && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Students ({selectedStudents.length})</h3>
            <div className="space-y-2">
              {selectedStudents.map((student) => (
                <StudentListItem key={student._id} student={student} onRemove={removeStudent} isSelected={true} />
              ))}
            </div>
          </div>
        )}

        {/* Test Instructions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Test Instructions
          </label>
          <ReactQuill value={testDetails.instructions} onChange={(value) => handleInputChange({ target: { name: "instructions", value } })} className="w-full bg-white text-gray-900" theme="snow" />
        </div>

        {/* Submit Button */}
        <Button onClick={handleCreateTest} className="w-full border-none bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-blue-700 text-white h-12 font-medium transition-all hover:scale-[1.02]">
          Create Test
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestDetailsSection;
