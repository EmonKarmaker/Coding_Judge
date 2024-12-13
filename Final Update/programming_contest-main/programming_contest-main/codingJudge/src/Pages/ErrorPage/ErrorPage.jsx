// Import necessary dependencies
import { NavLink, useRouteError } from "react-router-dom"; // NavLink for navigation and useRouteError to get the error details

const ErrorPage = () => {
  // Retrieve the error object using the useRouteError hook
  const error = useRouteError();

  // Log the stack trace of the error to the console for debugging purposes
  console.log(error.error.stack);

  return (
    <div className="min-h-screen">
      {/* Center the error message on the page */}
      <div className="min-h-screen text-center flex flex-col justify-center items-center gap-4">
        {/* Display the error status and status text */}
        <h2 className="text-4xl font-bold">
          <span className="text-[#FF444A]">{error.status}</span> ||{" "}
          <span className="text-[#FF444A]">Page {error.statusText}</span>
        </h2>

        {/* Display additional error data if available */}
        <p className="text-2xl font-medium">{error.data}</p>

        {/* Link to navigate back to the homepage */}
        <NavLink to={"/"}>
          <button className="bg-active-color text-black font-semibold px-6 py-2 rounded hover:scale-105 duration-500">
            Go Home
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default ErrorPage;
