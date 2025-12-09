import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
// import {Button} from '../../components/ui/button';
// import {Input} from '../../components/ui/input';
// import {Label} from '../../components/ui/label';
// import {Card} from '../../components/ui/card';
// For redirection
import Button from "../ui/Button"; // Assuming you have a Button component
import Input from "../ui/Input"; // Assuming you have an Input component
import Label from "../ui/Label"; // Assuming you have a Label component
import Card from "../ui/Card"; // Assuming you have a Card component
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { regenerateOtp, validateOtp } from '../store/Slices/AuthSlice';
export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [otp, setotp] = useState(""); // State for the verification code

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    console.log("This is the otp being sent",otp)
    const response = await dispatch(validateOtp({otp}))
    
    if(response.payload.success){
      navigate('/home'); // Redirect to the home page after successful verification
    }
  };


  const handleResendEmail = async (e) => {
    e.preventDefault();
    const response = await dispatch(regenerateOtp())
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
        <p className="mb-4">
          Please enter the 6-digit verification code sent to your email.
        </p>
        <form onSubmit={handleVerifyCode}>
          <div className="mb-4">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              name="verificationCode"
              maxLength="6"
              placeholder="Enter your verification code"
              value={otp}
              onChange={(e) => setotp(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <Button type="submit" className="w-full mb-4" >
            Verify Code
          </Button>
        </form>
        <p className="mb-6">
          If you haven't received the email, click the button below to resend it.
        </p>
        <Button onClick={handleResendEmail} className="w-full mb-4" >
          Resend Verification Email
        </Button>
      </Card>
    </div>
  );
}
