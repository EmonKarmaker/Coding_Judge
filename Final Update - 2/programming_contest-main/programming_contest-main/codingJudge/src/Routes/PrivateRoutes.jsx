import PropTypes from "prop-types"; // Importing PropTypes for type checking of props
import { Navigate, useLocation } from "react-router-dom"; // Import React Router functions for navigation
import Loading from "../Pages/Loading/Loading"; // Import the Loading component to show while data is loading
import useAuth from "../Hooks/useAuth"; // Import the custom useAuth hook to access user authentication data

const PrivateRoutes = ({ children }) => {
  const location = useLocation(); // Get the current location (pathname) to redirect after login

  const { user, loading } = useAuth(); // Destructure user and loading from the useAuth hook

  // If the authentication data is loading, show the loading component
  if (loading) {
    return <Loading></Loading>;
  }

  // If the user is authenticated (user exists), render the children (protected content)
  if (user) {
    return children;
  }

  // If no user is authenticated, redirect them to the login page and pass the current location (path)
  return <Navigate state={location?.pathname} to={"/login"}></Navigate>;
};

export default PrivateRoutes; // Export the PrivateRoutes component

// Prop types validation to ensure that children is a valid React node
PrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};
