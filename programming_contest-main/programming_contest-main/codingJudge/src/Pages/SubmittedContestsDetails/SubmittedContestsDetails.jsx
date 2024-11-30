import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useLoadSecureData from "../../Hooks/useLoadSecureData";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Container from "../../Layout/Container";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

function SubmittedContestsDetails() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const { data: submittedContest } = useLoadSecureData(
    `/submittedContests/${id}`
  );

  const { data: contest } = useLoadSecureData(
    `/contests/${submittedContest?.contestId}`
  );

  // State to track feedback
  const [feedback, setFeedback] = useState(
    new Array(contest?.questions?.length || 0).fill("")
  );

  // Handle feedback change
  const handleFeedbackChange = (questionIndex, value) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[questionIndex] = value;
    setFeedback(updatedFeedback);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const updatedData = {
      feedback,
      status: "Checked",
    };
    try {
      const res = await axiosSecure.put(
        `/submittedContests/${id}`,
        updatedData
      );
      if (res.data?.success) {
        toast.success("Successfully Checked.");
        navigate("/allSubmittedContests");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Check if all questions have feedback
  const allFeedbackProvided =
    contest?.questions?.length &&
    contest.questions.every((_, idx) => feedback[idx]);

  return (
    <div
      className="-mt-[68px] min-h-screen pt-28 px-4 pb-10"
    >
      <Container>
        {contest?.questions?.map((question, idx) => (
          <div key={idx} className="mb-10 text-white font-medium">
            <p>
              <span className="text-xl">Question {idx + 1} :</span>{" "}
              {question || "No question text available."}
            </p>
            <p className="my-5">Answer :</p>
            <SyntaxHighlighter language="javascript" style={atomOneDark}>
              {submittedContest?.code?.[idx] || "// No code provided"}
            </SyntaxHighlighter>

            {/* Feedback Section */}
            <div className="my-4">
              <p className="text-lg mb-2">Feedback:</p>
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`feedback-${idx}`}
                    value="Good"
                    checked={feedback[idx] === "Good"}
                    onChange={() => handleFeedbackChange(idx, "Good")}
                  />
                  <label className="mr-4">Good</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`feedback-${idx}`}
                    value="Needs Improvement"
                    checked={feedback[idx] === "Needs Improvement"}
                    onChange={() =>
                      handleFeedbackChange(idx, "Needs Improvement")
                    }
                  />
                  <label className="mr-4">Needs Improvement</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`feedback-${idx}`}
                    value="Incorrect"
                    checked={feedback[idx] === "Incorrect"}
                    onChange={() => handleFeedbackChange(idx, "Incorrect")}
                  />
                  <label>Incorrect</label>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleSubmit}
            disabled={!allFeedbackProvided}
            className={`px-6 py-2 font-bold rounded ${
              allFeedbackProvided
                ? "bg-active-color text-secondary-color hover:scale-105 duration-500"
                : "bg-gray-500 text-white cursor-not-allowed"
            }`}
          >
            Submit Feedback
          </button>
        </div>
      </Container>
    </div>
  );
}

export default SubmittedContestsDetails;
