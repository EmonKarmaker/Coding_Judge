import { useNavigate, useParams } from "react-router-dom";
import Container from "../../Layout/Container";
import useLoadSecureData from "../../Hooks/useLoadSecureData";
import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

function ContestPaper() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);

  // Fetch dbUser data once the user is available
  useEffect(() => {
    const getDbUser = async () => {
      const res = await fetch(`http://localhost:5000/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data);
    };
    if (user) {
      getDbUser();
    }
  }, [user]);

  const { id } = useParams();
  const { data: contest = { questions: [], duration: 5 }, error } =
    useLoadSecureData(`/contests/${id}`);

  const [targetDate, setTargetDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [code, setCode] = useState([]);

  // Function to calculate time left
  const getTimeLeft = (target) => {
    const difference = +new Date(target) - +new Date();
    return {
      hours: Math.max(Math.floor(difference / (1000 * 60 * 60)), 0),
      minutes: Math.max(Math.floor((difference / (1000 * 60)) % 60), 0),
      seconds: Math.max(Math.floor((difference / 1000) % 60), 0),
    };
  };

  // Initialize target date and code answers when contest data is available
  useEffect(() => {
    if (!contest?.duration) return;

    const storedTime = localStorage.getItem(`targetDate_${id}`);
    let newTargetDate;

    if (storedTime) {
      newTargetDate = new Date(storedTime);
    } else {
      newTargetDate = new Date(
        new Date().getTime() + contest.duration * 60 * 1000
      );
      localStorage.setItem(`targetDate_${id}`, newTargetDate.toISOString());
    }

    setTargetDate(newTargetDate);
    setCode(contest.questions.map(() => "// Start coding here..."));
  }, [contest, id]);

  // Update the timer every second, but only if timeLeft changes
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(targetDate);

      // Only update timeLeft if it changes to avoid unnecessary state updates
      setTimeLeft((prevTimeLeft) => {
        if (
          prevTimeLeft.hours !== newTimeLeft.hours ||
          prevTimeLeft.minutes !== newTimeLeft.minutes ||
          prevTimeLeft.seconds !== newTimeLeft.seconds
        ) {
          return newTimeLeft;
        }
        return prevTimeLeft; // No update if the value hasn't changed
      });

      if (
        newTimeLeft.hours <= 0 &&
        newTimeLeft.minutes <= 0 &&
        newTimeLeft.seconds <= 0
      ) {
        clearInterval(timer);
        localStorage.removeItem(`targetDate_${id}`);
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [targetDate, id]);

  const handleCodeChange = (value, idx) => {
    const updatedCode = [...code];
    updatedCode[idx] = value;
    setCode(updatedCode);
  };

  if (error) {
    return (
      <p className="text-white">
        Error loading contest data. Please try again later.
      </p>
    );
  }

  const handleSubmit = async () => {
    const submittedContest = {
      contestId: contest?._id,
      contestName: contest?.title,
      userEmail: dbUser?.email,
      timeLeft,
      code,
      status: "pending",
    };

    const res = await axiosSecure.post("/submittedContests", submittedContest);

    if (res?.data?.insertedId) {
      toast.success("Submitted Successfully.");
      navigate("/");
    }
  };

  const isTimeUp =
    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div
      className="-mt-[68px] min-h-screen pt-36"
    >
      <Container>
        <div className="flex justify-end fixed right-6 top-24 z-50 bg-active-color px-10 py-2 rounded">
          <p className="text-3xl font-medium text-secondary-color flex gap-2">
            <span>{timeLeft.hours}h</span> : <span>{timeLeft.minutes}m</span> :{" "}
            <span>{timeLeft.seconds}s</span>
          </p>
        </div>
        {contest.questions.length > 0 ? (
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
                value={code[idx]}
                height="70vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                options={{ lineNumbers: "on" }}
                onChange={(value) => handleCodeChange(value, idx)}
              />
            </div>
          ))
        ) : (
          <p className="text-white">Loading questions...</p>
        )}
        <div className="flex justify-end items-center w-full my-10 mr-5 gap-4">
          <button
            disabled={isTimeUp}
            className={`${
              isTimeUp
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-active-color hover:bg-secondary-color hover:text-white duration-500"
            } text-black text-2xl py-2 rounded btn-wide`}
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
            } text-black text-2xl py-2 rounded btn-wide`}
          >
            Submit Code
          </button>
        </div>
      </Container>
    </div>
  );
}

export default ContestPaper;
