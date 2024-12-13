// Import necessary dependencies
import useLoadSecureData from "../../Hooks/useLoadSecureData"; // Custom hook to load secure data
import Container from "../../Layout/Container"; // Container component for layout styling

function Emergency() {
  // Use the custom hook to load data from the "/emergency" endpoint
  const { data: emergencies } = useLoadSecureData("/emergency");

  return (
    <div className="mt-12">
      {/* Container component for layout */}
      <Container>
        <div>
          {/* Title for the emergencies table */}
          <h2 className="text-2xl font-bold text-active-color border-b-2 inline-block pb-1 pr-2 mb-5 border-active-color capitalize">
            Emergencies
          </h2>
          
          {/* Table to display the list of emergencies */}
          <table className="table mb-10">
            {/* Table head with column names */}
            <thead className="text-active-color bg-secondary-color">
              <tr>
                <th>Contest ID</th>
                <th>User Email</th>
                <th>Time left</th>
              </tr>
            </thead>
            <tbody>
              {/* Check if emergencies data is available */}
              {emergencies?.length ? (
                // Map through emergencies data and display each emergency in a row
                emergencies?.map((emergency) => (
                  <tr key={emergency?._id} className="text-white">
                    <th>{emergency?._id}</th> {/* Display Contest ID */}
                    <td>{emergency?.userEmail}</td> {/* Display User Email */}
                    <td>
                      {/* Format and display the time left */}
                      <span>{emergency?.timeLeft.hours}h</span> :{" "}
                      <span>{emergency?.timeLeft.minutes}m</span> :{" "}
                      <span>{emergency?.timeLeft.seconds}s</span>
                    </td>
                  </tr>
                ))
              ) : (
                // If there are no emergencies, display this message
                <div className="text-lg mt-4">
                  No Submitted Contests Available
                </div>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

export default Emergency;
