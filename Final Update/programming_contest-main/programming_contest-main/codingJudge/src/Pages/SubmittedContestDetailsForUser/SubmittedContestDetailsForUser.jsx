import { Link, useParams } from "react-router-dom"; // Import necessary hooks and components
import useLoadSecureData from "../../Hooks/useLoadSecureData"; // Custom hook for secure API data fetching
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"; // Syntax highlighter for code snippets
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"; // Syntax highlighter theme
import Container from "../../Layout/Container"; // Layout component for consistent styling

function SubmittedContestDetailsForUser() {
  // Extract the contest ID from the route parameters
  const { id } = useParams();

  // Fetch the submitted contest details using the custom hook
  const { data: submittedContest } = useLoadSecureData(`/submittedContests/${id}`);

  // Fetch the contest details using the contest ID from the submitted contest data
  const { data: contest } = useLoadSecureData(`/contests/${submittedContest?.contestId}`);
  return (
    <div className="-mt-[68px] min-h-screen pt-28 px-4 pb-10">
      {/* Use the Container component for consistent layout */}
      <Container>
        {/* Render each question in the contest */}
        {contest?.questions?.map((question, idx) => (
          <div key={idx} className="mb-16 text-white font-medium">
            <div className="flex justify-between items-center">
              {/* Display question text */}
              <p>
                <span className="text-xl">Question {idx + 1} :</span>{" "}
                {question || "No question text available."} {/* Fallback if no question text */}
              </p>
              
              {/* Display feedback if available */}
              {submittedContest?.feedback?.length && (
                <p>
                  Feedback :{" "}
                  <span className="text-active-color">
                    {submittedContest?.feedback?.[idx]} {/* Feedback for this question */}
                  </span>
                </p>
              )}
            </div>
            <p className="my-5">Answer :</p>
            {/* Highlight the user's submitted code */}
            <SyntaxHighlighter language="javascript" style={atomOneDark}>
              {submittedContest?.code?.[idx]} {/* Code for this question */}
            </SyntaxHighlighter>
          </div>
        ))}

        {/* Render leaderboard button if the contest has been checked */}
        {submittedContest?.status === "Checked" && (
          <div className="flex justify-end">
            <Link
              to={`/leaderboard/${submittedContest?.contestId}`} // Link to the leaderboard
              className="bg-active-color text-black text-2xl py-2 rounded px-10"
            >
              Leaderboard
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}

export default SubmittedContestDetailsForUser; // Export the component for use
