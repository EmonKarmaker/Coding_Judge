import { Navigate, useLocation } from "react-router-dom"; // Import React Router for navigation
import useAuth from "../Hooks/useAuth"; // Custom hook for authentication context
import Loading from "../Pages/Loading/Loading"; // Loading component to show while waiting
import PropTypes from "prop-types"; // Prop-types for type-checking
import { useEffect, useState } from "react"; // React hooks for state and effects

function AdminRoutes({ children }) {
  const location = useLocation(); // Get the current location (pathname)

  const { user, loading } = useAuth(); // Get user and loading state from the custom useAuth hook
  const [dbUser, setDbUser] = useState(null); // Local state to store user data from the database

  // Fetch user data from the server to check the user's role
  useEffect(() => {
    const getDbUser = async () => {
      // Fetch user data using the email stored in the `user` object
      const res = await fetch(`https://coding-judge-server.vercel.app/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data); // Update the local state with the fetched user data
    };

    // Only fetch the user data if the `user` object exists
    if (user) {
      getDbUser();
    }
  }, [user]); // Re-run this effect whenever the `user` state changes

  // Show the loading component if data is being loaded and user data is not available
  if (loading && !dbUser) {
    return <Loading></Loading>;
  }

  // If there is no authenticated user, redirect to the login page and retain the current location
  if (!user) {
    return <Navigate state={location?.pathname} to={"/login"}></Navigate>;
  }

  // If the user is an admin, render the children (the protected content)
  if (dbUser && dbUser?.role === "Admin") {
    return children;
  }

  // Optionally, if the user is not an admin, you can redirect or show an error (currently not handling this case)
}

export default AdminRoutes;

// Prop types to ensure that `children` is passed as a valid React node
AdminRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};
