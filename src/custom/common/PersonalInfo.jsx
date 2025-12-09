import React from "react";
import { useSelector } from "react-redux";
import {
  Github, Linkedin, Mail, GraduationCap, Calendar, Hash, Building2,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

const defaultProfilePic =
  "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

const PersonalInfo = () => {
  const { data } = useSelector((state) => state.auth);
  const user = data || {};

  // Read all profile info from Redux user (ensure fallback to blank or default)
  const profile = {
    name: user.name || "No Name",
    email: user.email || "",
    course: user.course || "",
    classroom: user.classroom || "",
    prn: user.prn || "",
    department: user.branch || "",
    bio: user.bio || "",
    github: user.github || "",
    linkedin: user.linkedin || user.linkedIn || "",
    profilePic: user.profilePic || user.avatar?.secure_url || defaultProfilePic,
  };

  return (
    <Card className="bg-white" >
      <CardContent className="p-6">
        <div className="bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
                <div className="flex flex-col md:flex-row items-start gap-8 relative">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.onerror = null; e.target.src = defaultProfilePic; }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-white">
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    {profile.bio && (
                      <p className="text-blue-100 mb-6 max-w-lg">{profile.bio}</p>
                    )}
                    {/* Social Links */}
                    <div className="flex gap-3">
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Academic Details Section */}
              <div className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      Academic Details
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Hash className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">PRN</p>
                          <p className="font-mono text-gray-900">{profile.prn}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="text-gray-900">{profile.department}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Class Details
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="text-gray-900">{profile.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Class</p>
                          <p className="text-gray-900">{profile.classroom}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add additional info sections here if needed */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card >
  );
};

export default PersonalInfo;
