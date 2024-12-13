import { useNavigate, useParams } from "react-router-dom"; // For navigation and route parameters
import Container from "../../Layout/Container"; // Custom layout container component
import useLoadSecureData from "../../Hooks/useLoadSecureData"; // Custom hook for loading secure data
import { useEffect, useState } from "react"; // React hooks for state management and side-effects
import { Editor } from "@monaco-editor/react"; // Monaco editor for code input
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // Custom hook for secure axios requests
import { toast } from "react-toastify"; // Toast notification for success messages
import Swal from "sweetalert2"; // SweetAlert2 for the emergency confirmation popup

function ContestPaper() {
  const navigate = useNavigate(); // For navigating between pages
  const axiosSecure = useAxiosSecure(); // For making secure axios requests
  const { user } = useAuth(); // To get the current authenticated user
  const [dbUser, setDbUser] = useState(null); // State to store user data from the database

  // Fetch dbUser data once the user is available
  useEffect(() => {
    const getDbUser = async () => {
      const res = await fetch(`https://coding-judge-server.vercel.app/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data); // Update dbUser state with fetched data
    };
    if (user) {
      getDbUser(); // Fetch user data only if user is authenticated
    }
  }, [user]);

  const { id } = useParams(); // Get the contest ID from URL
  const { data: contest = { questions: [], duration: 5 }, error } = 
    useLoadSecureData(`/contests/${id}`); // Load contest data using the custom hook

  const [targetDate, setTargetDate] = useState(null); // Target date for contest deadline
  const [timeLeft, setTimeLeft] = useState({
    hours: 0, // Initial hours left
    minutes: 0, // Initial minutes left
    seconds: 0, // Initial seconds left
  });
  const [code, setCode] = useState([]); // State to store the code answers for each question

  // Function to calculate the remaining time
  const getTimeLeft = (target) => {
    const difference = +new Date(target) - +new Date(); // Calculate time difference
    return {
      hours: Math.max(Math.floor(difference / (1000 * 60 * 60)), 0), // Calculate hours
      minutes: Math.max(Math.floor((difference / (1000 * 60)) % 60), 0), // Calculate minutes
      seconds: Math.max(Math.floor((difference / 1000) % 60), 0), // Calculate seconds
    };
  };

  // Initialize target date and code answers when contest data is available
  useEffect(() => {
    if (!contest?.duration) return; // Ensure contest data is valid

    // Check if there is a stored target date in localStorage
    const storedTime = localStorage.getItem(`targetDate_${dbUser?._id}_${id}`);
    let newTargetDate;

    if (storedTime) {
      newTargetDate = new Date(storedTime); // Retrieve stored target date
    } else {
      // Set a new target date based on contest duration
      newTargetDate = new Date(new Date().getTime() + contest.duration * 60 * 1000);
      if (dbUser) {
        localStorage.setItem(`targetDate_${dbUser?._id}_${id}`, newTargetDate.toISOString()); // Store target date in localStorage
      }
    }

    setTargetDate(newTargetDate); // Set the target date for countdown
    setCode(contest.questions.map(() => "// Start coding here...")); // Initialize code for each question
  }, [contest, dbUser, id]);

  // Update the timer every second, but only if timeLeft changes
  useEffect(() => {
    if (!targetDate) return; // Ensure target date is available

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(targetDate); // Calculate the remaining time

      // Only update timeLeft if it changes to avoid unnecessary state updates
      setTimeLeft((prevTimeLeft) => {
        if (
          prevTimeLeft.hours !== newTimeLeft.hours ||
          prevTimeLeft.minutes !== newTimeLeft.minutes ||
          prevTimeLeft.seconds !== newTimeLeft.seconds
        ) {
          return newTimeLeft; // Update timeLeft if values are different
        }
        return prevTimeLeft; // No update if the value hasn't changed
      });

      // Stop the timer and remove the target date if time is up
      if (newTimeLeft.hours <= 0 && newTimeLeft.minutes <= 0 && newTimeLeft.seconds <= 0) {
        clearInterval(timer);
        localStorage.removeItem(`targetDate_${dbUser?._id}_${id}`); // Remove target date from localStorage when time is up
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [targetDate, dbUser, id]);

  // Update the code state when a user changes their answer in the editor
  const handleCodeChange = (value, idx) => {
    const updatedCode = [...code];
    updatedCode[idx] = value; // Update the code for the specific question
    setCode(updatedCode); // Set the updated code state
  };

  if (error) {
    return (
      <p className="text-white">
        Error loading contest data. Please try again later.
      </p>
    );
  }

  // Handle contest submission
  const handleSubmit = async () => {
    const submittedContest = {
      contestId: contest?._id,
      contestName: contest?.title,
      userEmail: dbUser?.email,
      timeLeft,
      code,
      status: "Pending", // Status of the submission
    };

    const res = await axiosSecure.post("/submittedContests", submittedContest); // Submit contest data

    if (res?.data?.insertedId) {
      toast.success("Submitted Successfully."); // Show success notification
      navigate("/contests"); // Navigate back to contests page
      localStorage.removeItem(`targetDate_${dbUser?._id}_${id}`); // Clean up localStorage after submission
    }
  };

  // Handle emergency button press
  const handleEmergency = async () => {
    const emergencyData = {
      contestId: contest?._id,
      userEmail: dbUser?.email,
      timeLeft,
    };

    Swal.fire({
      title: "Are you sure?", // Emergency confirmation alert
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2f4858",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.post("/emergency", emergencyData); // Notify admin
        if (res?.data?.success) {
          Swal.fire({
            title: "Notified!",
            text: "Your data has been sent to admin.",
            icon: "success",
            confirmButtonColor: "#2f4858",
          });
          navigate("/contests"); // Navigate back to contests page
          localStorage.removeItem(`targetDate_${dbUser?._id}_${id}`); // Clean up localStorage
        }
      }
    });
  };

  // Check if time is up
  const isTimeUp =
    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="-mt-[68px] min-h-screen pt-36">
      <Container>
        {contest && (
          // Display contest timer if contest data is available
          <div className="flex justify-end fixed right-6 top-24 z-50 bg-active-color px-10 py-2 rounded">
            <p className="text-3xl font-medium text-secondary-color flex gap-2">
              <span>{timeLeft.hours}h</span> : <span>{timeLeft.minutes}m</span>{" "}
              : <span>{timeLeft.seconds}s</span>
            </p>
          </div>
        )}
        {contest.questions.length > 0 ? (
          // Render each contest question with its corresponding Monaco editor
          contest.questions.map((question, idx) => (
            <div key={idx} className="mb-10">
              <div className="mx-4 mb-5 space-y-5 flex justify-between items-center gap-16">
                <div className="space-y-5 text-white font-medium">
                  <p>
                    <span className="text-xl">Question {idx + 1} :</span>{" "}
                    {question || "No question text available."}
                  </p>
                  <p>Write your answer below:</p>
                </div>
              </div>

              <Editor
                value={code[idx]} // Set the value of the editor to the current code for this question
                height="70vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                options={{ lineNumbers: "on" }}
                onChange={(value) => handleCodeChange(value, idx)} // Handle code change
              />
            </div>
          ))
        ) : (
          <p className="text-white">Loading questions...</p>
        )}
        <p className="italic">
          If you face any issues then press the emergency button. Otherwise you
          wont be able to participate in the contest.
        </p>
        <div className="flex justify-end items-center w-full my-10 mr-5 gap-4">
          <button
            onClick={handleEmergency}
            disabled={isTimeUp}
            className={`${
              isTimeUp
                ? "bg-gray-400 cursor-not-allowed text-black"
                : "bg-red-600 duration-500 text-white"
            } text-xl py-2 rounded btn-wide`}
          >
            Emergency
          </button>
          <button
            onClick={handleSubmit}
            disabled={isTimeUp}
            className={`${
              isTimeUp
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-active-color hover:bg-secondary-color hover:text-white duration-500"
            } text-black text-xl py-2 rounded btn-wide`}
          >
            Submit Code
          </button>
        </div>
      </Container>
    </div>
  );
}

export default ContestPaper;
