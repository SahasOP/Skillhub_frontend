import React from "react";
import { Link } from "react-router-dom";

function SubHeading() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Brand Name */}
        <Link to="/home" className="text-2xl font-bold">
          SkillHub
        </Link>
        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/home" className="hover:text-blue-300 transition duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/createtest"
              className="hover:text-blue-300 transition duration-200"
            >
              Create Test
            </Link>
          </li>
          <li>
            <Link
              to="/previoustests"
              className="hover:text-blue-300 transition duration-200"
            >
              Test Results
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default SubHeading;
