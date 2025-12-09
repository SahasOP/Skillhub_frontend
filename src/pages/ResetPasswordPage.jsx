// custom/ResetPasswordPage.jsx
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import {Button} from '../../components/ui/button';
// import {Input} from '../../components/ui/input';
// import {Label} from '../../components/ui/label';
// import {Card} from '../../components/ui/card';
// For redirection
import Button from "../ui/Button"; // Assuming you have a Button component
import Input from "../ui/Input"; // Assuming you have an Input component
import Label from "../ui/Label"; // Assuming you have a Label component
import Card from "../ui/Card"; // Assuming you have a Card component
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { resetPassword } from "../store/Slices/AuthSlice";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { resetToken } = useParams(); 
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const data = { password, resetToken }; 
    const response = await dispatch(resetPassword(data));
    if(response.payload.success){
      setSuccess("Your password has been reset successfully.");
      toast.success("Password reset successfully, redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <div className="mb-4 relative">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
             
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute top-10 right-2 flex items-center"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="mb-4 relative">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
        
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute top-10 right-2 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <Button className="w-full" type="submit" >
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
