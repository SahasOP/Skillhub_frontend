import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forget-password", "/reset-password"];

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Redirect logged-in users away from landing/login/register (to /home or /teacher/home)
  if (
    isLoggedIn &&
    PUBLIC_PATHS.includes(location.pathname)
  ) {
    if (role === "teacher") return <Navigate to="/teacher/home" replace />;
    return <Navigate to="/home" replace />;
  }

  // If not logged in, send to login (or root, or landing as per your design)
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // All is well, show child route
  return children;
};

export default ProtectedRoute;
