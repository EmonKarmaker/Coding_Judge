import useLoadPublicData from "../../Hooks/useLoadPublicData"; // Custom hook for loading public data (contests)
import Container from "../../Layout/Container"; // Custom container layout for the page
import { Link } from "react-router-dom"; // For navigating to other routes

function Contests() {
  const { data: contests } = useLoadPublicData("/contests"); // Fetch contests data using the custom hook

  return (
    <div
      className="-mt-[68px] min-h-screen pt-28 px-4" // Styling to set padding and margin for the container
    >
      <Container>
        <div>
          {/* Title section for the contests page */}
          <h2 className="text-2xl font-bold text-active-color border-b-2 inline-block pb-1 pr-2 border-active-color capitalize">
            Top skill tests
          </h2>
          {/* Description paragraph about the contests */}
          <p className="my-5 text-white">
            Test your knowledge in Python, C, C++, and Java and DSA concepts.
            Skill tests help you check your industry readiness in the courses
            you are learning.
          </p>
          {/* Table displaying the list of contests */}
          <table className="table mb-10">
            {/* Table Header */}
            <thead className="text-active-color bg-secondary-color">
              <tr>
                <th>Code</th> {/* Contest code */}
                <th>Contest Name</th> {/* Name of the contest */}
                <th>Duration</th> {/* Duration of the contest */}
                <th>No. Of Question</th> {/* Number of questions in the contest */}
                <th>Action</th> {/* Action to view details */}
              </tr>
            </thead>
            <tbody>
              {/* Render contests if available */}
              {contests ? (
                contests?.map((contest) => (
                  // Map through the contests data to display each contest
                  <tr key={contest?._id} className="text-white">
                    <th>{contest?.contestCode}</th> {/* Display contest code */}
                    <td>{contest?.title}</td> {/* Display contest name */}
                    <td>{contest?.duration} Min</td> {/* Display contest duration */}
                    <td>{contest?.numberOfQuestion}</td> {/* Display number of questions */}
                    <th>
                      {/* Link to contest details page */}
                      <Link
                        to={`/contestDetails/${contest?._id}`}
                        className="btn-xs hover:bg-white text-black uppercase rounded bg-active-color py-[2px]"
                      >
                        details {/* Text for the link */}
                      </Link>
                    </th>
                  </tr>
                ))
              ) : (
                // Display message if there are no contests available
                <div className="text-lg mt-4">No Contests Available</div>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

export default Contests;
