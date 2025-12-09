import React, { useEffect, useState } from "react";
import {
  Code, Trophy, Github, X, User, Pencil, Camera
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  leetCode, codeForces, hackerRank, gitHub,
  updateUser
} from "../store/Slices/AuthSlice";
import LeetCodeStats from "./CodingRenderer/LeetcodeRenderer";
import CodeforcesStats from "./CodingRenderer/CodeforcesRenderer";
import HackerRankStats from "./CodingRenderer/HackerrankRenderer";
import GithubStats from "./CodingRenderer/GithubRenderer";
import PersonalInfo from "./UserInfo/PersonalInfo";
import EditInfo from "./UserInfo/EditInfo";
import UpdateAvtar from "./UserInfo/UpdateAvtar";

const platforms = {
  leetcode: {
    name: "LeetCode", icon: <Code className="w-5 h-5" />, bgColor: "bg-[#00b8a3]"
  },
  codeforces: {
    name: "CodeForces", icon: <Trophy className="w-5 h-5" />, bgColor: "bg-[#1890ff]"
  },
  github: {
    name: "GitHub", icon: <Github className="w-5 h-5" />, bgColor: "bg-[#333]"
  },
  // hackerrank: {
  //   name: "HackerRank", icon: <Trophy className="w-5 h-5" />, bgColor: "bg-[#333]"
  // },
};

const userProfileSections = {
  personalInfo: {
    name: "Personal Info", icon: <User className="w-5 h-5" />, bgColor: "bg-[#6366f1]"
  },
  editInfo: {
    name: "Edit Information", icon: <Pencil className="w-5 h-5" />, bgColor: "bg-[#8b5cf6]"
  },
  updateAvtar: {
    name: "Update Avatar", icon: <Camera className="w-5 h-5" />, bgColor: "bg-[#ec4899]"
  },
};

