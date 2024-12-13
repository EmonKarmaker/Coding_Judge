// Import necessary dependencies
import useAuth from "../../Hooks/useAuth"; // Custom hook to manage authentication
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import { GrFormNextLink } from "react-icons/gr"; // Import an icon for the 'Next' button
import { useNavigate } from "react-router-dom"; // Hook to programmatically navigate between routes

const CreateContest = () => {
  // Initialize useNavigate hook for navigation
  const navigate = useNavigate();
  
  // Retrieve user data from the custom useAuth hook
  const { user } = useAuth();
  
  // If there's no authenticated user, reload the page
  if (!user) {
    window.location.reload();
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    const form = e.target; // Get the form element
    // Extract values from form fields
    const title = form.title.value;
    const contestCode = form.contestCode.value;
    const duration = form.duration.value;
    const numberOfQuestion = form.numberOfQuestion.value;
    const description = form.description.value;

    // Create a contest object with the form data
    const contest = {
      title,
      contestCode,
      duration,
      numberOfQuestion,
      description,
    };
    
    // Store the contest data in local storage for later use
    localStorage.setItem("contest", JSON.stringify(contest));

    // Navigate to the next page ('/createQuestion') after form submission
    navigate("/createQuestion");
  };

  // JSX structure for the "Create Contest" page
  return (
    <div className="-mt-[68px] min-h-screen pt-32 xl:pt-28 px-4 pb-10">
      {/* Container for the form */}
      <div className="w-full max-w-4xl p-6 m-auto mx-auto rounded border border-[#ABABAB]">
        <div>
          {/* Heading for the form */}
          <h2 className="text-lg font-bold text-white">Create a Contest</h2>
        </div>

        {/* Form for creating a contest */}
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Input field for contest title */}
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          {/* Input field for contest code */}
          <div>
            <input
              type="text"
              name="contestCode"
              placeholder="Contest Code"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          {/* Input field for contest duration */}
          <div>
            <input
              type="number"
              name="duration"
              placeholder="Duration (Minutes)"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          {/* Input field for the number of questions in the contest */}
          <div>
            <input
              type="number"
              name="numberOfQuestion"
              placeholder="Number Of Question"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          {/* Textarea for the contest description */}
          <div>
            <textarea
              name="description"
              placeholder="Description"
              required
              className="block w-full text-sm placeholder:text-white text-white py-2 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent placeholder:mt-2"
            />
          </div>

          {/* Submit button */}
          <div className="mt-6">
            <button className="w-full px-6 py-2.5 font-medium tracking-wide rounded-sm bg-active-color text-black flex items-center gap-1 justify-center">
              Next <GrFormNextLink className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContest;
