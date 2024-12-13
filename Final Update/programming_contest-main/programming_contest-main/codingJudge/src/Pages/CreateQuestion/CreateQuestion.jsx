// Import necessary dependencies
import { useState } from "react"; // Hook to manage component state
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // Custom hook for making secure Axios requests
import { toast } from "react-toastify"; // Library for showing toast notifications
import { useNavigate } from "react-router-dom"; // Hook to programmatically navigate between routes

function CreateQuestion() {
  // Initialize hooks
  const navigate = useNavigate(); // For navigation between routes
  const axiosSecure = useAxiosSecure(); // Custom Axios hook to handle secure API requests
  
  // Retrieve contest data from localStorage and parse it into an object
  const contestJSON = localStorage.getItem("contest");
  const contest = JSON.parse(contestJSON);
  
  // Extract the number of questions from the contest object, defaulting to 0 if not available
  const numberOfQuestion = contest ? parseInt(contest.numberOfQuestion) : 0;

  // Create an array to store the questions with an initial empty string for each question
  const [questions, setQuestions] = useState(Array(numberOfQuestion).fill(""));

  // Handle changes to individual question inputs
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions]; // Create a copy of the current questions array
    newQuestions[index] = value; // Update the value of the question at the given index
    setQuestions(newQuestions); // Update the state with the new questions array
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    // If the contest exists, add the questions array to the contest object
    if (contest) {
      contest.questions = questions;
    }

    // Send a POST request to create the contest, including the contest details and questions
    const res = await axiosSecure.post("/contests", contest);
    console.log(res?.data); // Log the response data from the server

    // If the contest was successfully inserted (i.e., contest created successfully)
    if (res?.data?.insertedId) {
      // Show a success toast notification
      toast.success("Contest created successfully.");
      
      // Remove the contest from localStorage as it's no longer needed
      localStorage.removeItem("contest");
      
      // Navigate to the home page
      navigate("/");
    }
  };

  // JSX structure for the Create Question page
  return (
    <div className="-mt-[68px] min-h-screen pt-20 xl:pt-28 px-4 pb-10">
      {/* Container for the form */}
      <div className="w-full max-w-4xl p-6 m-auto mx-auto rounded border border-[#ABABAB]">
        <div>
          {/* Heading */}
          <h2 className="text-lg font-bold text-white">
            Write down the questions.
          </h2>
        </div>

        {/* Form for entering questions */}
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Dynamically render input fields based on the number of questions */}
          {Array.from({ length: numberOfQuestion }, (_, index) => (
            <div key={index} className="mt-4">
              <input
                type="text"
                name={`question-${index}`}
                placeholder={`Question ${index + 1}`}
                value={questions[index]} // Bind the input value to the corresponding question
                onChange={(e) => handleQuestionChange(index, e.target.value)} // Handle input change
                required
                className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
              />
            </div>
          ))}

          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit" // Trigger the form submission
              className="w-full px-6 py-2.5 font-medium tracking-wide rounded-sm bg-active-color text-black flex items-center gap-1 justify-center"
            >
              Submit Contest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuestion;
