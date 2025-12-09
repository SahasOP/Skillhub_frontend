import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react";

function StudentSubHeading({ navigationLinks }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add your sign out logic here (e.g., clearing session, tokens, etc.)
    // Then navigate to login page
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Brand Name */}
        <Link to="/home" className="text-2xl font-bold">
          SkillHub
        </Link>
        
        <div className="flex items-center">
          {/* Navigation Links */}
          <ul className="flex space-x-6 mr-6">
            {navigationLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="hover:text-blue-300 transition duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            {/* User Profile Button */}
            <li>
              <Link
                to="/userprofile"
                className="hover:text-blue-300 transition duration-200"
                title="User Profile"
              >
                <UserCircle size={22} />
              </Link>
            </li>
          </ul>
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="hover:bg-indigo-800 p-2 rounded-full transition duration-200"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>
    </header>
  );
}

// Default props
StudentSubHeading.defaultProps = {
  navigationLinks: [
    { path: "/home", label: "Home" },
    { path: "/testdashboard", label: "Take Test" },
    { path: "/learningpath", label: "Practice" }
  ]
};

export default StudentSubHeading;