import { useNavigate, useParams } from "react-router-dom"; // For navigation and fetching params from the URL
import useLoadSecureData from "../../Hooks/useLoadSecureData"; // Custom hook for secure data fetching
import Container from "../../Layout/Container"; // Layout component for consistent page structure
import Swal from "sweetalert2"; // For modal alerts and confirmations
import { toast } from "react-toastify"; // For displaying toast notifications
import useAuth from "../../Hooks/useAuth"; // Custom hook for accessing authentication data
import { useEffect, useState } from "react"; // React hooks for state and side effects
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // Custom hook for making secure API calls
import useLoadPublicData from "../../Hooks/useLoadPublicData"; // Custom hook for public data fetching

function ContestDetails() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams(); // Extracting the contest ID from the URL params
  const { data: contest } = useLoadSecureData(`/contests/${id}`); // Fetch contest details using the ID

  const { user } = useAuth(); // Getting the authenticated user
  const [dbUser, setDbUser] = useState(null); // State to store user details fetched from the database
  const { data: submittedContests } = useLoadSecureData(`/submittedContestsByUser/${user?.email}`); // Fetch user's submitted contests
  const { data: emergencyData } = useLoadSecureData(`/emergency/${user?.email}`); // Fetch user's emergency status for contests
  const { data } = useLoadPublicData(`/submittedContests`); // Fetch all submitted contests

  const isTaken = submittedContests?.some((item) => item.contestId === id); // Check if the user has already taken this contest
  const onEmergency = emergencyData?.some((item) => item.contestId === id); // Check if the user is on emergency status for this contest
  const participated = data?.some((item) => item.contestId === id); // Check if the contest is already in the list of submitted contests

  useEffect(() => {
    // Fetch user details when the user is authenticated
    const getDbUser = async () => {
      const res = await fetch(`https://coding-judge-server.vercel.app/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data);
    };
    if (user) {
      getDbUser();
    }
  }, [user]);

  const handleDeleteContest = () => {
    // Handling contest deletion with a confirmation modal
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2f4858",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (participated) {
          // If the contest has been participated in, just hide it
          const updatedData = { visibility: "Hide" };
          const res = await axiosSecure.put(`/contests/${id}`, updatedData);
          if (res?.data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Contest has been deleted.",
              icon: "success",
              confirmButtonColor: "#2f4858",
            });
            navigate("/contests");
          }
        } else {
          // If the contest hasn't been participated in, delete it
          const res = await axiosSecure.delete(`/contests/${id}`);
          if (res?.data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Contest has been deleted.",
              icon: "success",
              confirmButtonColor: "#2f4858",
            });
            navigate("/contests");
          }
        }
      }
    });
  };

  const handleModal = () => {
    // Handling the modal for taking the contest
    if (isTaken) {
      Swal.fire({
        title: "Participated!",
        text: "You have already participated.",
        icon: "success",
        confirmButtonColor: "#2f4858",
      });
      navigate("/contests");
    } else if (onEmergency) {
      Swal.fire({
        title: "On Emergency!",
        text: "You have faced issues on the contest.",
        icon: "success",
        confirmButtonColor: "#2f4858",
      });
      navigate("/contests");
    } else {
      // Prompt for contest code
      Swal.fire({
        title: "Are you sure?",
        text: "You want to take this contest!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f4858",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, take it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { value: contestCode } = await Swal.fire({
            title: "Enter contest code",
            input: "text",
            inputLabel: "Contest Code",
            inputPlaceholder: "Enter The Contest Code",
            confirmButtonColor: "#2f4858",
          });
          if (contestCode && contestCode === contest?.contestCode) {
            navigate(`/contestPaper/${contest?._id}`);
          } else {
            toast.error("Enter a valid code.");
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10">
      <Container>
        <>
          {/* Contest details section */}
          <h4 className="text-4xl font-semibold text-white">{contest?.title}</h4>
          <p className="text-2xl mt-10 text-white">Duration : {contest?.duration} Min</p>
          <p className="text-2xl mt-10 text-white">Code : <span className="text-active-color">{contest?.contestCode}</span></p>
          <p className="text-2xl mt-10 text-white">Description : {contest?.description}</p>

          {/* Conditional button based on role */}
          {dbUser?.role === "Admin" ? (
            <div className="mt-10 flex justify-end">
              <button onClick={handleDeleteContest} className="text-xl bg-active-color text-black px-10 py-2 rounded font-medium hover:scale-105 duration-500">
                Delete The Contest
              </button>
            </div>
          ) : (
            <div className="mt-10 flex justify-end">
              <button onClick={handleModal} className="text-xl bg-active-color text-black px-10 py-2 rounded font-medium hover:scale-105 duration-500">
                Take The Contest
              </button>
            </div>
          )}
        </>
      </Container>
    </div>
  );
}

export default ContestDetails;
