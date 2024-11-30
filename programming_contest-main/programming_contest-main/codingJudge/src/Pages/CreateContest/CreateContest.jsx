import useAuth from "../../Hooks/useAuth";
import "react-datepicker/dist/react-datepicker.css";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) {
    window.location.reload();
  }
  // const userEmail = user.email;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const contestCode = form.contestCode.value;
    const duration = form.duration.value;
    const numberOfQuestion = form.numberOfQuestion.value;
    const description = form.description.value;

    const contest = {
      title,
      contestCode,
      duration,
      numberOfQuestion,
      description,
    };
    localStorage.setItem("contest", JSON.stringify(contest));
    // form.reset();
    navigate("/createQuestion");
  };

  return (
    <div
      className="-mt-[68px] min-h-screen pt-32 xl:pt-28 px-4 pb-10"
    >
      <div className="w-full max-w-4xl p-6 m-auto mx-auto rounded border border-[#ABABAB]">
        <div>
          <h2 className="text-lg font-bold text-white">Create a Contest</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          <div>
            <input
              type="text"
              name="contestCode"
              placeholder="Contest Code"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          <div>
            <input
              type="number"
              name="duration"
              placeholder="Duration (Minutes)"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          <div>
            <input
              type="number"
              name="numberOfQuestion"
              placeholder="Number Of Question"
              required
              className="block w-full text-sm placeholder:text-white text-white py-3 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          <div>
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              required
              className="block w-full text-sm placeholder:text-white text-white py-2 pl-1 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent placeholder:mt-2"
            />
          </div>

          <div className="mt-6">
            <button className="w-full px-6 py-2.5 font-medium tracking-wide rounded-sm bg-active-color text-black flex items-center gap-1 justify-center">
              Next <GrFormNextLink className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContest;
