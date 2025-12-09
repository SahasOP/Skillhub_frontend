// custom/ForgotPasswordPage.jsx
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
import { Link } from "react-router-dom"; // For navigation
import { ArrowLeft, Mail } from "lucide-react"; // For icons
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../store/Slices/AuthSlice";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {

    e.preventDefault();
    const data = {
      email
    }

    const response = await dispatch(forgotPassword(data))
    if(response.payload.success){
      setIsSubmitted(true); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px] text-center">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

           
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
         
                
              />
            </div>

            <Button className="w-full" type="submit" >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div>
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-600 mb-6">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </div>
        )}

        <div className="mt-6">
          <Link to="/login" className="text-sm text-black hover:underline flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
