import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import useAuth from "../../Hooks/useAuth";
import addImage from "../../assets/addImage.png";
import toast from "react-hot-toast";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const imgHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imgHostingApi = `https://api.imgbb.com/1/upload?key=${imgHostingKey}`;

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { signUpWithEmail, updateUser, logOut } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  // getting formData
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    const imageFile = { image: formData?.profileImage };

    try {
      const res = await axiosPublic.post(imgHostingApi, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      const photoURL = res.data.data.display_url;

      const email = formData?.email;
      const password = formData?.password;
      const confirmPassword = formData?.confirmPassword;

      if (res?.data?.success) {
        const userData = {
          name: formData?.name,
          email: formData?.email,
          password: formData?.password,
          photo_url: photoURL,
          role: "User",
        };

        if (password !== confirmPassword) {
          toast.error("Please confirm your password.", { id: toastId });
        } else {
          signUpWithEmail(email, password)
            .then(() => {
              fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  if (data?.result?.insertedId || data?.success) {
                    toast.success("Sign Up Successful.", { id: toastId });
                    updateUser(name, photoURL)
                      .then(() => {
                        toast.success("Profile Updated.", { id: toastId });
                      })
                      .catch((err) => {
                        toast.error(err.message, { id: toastId });
                        console.log(err);
                      });
                    logOut().then().catch();
                    navigate("/login");
                  }
                });
            })
            .catch((err) => {
              toast.error(err.message, { id: toastId });
            });
        }
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div
      className="-mt-[68px] min-h-screen pt-24 xl:pt-28 px-4 pb-10"
    >
      <div className="w-full max-w-sm p-6 m-auto mx-auto rounded border border-[#ABABAB]">
        <div>
          <h2 className="text-lg font-bold text-white">Create An Account</h2>
        </div>

        <form onSubmit={handleSignUp} className="mt-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
          />

          <div className="mt-4 relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
            <div
              className="absolute right-2 top-3 inline-block cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <BsEyeSlash></BsEyeSlash> : <BsEye></BsEye>}
            </div>
          </div>

          <div className="mt-4 relative">
            <input
              type={show1 ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
            <div
              className="absolute right-2 top-3 inline-block cursor-pointer"
              onClick={() => setShow1(!show1)}
            >
              {show1 ? <BsEyeSlash></BsEyeSlash> : <BsEye></BsEye>}
            </div>
          </div>

          {/* Image form */}
          <div className="mt-5 flex flex-col justify-center items-center gap-2 cursor-pointer">
            <input
              className="w-full px-4 bg-transparent text-white outline-none placeholder:text-white"
              id="image"
              type="file"
              name="profileImage"
              accept="image/*"
              style={{ display: "none" }}
              required
              onChange={handleChange}
            />
            <div className="flex flex-col justify-center items-center gap-2 cursor-pointer text-white text-sm">
              <label
                htmlFor="image"
                className="flex flex-col justify-center items-center gap-2 cursor-pointer text-white text-sm"
              >
                <img className="w-6" src={addImage} alt="add profile photo" />
                <p>Upload Your Photo</p>
              </label>
            </div>

            {formData.profileImage && (
              <img
                className=""
                src={URL.createObjectURL(formData.profileImage)}
                alt="profile photo"
                style={{ maxWidth: "80px" }}
              />
            )}
          </div>

          <div className="mt-6">
            <button className="w-full px-6 py-2.5 font-medium tracking-wide rounded-sm bg-active-color text-white">
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-8 font-light text-center text-gray-300">
          {" "}
          Already have an account?{" "}
          <Link
            to={"/logIn"}
            className="font-medium text-active-color hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
