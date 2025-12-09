// custom/LoginPage.jsx
import { useEffect, useState } from "react";
// import {Button} from '../../components/ui/button';
// import {Input} from '../../components/ui/input';
// import {Label} from '../../components/ui/label';
// import {Card} from '../../components/ui/card';
// For redirection
import Button from "../ui/Button"; // Assuming you have a Button component
import Input from "../ui/Input"; // Assuming you have an Input component
import Label from "../ui/Label"; // Assuming you have a Label component
import Card from "../ui/Card"; // Assuming you have a Card component
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Loader } from "lucide-react";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/Slices/AuthSlice";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputValue = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(`Field updated: ${name}, Value: ${value}`);
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const [role, setRole] = useState("student"); // default role

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("This is login data", loginData);
    const response = await dispatch(loginUser(loginData));
    if (response.payload.success) {
      console.log(response.payload, "response");
      if (response.payload.user.role === "teacher") navigate("/teacher/home");
      else navigate("/home");
      // navigate("/student/home");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        footerText="Don't have an account?"
        linkText="Sign up"
        linkHref="/signup"
        className="w-[400px] max-w-[380px] lg:max-w-lg xl:max-w-xl p-8"
      >
        <div className="flex items-center mb-8 space-x-2">
          <img src={logo} className="h-10 w-10 rounded-full" alt="Logo" />
          <h1 className="text-2xl font-semibold text-center">SkillHub</h1>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleInputValue}
            />
          </div>

          <div className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"} // Toggle type based on showPassword
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleInputValue}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute top-9 right-3 flex items-center"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <Button type="submit" className="w-full mb-4">
            Login
          </Button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-center">
            <a href="/forget-password" className="text-black hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
