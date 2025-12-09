// EditInfo.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, getUser } from "../../store/Slices/AuthSlice";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import toast from "react-hot-toast";

const EditInfo = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    bio: "",
    github: "",
    linkedin: "",
    email: "",
  });

  useEffect(() => {
    if (data) {
      setProfile({
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateUser({ data: profile, id: data._id })).unwrap();
      toast.success("Profile updated!");
      await dispatch(getUser());
    } catch (error) {
      toast.error(error?.message || "Update failed");
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Edit Information</h3>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Mail Id</Label>
            <Input id="email" type="email" value={profile.email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" value={profile.bio} onChange={e => handleInputChange("bio", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" value={profile.github} onChange={e => handleInputChange("github", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" value={profile.linkedin} onChange={e => handleInputChange("linkedin", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditInfo;
