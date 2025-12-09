// UpdateAvatar.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, getUser } from "../../store/Slices/AuthSlice";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Camera, Upload } from "lucide-react";
import toast from "react-hot-toast";

const UpdateAvatar = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!avatar || !data?._id) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      await dispatch(updateUser({ data: formData, id: data._id })).unwrap();
      await dispatch(getUser());
      toast.success("Avatar updated!");
      setAvatar(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error?.message || "Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Update Profile Picture</h3>
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="absolute bottom-0 right-0">
              <Label
                htmlFor="avatar-upload"
                className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <Camera className="h-4 w-4" />
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">Click the camera icon to upload a new profile picture</p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setAvatar(null);
              setPreviewUrl(null);
            }}
            disabled={isUploading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!avatar || isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Update Profile Picture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdateAvatar;
