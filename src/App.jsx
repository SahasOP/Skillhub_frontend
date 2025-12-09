import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import StudentHomePage from "./pages/StudentHomePage";
import TeacherHomePage from "./pages/TeacherHomePage";
import SignupPage from "./pages/Signup";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import AdminPage from "./pages/AdminPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./custom/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import AboutPage from "./pages/AboutPage";
import TestPage from "./pages/TestPage";
import UserProfile from "./pages/UserProfile";
import LearningPath from "./pages/LearningPath";
import LandingPage from "./pages/LandingPage";
import TeacherTestCreation from "./pages/TeacherTestCreation";
import StudentTestDashboard from "./pages/TestDashboard";
import StudentMarksPage from "./pages/StudentMarks";
import TestResultsPage from "./pages/TestsResultsPage";
import GetMarks from "./pages/GetMarks";
import { getUser } from "./store/Slices/AuthSlice";
import ProtectedRoute from "./pages/Authentication/ProtectedRoute";
import Marks from "./pages/Marks";
import TopicManager from "./pages/TopicManager";
import { fetchTopics } from "./store/Slices/TopicSlice";
import AdminTestResultsDashboard from "./pages/AdminPageComponent/AdminGetMarksComponent";
import CategoryPage from "./pages/Category";
import LearningPathagain from "./pages/LearningCategory";
import TestResultsDashboard from "./pages/TestsResultsPage";

function App() {
  const dispatch = useDispatch();
  const { isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchTopics());
  }, [dispatch]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/marksheet" element={<Marks />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      {/* Protected Routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <StudentHomePage />
        </ProtectedRoute>
      } />
      <Route path="/teacher/home" element={
        <ProtectedRoute requiredRole="teacher">
          <TeacherHomePage />
        </ProtectedRoute>
      } />
      <Route path="/about" element={
        <ProtectedRoute>
          <AboutPage />
        </ProtectedRoute>
      } />
      <Route path="/userprofile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/testdashboard" element={
        <ProtectedRoute>
          <StudentTestDashboard />
        </ProtectedRoute>
      } />
      <Route path="/createtest" element={
        <ProtectedRoute requiredRole="teacher">
          <TeacherTestCreation />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/getmarks/:testId" element={
        <ProtectedRoute>
          <GetMarks />
        </ProtectedRoute>
      } />
      <Route path="/admin/getmarks/:testId" element={
        <ProtectedRoute requiredRole="admin">
          <AdminTestResultsDashboard />
        </ProtectedRoute>
      } />
      <Route path="/previoustests" element={
        <ProtectedRoute>
          <TestResultsDashboard />
        </ProtectedRoute>
      } />
      <Route path="/marks" element={
        <ProtectedRoute>
          <StudentMarksPage />
        </ProtectedRoute>
      } />
      <Route path="/test/:id" element={
        <ProtectedRoute>
          <TestPage />
        </ProtectedRoute>
      } />
      <Route path="/category" element={
        <ProtectedRoute>
          <LearningPath />
        </ProtectedRoute>
      } />
      <Route path="/admin/topicmanager" element={
        <ProtectedRoute requiredRole="admin">
          <TopicManager />
        </ProtectedRoute>
      } />

      {/* Semi-protected or open */}
      <Route path="/learningpath" element={<CategoryPage />} />
      <Route path="/learning-path/:categoryId" element={<LearningPathagain />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
