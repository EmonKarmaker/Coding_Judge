import { useNavigate, useParams } from "react-router-dom";
import useLoadSecureData from "../../Hooks/useLoadSecureData";
import Container from "../../Layout/Container";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

function ContestDetails() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: contest } = useLoadSecureData(`/contests/${id}`);

  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);

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

  const handleDeleteContest = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6440FA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/contests/${id}`);
        if (res?.data?.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Contest has been deleted.",
            icon: "success",
            confirmButtonColor: "#6440FA",
          });
          navigate("/contests");
        }
      }
    });
  };

  const handleModal = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to take this contest!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6440FA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, take it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: contestCode } = await Swal.fire({
          title: "Inter contest code",
          input: "text",
          inputLabel: "Contest Code",
          inputPlaceholder: "Enter The Contest Code",
          confirmButtonColor: "#6440FA",
        });
        if (contestCode && contestCode === contest?.contestCode) {
          navigate(`/contestPaper/${contest?._id}`);
        } else {
          toast.error("Enter valid code.");
        }
      }
    });
  };

  return (
    <div
      className="-mt-[68px] min-h-screen pt-36 px-4"
    >
      <Container>
        <>
          <h4 className="text-4xl font-semibold text-white">
            {contest?.title}
          </h4>

          <p className="text-2xl mt-10 text-white">
            Duration : {contest?.duration} Min
          </p>

          <p className="text-2xl mt-10 text-white">
            Code :{" "}
            <span className="text-active-color">{contest?.contestCode}</span>
          </p>

          <p className="text-2xl mt-10 text-white">
            Description : {contest?.description}
          </p>

          {dbUser?.role === "Admin" ? (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleDeleteContest}
                className="text-xl bg-active-color text-black px-10 py-2 rounded font-medium hover:scale-105 duration-500"
              >
                Delete The Contest
              </button>
            </div>
          ) : (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleModal}
                className="text-xl bg-active-color text-black px-10 py-2 rounded font-medium hover:scale-105 duration-500"
              >
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
