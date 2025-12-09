import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Timer, ArrowRight, ArrowLeft, X } from "lucide-react";
import QuestionSidebar from "../custom/QuestionSidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTestByid, submitTest } from "../store/Slices/TestSlice";

const TestPage = () => {
  const { id } = useParams();
  const [submissionTime, setSubmissionTime] = useState(null);
  const { loading, error, testById } = useSelector((state) => state.test);
  const { data } = useSelector((state) => state.auth);
  const student_id = data._id;
  console.log("this is test by id", testById);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTestByid(id));
  }, [dispatch, id]);

  // Calculate remaining time based on test start time, duration, and current time
  const calculateRemainingTime = () => {
    // Early return if required data is missing
    if (!testById?.testDate || !testById?.testTime || !testById?.duration) {
      return 0;
    }

    try {
      // Create date objects with proper time zone handling
      const testDateTime = new Date(`${testById.testDate}T${testById.testTime}:00`);
      const now = new Date();
      const testEndTime = new Date(testDateTime.getTime() + testById.duration * 60 * 1000);

      // If test hasn't started yet, return full duration
      if (now < testDateTime) {
        return Math.floor((testEndTime - testDateTime) / 1000);
      }

      // If test has ended, return 0
      if (now >= testEndTime) {
        return 0;
      }

      // Calculate remaining time (in seconds)
      const remainingMilliseconds = testEndTime - now;
      const remainingSeconds = Math.floor(remainingMilliseconds / 1000);

      // Ensure we don't return negative time
      return Math.max(0, remainingSeconds);
    } catch (error) {
      console.error('Error calculating remaining time:', error);
      return 0; // Fallback to 0 if any error occurs
    }
  };

  // Update state when testById changes
  useEffect(() => {
    if (testById?.questions) {
      setQuestionStatus(Array(testById.questions.length).fill("Not Attempted"));
      setAnswers(Array(testById.questions.length).fill(null));

      const remainingTime = calculateRemainingTime();
      setTimeLeft(remainingTime);

      if (remainingTime <= 0 && !isTestSubmitted) {
        handleSubmit();
      }
    }
  }, [testById]);

  useEffect(() => {
    if (timeLeft > 0 && !isTestSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isTestSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isTestSubmitted]);

  const handleNext = () => {
    if (currentQuestion < testById?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClearOption = () => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestion] = null;
      return updatedAnswers;
    });
    updateQuestionStatus(currentQuestion, "Not Attempted");
  };

  const handleSubmit = async () => {
    // Save the remaining time when the test is submitted
    setSubmissionTime(timeLeft);

    const formattedTestData = {
      test_id: testById._id,
      teacher_name: testById.teacherName,
      name: data.name,
      email: data.email,
      prn: data.prn,
      subject_name: testById.testName,
      marks_obtained: answers.reduce((total, answer, index) => {
        const question = testById?.questions[index];
        if (question && answer !== null) {
          // For MCQ questions
          if (question.type === "mcq" && question.options[answer] === question.correctAnswer) {
            return total + parseInt(testById.marksPerQuestion, 10);
          }
          // For direct answer questions - simple string comparison (case-insensitive)
          if (question.type === "directAnswer" && 
              typeof answer === "string" && 
              answer.trim().toLowerCase() === question.correctAnswer.toLowerCase()) {
            return total + parseInt(testById.marksPerQuestion, 10);
          }
        }
        return total;
      }, 0),
      total_questions: testById.questions.length,
      question_appeared: testById.questions.map((question, index) => {
        let yourAnswer = "";
        let isCorrect = false;

        if (answers[index] !== null) {
          if (question.type === "mcq") {
            yourAnswer = question.options[answers[index]] || "";
            isCorrect = question.options[answers[index]] === question.correctAnswer;
          } else if (question.type === "directAnswer") {
            yourAnswer = answers[index] || "";
            isCorrect = typeof answers[index] === "string" && 
                       answers[index].trim().toLowerCase() === question.correctAnswer.toLowerCase();
          }
        }

        return {
          your_answer: yourAnswer,
          correct_answer: question.correctAnswer,
          mark: isCorrect ? parseInt(testById.marksPerQuestion, 10) : 0,
        };
      }),
    };

    console.log('Test data being sent', formattedTestData);
    const response = await dispatch(submitTest(formattedTestData));
    if (response.payload.success) {
      setIsTestSubmitted(true);
      navigate('/marksheet', { state: { student_id, testId: formattedTestData.test_id } });
    } else {
      alert(`Failed to submit test: ${response.payload}`);
    }
    console.log("Test Submitted at:", submissionTime);
  };

  const updateQuestionStatus = (index, status) => {
    setQuestionStatus((prev) => {
      const updatedStatus = [...prev];
      updatedStatus[index] = status;
      return updatedStatus;
    });
  };

  const handleOptionChange = (optionIndex) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestion] = optionIndex;
      return updatedAnswers;
    });
    updateQuestionStatus(currentQuestion, "Answered");
  };

  const handleDirectAnswer = (value) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestion] = value;
      return updatedAnswers;
    });
    
    // Update status based on whether there's content
    if (value.trim()) {
      updateQuestionStatus(currentQuestion, "Answered");
    } else {
      updateQuestionStatus(currentQuestion, "Not Attempted");
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestion(index);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!testById) return <div>No test data available</div>;

  // Check if the test time has expired
  if (calculateRemainingTime() <= 0 && !isTestSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Test Time Expired</h2>
        <p>The time to take this test has ended.</p>
        <Button
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // Get the current question object
  const currentQuestionObj = testById.questions[currentQuestion];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow p-4 gap-4">
        {/* Main Question Panel */}
        <div className="flex-1">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 flex flex-row justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{testById.testName}</h2>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-8">
                <p className="text-lg mb-4">
                  Question {currentQuestion + 1} of {testById.questions.length}
                </p>
                <p className="text-xl mb-6 font-medium">
                  {currentQuestionObj?.question}
                </p>

                {currentQuestionObj?.type === "mcq" ? (
                  <div className="space-y-3">
                    {currentQuestionObj.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${answers[currentQuestion] === index
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-gray-50"
                          }`}
                        onClick={() => handleOptionChange(index)}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") handleOptionChange(index);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            answers[currentQuestion] === index 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="text-base">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : currentQuestionObj?.type === "directAnswer" ? (
                  // Direct answer type: show textarea
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Answer:
                    </label>
                    <textarea
                      className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      rows={4}
                      value={typeof answers[currentQuestion] === "string" ? answers[currentQuestion] : ""}
                      onChange={e => handleDirectAnswer(e.target.value)}
                      placeholder="Write your answer here..."
                    />
                    <p className="text-sm text-gray-500">
                      Type your answer in the text area above.
                    </p>
                  </div>
                ) : (
                  <div className="text-red-500">Unknown question type</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardContent className="pt-4">
              <div className="flex justify-between">
                <Button
                  className="flex items-center"
                  variant="outline"
                  disabled={currentQuestion === 0}
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearOption}
                  className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Response
                </Button>
                <Button
                  className="flex items-center"
                  variant="outline"
                  onClick={
                    currentQuestion === testById.questions.length - 1
                      ? handleSubmit
                      : handleNext
                  }
                >
                  {currentQuestion === testById.questions.length - 1 ? "Submit" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigation Sidebar */}
        <QuestionSidebar
          totalQuestions={testById.questions.length}
          currentQuestion={currentQuestion}
          setCurrentQuestion={handleQuestionNavigation}
          questionStatus={questionStatus}
          duration={testById.duration}
          timeLeft={timeLeft} // Pass the actual time left in seconds
          submissionTime={submissionTime}
        />
      </div>
    </div>
  );
};

export default TestPage;