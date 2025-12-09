import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  LogOut,
  Home,
  FileText,
  BookOpen,
  PlusCircle,
  BarChart2,
  Info,
} from "lucide-react";
import { Brain, Zap } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Slices/AuthSlice";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const dispath = useDispatch()
  const{data,loading,error} = useSelector((state)=>state.auth)
  let user = null;
  if(data){
    user = data;
  }
  // console.log(user,"user");
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!expanded) {
      setShowDropdown(false);
    }
  }, [expanded]);

  const handleSignOut = async() => {
    const response = await dispath(logout())
    if(response.payload.success){

      navigate("/login");
    }
  };

  const getNavigationItems = () => {
    if (user?.role === "teacher") {
      return [
        { icon: <Home size={20} />, text: "Home", path: "/teacher/home" },
        {
          icon: <PlusCircle size={20} />,
          text: "Create Test",
          path: "/createtest",
        },
        {
          icon: <BarChart2 size={20} />,
          text: "Test Results",
          path: "/previoustests",
        },
        { type: "hr" }, // Add horizontal rule
        {
          icon: <Info size={20} />,
          text: "About Us",
          path: "/about",
        },
      ];
    } else {
      return [
        { icon: <Home size={20} />, text: "Home", path: "/home" },
        {
          icon: <FileText size={20} />,
          text: "Take Test",
          path: "/testdashboard",
        },
        { icon: <BookOpen size={20} />, text: "Practice", path: "/learningpath" },
        { type: "hr" }, // Add horizontal rule
        {
          icon: <Info size={20} />,
          text: "About Us",
          path: "/about",
        },
      ];
    }
  };

  return (
    <aside
      className={`min-h-screen flex flex-col bg-white border-r border-gray-200 shadow-md transition-all duration-300 ${
        expanded ? "w-72" : "w-20"
      }`}
    >
      <nav className="flex flex-col flex-grow">
        {/* Header Section */}
        <div className="p-4 flex items-center justify-between">
          {/* <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "w-28" : "w-0"
            }`}
            alt="Logo"
          /> */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`
                overflow-hidden transition-all duration-300
                flex items-center gap-2
                ${expanded ? "w-32" : "w-0"}
              `}
              >
                <div className="relative">
                  <Brain size={24} className="text-blue-500" strokeWidth={2} />
                  <Zap
                    size={12}
                    className="text-blue-300 absolute -right-1 top-0"
                    strokeWidth={2.5}
                  />
                </div>
                <span className="text-lg font-bold whitespace-nowrap bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                  SkillHub
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 border-none cursor-pointer transition-colors duration-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex flex-col flex-grow">
            {getNavigationItems().map((item, index) =>
              item.type === "hr" ? (
                <hr
                  key={`hr-${index}`}
                  className="my-2 border-t border-gray-200 mx-4"
                />
              ) : (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  active={window.location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                />
              )
            )}
          </ul>
        </SidebarContext.Provider>

        {/* Footer Section */}
        <div className="border-t border-gray-200 flex items-center justify-between p-4 mt-auto">
          <div className="flex items-center relative">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=c7d2fe&color=3730a3&bold=true`}
              alt="User"
              className="w-12 h-12 rounded-lg"
            />

            {expanded && (
              <div className="ml-2 mr-8 flex items-center justify-between">
                <div className="">
                  <h4 className="text-sm font-semibold">
                    {user?.name || "User"}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
                <div className="relative ml-6 mr-12">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="rounded-lg hover:bg-gray-100 transition-all duration-200 mr-2 p-2"
                    aria-label="More options"
                  >
                    <MoreVertical size={24} className="text-gray-500" />
                  </button>

                  {showDropdown && (
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 mr-3">
                      <div className="p-4 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=c7d2fe&color=3730a3&bold=true`}
                            alt="User"
                            className="w-14 h-14 rounded-lg shadow-md border-2 border-white"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">
                              {user?.name || "User"}
                            </h4>
                            <span className="text-xs text-gray-500 block truncate">
                              {user?.email || "user@example.com"}
                            </span>
                            <Link to="/userprofile">
                              <span className="text-xs text-indigo-600 font-medium">
                                View Profile
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors duration-200"
                        >
                          <LogOut size={16} className="text-gray-500" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`relative flex items-center p-3 m-2 rounded-lg cursor-pointer transition-all duration-300 ${
        active
          ? "bg-indigo-100 text-indigo-800"
          : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      <div
        className={`mr-4 transition-all duration-300 ${expanded ? "mr-4" : "ml-2"}`}
      >
        {icon}
      </div>
      <span
        className={`transition-all duration-300 ${
          expanded ? "ml-4" : "ml-0"
        } ${expanded ? "block" : "hidden"}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute top-1/2 right-3 w-3 h-3 rounded-full bg-indigo-500 transform -translate-y-1/2 ${
            !expanded ? "mt-2" : ""
          }`}
        />
      )}
      {!expanded && (
        <div className="absolute left-full ml-2 p-1.5 rounded-lg bg-indigo-100 text-indigo-800 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          {text}
        </div>
      )}
    </li>
  );
}
