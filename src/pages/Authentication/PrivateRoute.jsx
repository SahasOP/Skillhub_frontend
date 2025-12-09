import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  console.log("this is role",role)
  if (isLoggedIn && window.location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