const ProfileSection = () => {
  const dispatch = useDispatch();
  // Get user data (with role) from Redux
  const { data: user } = useSelector((state) => state.auth);
  const role = user?.role || "";

  // UI states
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "platforms"
  const [activeUserSection, setActiveUserSection] = useState("personalInfo");

  const platformKeys = ["leetcode", "codeforces", "github", "hackerrank"];

  const buildInitialPlatformState = (userData = {}) =>
    platformKeys.reduce((acc, key) => ({
      ...acc,
      [key]: {
        username: userData[`${key}_username`] || "",
        isTracked: Boolean(userData[`${key}_username`]),
        data: null,
      },
    }), {});


  const [platformStates, setPlatformStates] = useState(() => buildInitialPlatformState(user));
  const [activePlatform, setActivePlatform] = useState("leetcode");

  // When `user` changes, initialize and fetch platform stats for each tracked platform
  useEffect(() => {
    if (!user) return;

    // Initialize platform states with usernames from DB (and mark tracked)
    const initialStates = buildInitialPlatformState(user);
    setPlatformStates(initialStates);

    // For each tracked platform, fetch stats asynchronously
    const fetchStatsForPlatforms = async () => {
      for (const key of platformKeys) {
        let keysuf = key + "_username";
        const username = user[keysuf];
        if (username && username.trim() !== '') {
          let response;
          try {
            switch (key) {
              case "leetcode":
                response = await dispatch(leetCode(username));
                console.log(response);
                break;
              case "github":
                response = await dispatch(gitHub(username));
                break;
              case "codeforces":
                response = await dispatch(codeForces(username));
                break;
              case "hackerrank":
                response = await dispatch(hackerRank(username));
                break;
              default:
                continue;
            }
            if (response && response.payload) {
              setPlatformStates(prev => ({
                ...prev,
                [key]: {
                  ...prev[key],
                  isTracked: true,
                  data: response.payload
                },
              }));
            }
          } catch (e) {
            // Optional: handle fetch error per platform (e.g. toast)
          }
        }
      }
    };

    fetchStatsForPlatforms();
  }, [user, dispatch]);

  // Your existing handleSubmit for updating username & data on manual submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    const username = platformStates[activePlatform].username;
    let response;

    try {
      switch (activePlatform) {
        case "leetcode":
          response = await dispatch(leetCode(username));
          break;
        case "github":
          response = await dispatch(gitHub(username));
          break;
        case "codeforces":
          response = await dispatch(codeForces(username));
          break;
        case "hackerrank":
          response = await dispatch(hackerRank(username));
          break;
        default:
          return;
      }
      if (response?.payload) {
        // Save updated username in DB for this platform
        const backendField = `${activePlatform}_username`;
        await dispatch(updateUser({
          data: { [backendField]: username },
          id: user._id
        }));
        // Update platformStates locally
        setPlatformStates(prev => ({
          ...prev,
          [activePlatform]: {
            ...prev[activePlatform],
            isTracked: true,
            data: response.payload,
          },
        }));
      }
    } catch (err) {
      // Optional error handling (toast etc)
    }
  };

  // Render Coding Platform Stats component
  const renderStats = () => {
    const data = platformStates[activePlatform].data;
    switch (activePlatform) {
      case "leetcode": return <LeetCodeStats data={data} />;
      case "codeforces": return <CodeforcesStats data={data} />;
      case "github": return <GithubStats data={data} />;
      case "hackerrank": return <HackerRankStats data={data} />;
      default: return null;
    }
  };

  // Render User Profile Section
  const renderUserProfileSection = () => {
    switch (activeUserSection) {
      case "personalInfo": return <PersonalInfo />;
      case "editInfo": return <EditInfo />;
      case "updateAvtar": return <UpdateAvtar />;
      default: return null;
    }
  };

  // Teacher UI: Only show profile sections, never coding platforms
  if (role === "teacher") {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-72 bg-white border-r p-6">
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <h3 className="text-lg font-semibold mb-4">Profile Sections</h3>
          <div className="space-y-2">
            {Object.entries(userProfileSections).map(([key, section]) => (
              <div key={key} className="relative">
                <button
                  onClick={() => setActiveUserSection(key)}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${activeUserSection === key
                    ? `${section.bgColor} text-white`
                    : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          {renderUserProfileSection()}
        </div>
      </div>
    );
  }

  // Student UI: Show both Profile & Platforms tab
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-72 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 rounded-lg transition-all duration-200 ${activeTab === "profile"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("platforms")}
            className={`flex-1 py-2 rounded-lg transition-all duration-200 ${activeTab === "platforms"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            Platforms
          </button>
        </div>
        {activeTab === "platforms" ? (
          <>
            <h3 className="text-lg font-semibold mb-4">Coding Platforms</h3>
            <div className="space-y-2">
              {Object.entries(platforms).map(([key, platform]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => setActivePlatform(key)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${activePlatform === key
                      ? `${platform.bgColor} text-white`
                      : "hover:bg-gray-100 text-gray-600"
                      }`}
                  >
                    {platform.icon}
                    <span className="font-medium">{platform.name}</span>
                  </button>
                  {platformStates[key].isTracked && (
                    <button
                      onClick={() =>
                        setPlatformStates((prev) => ({
                          ...prev,
                          [key]: { username: "", isTracked: false, data: null },
                        }))
                      }
                      className="absolute top-1 right-1 text-red-500 hover:bg-red-50 rounded-full p-1"
                    >
                      <X className="w-4 h-4 m-2" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Profile Sections</h3>
            <div className="space-y-2">
              {Object.entries(userProfileSections).map(([key, section]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => setActiveUserSection(key)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${activeUserSection === key
                      ? `${section.bgColor} text-white`
                      : "hover:bg-gray-100 text-gray-600"
                      }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "platforms" ? (
          !platformStates[activePlatform].isTracked ? (
            <Card className="bg-white">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={platformStates[activePlatform].username}
                    onChange={(e) =>
                      setPlatformStates((prev) => ({
                        ...prev,
                        [activePlatform]: {
                          ...prev[activePlatform],
                          username: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={`Enter ${platforms[activePlatform].name} username`}
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Stats
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-white mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${platforms[activePlatform].bgColor} rounded-full flex items-center justify-center text-white`}
                      >
                        {platforms[activePlatform].icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {platforms[activePlatform].name}
                        </h2>
                        <p className="text-gray-600">
                          {platformStates[activePlatform].username}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPlatformStates((prev) => ({
                          ...prev,
                          [activePlatform]: {
                            username: "",
                            isTracked: false,
                            data: null,
                          },
                        }))
                      }
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove Profile
                    </button>
                  </div>
                </CardContent>
              </Card>
              {renderStats()}
            </>
          )
        ) : (
          renderUserProfileSection()
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
