const FooterControls = ({
  currentQuestion,
  totalQuestions,
  handleNext,
  handlePrevious,
  handleSubmit,
}) => {
  return (
    <div className="flex items-center space-x-4 justify-end">
      {/* Question Navigation Buttons */}
      {/* <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Next
            </button>
          )}
        </div> */}

      {/* Test Status Indicators */}

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
  );
};

export default FooterControls;
