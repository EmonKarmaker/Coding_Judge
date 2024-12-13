import { Link } from "react-router-dom"; // Import Link for navigation
import useAuth from "../../Hooks/useAuth"; // Custom hook to get authentication data
import useLoadSecureData from "../../Hooks/useLoadSecureData"; // Custom hook for secure API data fetching
import Container from "../../Layout/Container"; // Layout component for consistent styling

function SubmittedContests() {
  const { user } = useAuth(); // Get the currently authenticated user's data
  const { data: submittedContests } = useLoadSecureData(
    `/submittedContestsByUser/${user?.email}` // Fetch submitted contests for the current user
  );

  return (
    <div className="-mt-[68px] min-h-screen pt-28 px-4">
      <Container>
        <div>
          {/* Page Header */}
          <h2 className="text-2xl font-bold text-active-color border-b-2 inline-block pb-1 pr-2 mb-5 border-active-color capitalize">
            Your Submitted Contests
          </h2>

          {/* Table for displaying submitted contests */}
          <table className="table mb-10">
            {/* Table Head */}
            <thead className="text-active-color bg-secondary-color">
              <tr>
                <th>Contest Name</th>
                <th>Time left</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Render list of submitted contests */}
              {submittedContests?.length ? (
                submittedContests?.map((submittedContest) => (
                  <tr key={submittedContest?._id} className="text-white">
                    {/* Contest Name */}
                    <th>{submittedContest?.contestName}</th>

                    {/* Time left */}
                    <td>
                      <span>{submittedContest?.timeLeft.hours}h</span> :{" "}
                      <span>{submittedContest?.timeLeft.minutes}m</span> :{" "}
                      <span>{submittedContest?.timeLeft.seconds}s</span>
                    </td>

                    {/* Submission Status */}
                    <td className="capitalize">{submittedContest?.status}</td>

                    {/* Details Button */}
                    <th>
                      <Link
                        to={`/submittedContestDetailsForUser/${submittedContest?._id}`} // Navigate to contest details page
                        className="btn-xs hover:bg-white text-black uppercase rounded bg-active-color py-[2px]"
                      >
                        details
                      </Link>
                    </th>
                  </tr>
                ))
              ) : (
                // Show a message if there are no submitted contests
                <div className="text-lg mt-4">No Submitted Contests Available</div>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

export default SubmittedContests; // Export the component
