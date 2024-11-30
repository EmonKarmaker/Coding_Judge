import { useParams } from "react-router-dom";
import useLoadSecureData from "../../Hooks/useLoadSecureData";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Container from "../../Layout/Container";

function SubmittedContestDetailsForUser() {
  const { id } = useParams();
  const { data: submittedContest } = useLoadSecureData(
    `/submittedContests/${id}`
  );

  const { data: contest } = useLoadSecureData(
    `/contests/${submittedContest?.contestId}`
  );

  return (
    <div
      className="-mt-[68px] min-h-screen pt-28 px-4"
    >
      <Container>
        {contest?.questions?.map((question, idx) => (
          <div key={idx} className="mb-10 text-white font-medium">
            <p>
              <span className="text-xl">Question {idx + 1} :</span>{" "}
              {question || "No question text available."}
            </p>
            <p key={idx} className="my-5">
              Answer :
            </p>
            <SyntaxHighlighter language="javascript" style={atomOneDark}>
              {submittedContest?.code?.[idx]}
            </SyntaxHighlighter>
          </div>
        ))}
      </Container>
    </div>
  );
}

export default SubmittedContestDetailsForUser;
