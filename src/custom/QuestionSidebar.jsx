import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/ui/Button";
import { Send } from "lucide-react";

const QuestionSidebar = ({
  totalQuestions,
  currentQuestion,
  setCurrentQuestion,
  questionStatus,
  timeLeft,
  duration,  // Accept duration as a prop
  submissionTime,
}) => {

  console.log('this is time left',timeLeft)
  // const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds

  // useEffect(() => {
  //   setTimeLeft(duration * 60); // Reset time if duration changes
  // }, [duration]);

  // useEffect(() => {
  //   if (!submissionTime) { // Run only if the test is not submitted
  //     const timer = setInterval(() => {
  //       setTimeLeft((prevTime) => {
  //         if (prevTime <= 0) {
  //           clearInterval(timer);
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [submissionTime]);


  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft((prevTime) => {
  //       if (prevTime <= 0) {
  //         clearInterval(timer);
  //         return 0;
  //       }
  //       return prevTime - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate the initial total time in seconds
  const initialTime = duration * 60;
  
  // Calculate progress percentage safely
  const progressPercentage = initialTime > 0 
    ? Math.min(100, (timeLeft / initialTime) * 100)
    : 0;

  return (
    <div className="w-1/4 bg-gray-100 shadow-lg p-4">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="text-xl font-bold text-center text-blue-600">Timer</div>
        <div className="text-3xl font-mono font-bold text-center mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
        

        <div className="h-2 bg-gray-200 rounded-full mt-3">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ width: `${(timeLeft / (duration * 60)) * 100}%` }}
          ></div>
        </div>
      </div>
      <Link to="/testdashboard">
        <Button className="bg-blue-600 hover:bg-blue-700 transition-all flex w-full mt-6 mb-6">
          Submit Test <Send className="ml-2 w-4 h-4" />
        </Button>
      </Link>
      <h2 className="text-lg font-semibold mb-4">Questions</h2>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full ${
              index === currentQuestion
                ? "bg-blue-500 text-white"
                : questionStatus[index] === "Answered"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <div className="mt-6 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span>Not Attempted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Current Question</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionSidebar;
