import { useState } from "react"; // Import React's useState hook for state management
import { Link, useNavigate } from "react-router-dom"; // Import navigation tools
import { BsEye, BsEyeSlash } from "react-icons/bs"; // Import icons for password visibility toggle
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication
import addImage from "../../assets/addImage.png"; // Add image placeholder for profile upload
import toast from "react-hot-toast"; // Import toast for notifications
import useAxiosPublic from "../../Hooks/useAxiosPublic"; // Custom Axios hook for API calls

// Image hosting API key and endpoint
const imgHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imgHostingApi = `https://api.imgbb.com/1/upload?key=${imgHostingKey}`;

const SignUp = () => {
  // State hooks for visibility toggles, navigation, and form data
  const [show, setShow] = useState(false); // Toggle visibility for password
  const [show1, setShow1] = useState(false); // Toggle visibility for confirm password
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const axiosPublic = useAxiosPublic(); // Axios instance for API requests
  const navigate = useNavigate(); // Hook for navigation
  const { signUpWithEmail, updateUser, logOut } = useAuth(); // Custom hook methods for authentication

  // Handle input changes and file uploads
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profileImage" ? files[0] : value, // Handle file input for profile image
    });
  };

  // Handle form submission for user sign-up
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const toastId = toast.loading("Signing Up..."); // Show loading toast
    const imageFile = { image: formData?.profileImage };

    try {
      // Upload profile image to external hosting
      const res = await axiosPublic.post(imgHostingApi, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      const photoURL = res.data.data.display_url; // Get uploaded image URL
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
          // Check password confirmation
          toast.error("Please confirm your password.", { id: toastId });
        } else {
          // Proceed with account creation
          signUpWithEmail(email, password)
            .then(() => {
              // Save user data to the backend
              fetch("https://coding-judge-server.vercel.app/users", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data?.result?.insertedId || data?.success) {
                    toast.success("Sign Up Successful.", { id: toastId });

                    // Update user profile
                    updateUser(formData.name, photoURL)
                      .then(() => {
                        toast.success("Profile Updated.", { id: toastId });
                      })
                      .catch((err) => {
                        toast.error(err.message, { id: toastId });
                      });

                    // Log out the user after successful sign-up
                    logOut().then(() => navigate("/login")).catch();
                  }
                });
            })
            .catch((err) => {
              toast.error(err.message, { id: toastId }); // Handle errors
            });
        }
      }
    } catch (error) {
      toast.error(error.message, { id: toastId }); // Handle image upload errors
    }
  };

  return (
    <div className="-mt-[68px] min-h-screen pt-24 xl:pt-28 px-4 pb-10">
      <div className="w-full max-w-sm p-6 m-auto mx-auto rounded border border-[#ABABAB]">
        {/* Form Header */}
        <div>
          <h2 className="text-lg font-bold text-white">Create An Account</h2>
        </div>

        {/* Sign-Up Form */}
        <form onSubmit={handleSignUp} className="mt-6">
          {/* Name Field */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
          />

          {/* Email Field */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
          />

          {/* Password Field */}
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
              {show ? <BsEyeSlash /> : <BsEye />}
            </div>
          </div>

          {/* Confirm Password Field */}
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
              {show1 ? <BsEyeSlash /> : <BsEye />}
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="mt-5 flex flex-col justify-center items-center gap-2 cursor-pointer">
            <input
              id="image"
              type="file"
              name="profileImage"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
              required
            />
            <label htmlFor="image" className="flex flex-col justify-center items-center gap-2 cursor-pointer text-white text-sm">
              <img className="w-6" src={addImage} alt="add profile photo" />
              <p>Upload Your Photo</p>
            </label>
            {formData.profileImage && (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="profile preview"
                style={{ maxWidth: "80px" }}
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button className="w-full px-6 py-2.5 font-medium tracking-wide rounded-sm bg-active-color text-black">
              Sign Up
            </button>
          </div>
        </form>

        {/* Navigation to Log In */}
        <p className="mt-8 font-light text-center text-gray-300">
          Already have an account?{" "}
          <Link to={"/logIn"} className="font-medium text-active-color hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp; // Export the SignUp component
