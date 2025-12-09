import React from "react";
import Sidebar from "../custom/Sidebar";
import ProfileSection from "../custom/ProfileSection";
import SubHeading from "../custom/Subheading";
import { useSelector } from "react-redux";
const UserProfile = () => {
  const { data } = useSelector((state) => state.auth);
  const user = data;
  console.log("This is user data", user);
  return (
    <div className="flex bg-slate-50">
      <div className="flex h-screen fixed">
        {/* Sidebar */}
        <Sidebar></Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="fixed z-50">
          <SubHeading />
        </div>
        <div className="p-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="px-2 mx-3 my-4 border-2 mx-auto bg-white rounded-xl shadow-md">
                <ProfileSection />
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
