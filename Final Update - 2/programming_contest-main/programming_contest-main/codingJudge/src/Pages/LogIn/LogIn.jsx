import { Link, useLocation, useNavigate } from "react-router-dom"; // Import navigation hooks
import { BsEye, BsEyeSlash } from "react-icons/bs"; // Import icons for password visibility toggle
import { useState } from "react"; // Import React's useState hook for state management
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication
import toast from "react-hot-toast"; // Import toast for notifications
import useAxiosPublic from "../../Hooks/useAxiosPublic"; // Custom hook for Axios instance

const LogIn = () => {
  const [show, setShow] = useState(false); // State to toggle password visibility

  const { signIn, googleSignIn } = useAuth(); // Get authentication methods from the custom hook
  const axiosPublic = useAxiosPublic(); // Axios instance for public API calls
  const location = useLocation(); // Access location object for navigation
  const navigate = useNavigate(); // Navigation function

  // Handle form-based login
  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const form = e.target; // Access the form element
    const email = form.email.value; // Get email value from the form
    const password = form.password.value; // Get password value from the form
    form.reset(); // Reset the form fields

    const toastId = toast.loading("Logging In..."); // Display loading toast

    signIn(email, password) // Call the signIn method with email and password
      .then(() => {
        toast.success("Login Successful.", { id: toastId }); // Display success toast
        navigate(location?.state ? location.state : "/"); // Navigate to the target or home page
      })
      .catch((err) => {
        toast.error(err.message, { id: toastId }); // Display error toast
      });
  };

  // Handle Google-based login
  const googleLogin = () => {
    googleSignIn()
      .then(async (result) => {
        if (result?.user) {
          const userData = {
            name: result?.user?.displayName,
            email: result?.user?.email,
            password: null,
            photo_url: result?.user?.photoURL,
            role: "User",
          };
          const res = await axiosPublic.post("/users", userData); // Save user data to the backend
          if (res?.data?.result?.insertedId || res?.data?.success) {
            toast.success("Google Log In Success."); // Display success toast
            navigate(location?.state ? location.state : "/"); // Navigate to the target or home page
          }
        }
      })
      .catch((err) => {
        toast.error(err.message); // Display error toast
      });
  };

  return (
    <div className="-mt-[68px] min-h-screen pt-20 xl:pt-28 px-4 pb-10">
      <div className="w-full max-w-sm p-6 m-auto mx-auto rounded border border-[#ABABAB] my-10">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-white">Log In</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="mt-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="mt-4 relative">
            <input
              type={show ? "text" : "password"} // Toggle password visibility
              name="password"
              placeholder="Password"
              required
              className="block w-full text-sm placeholder:text-white text-white py-2 mt-2 bg-transparent border-b border-[#ABABAB] focus:outline-none focus:bg-transparent"
            />
            {/* Toggle Password Visibility */}
            <div
              className="absolute right-2 top-3 inline-block cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <BsEyeSlash /> : <BsEye />}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button className="w-full px-6 py-2.5 font-medium tracking-wide rounded-sm bg-active-color text-black">
              Sign In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-8 font-light text-center text-gray-300">
          Don&#39;t have an account?{" "}
          <Link
            to={"/signUp"}
            className="font-medium text-active-color hover:underline"
          >
            Create One
          </Link>
        </p>
      </div>

      {/* Social Media Login */}
      <div className="max-w-sm mx-auto text-gray-300">
        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b border-[#ABABAB]"></span>

          <a href="#" className="text-sm text-center uppercase hover:underline">
            or login with Social Media
          </a>

          <span className="w-1/5 border-b border-[#ABABAB]"></span>
        </div>

        {/* Google Login Button */}
        <div className="flex items-center mt-6 -mx-2">
          <button
            onClick={googleLogin}
            type="button"
            className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium border border-[#ABABAB] rounded-sm focus:outline-none"
          >
            <svg className="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
            </svg>
            <span className="hidden mx-2 sm:inline">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn; // Export the component
