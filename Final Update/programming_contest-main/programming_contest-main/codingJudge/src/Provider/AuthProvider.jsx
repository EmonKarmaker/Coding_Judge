import { createContext, useEffect, useState } from "react"; // Import React hooks
import PropTypes from "prop-types"; // Prop-types for type-checking
import {
  GoogleAuthProvider, // Google OAuth provider
  createUserWithEmailAndPassword, // Firebase method to create users
  onAuthStateChanged, // Firebase method to observe auth state changes
  signInWithEmailAndPassword, // Firebase method for email/password sign-in
  signInWithPopup, // Firebase method for third-party pop-up sign-in
  signOut, // Firebase method to sign out
  updateProfile, // Firebase method to update user profile
} from "firebase/auth"; 
import { auth } from "../Config/firebase/firebase.config"; // Firebase configuration
import axios from "axios"; // Axios for API requests

// Create a context for authentication
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store current user info
  const [loading, setLoading] = useState(true); // Loading state during async operations

  const googleProvider = new GoogleAuthProvider(); // Initialize Google Auth provider

  // Sign up using email and password
  const signUpWithEmail = (email, password) => {
    setLoading(true); // Set loading while processing
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update the user's display name and profile picture
  const updateUser = (name, userPhotoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: userPhotoURL,
    });
  };

  // Sign in using email and password
  const signIn = (email, password) => {
    setLoading(true); // Set loading while processing
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in using Google pop-up
  const googleSignIn = () => {
    setLoading(true); // Set loading while processing
    return signInWithPopup(auth, googleProvider);
  };

  // Log out the current user
  const logOut = () => {
    setLoading(true); // Set loading while processing
    return signOut(auth);
  };

  // Monitor authentication state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userEmail = currentUser?.email || user?.email; // Get email of the current user or previously stored email
      setUser(currentUser); // Update the user state
      setLoading(false); // Stop loading

      const loggedInUser = { email: userEmail }; // Prepare payload for API requests

      // If a user is logged in, get a JWT token
      if (currentUser) {
        axios
          .post("https://coding-judge-server.vercel.app/jwt", loggedInUser, {
            withCredentials: true, // Include cookies with requests
          })
          .then((res) => {
            console.log(res.data); // Log the response
          })
          .catch((err) => {
            console.log(err); // Log errors
          });
      } else {
        // If no user is logged in, inform the server
        axios
          .post("https://coding-judge-server.vercel.app/logout", loggedInUser, {
            withCredentials: true, // Include cookies with requests
          })
          .then((res) => {
            console.log(res.data); // Log the response
          })
          .catch((err) => {
            console.log(err); // Log errors
          });
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unSubscribe();
  }, [user]); // Re-run the effect when the user state changes

  // Provide all authentication data and methods to child components
  const authData = {
    user, // Current user
    loading, // Loading state
    setLoading, // Method to update the loading state
    signUpWithEmail, // Sign-up method
    updateUser, // Update user profile
    signIn, // Sign-in method
    googleSignIn, // Google sign-in method
    logOut, // Log-out method
  };

  return (
    <AuthContext.Provider value={authData}>
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Type-checking for props
AuthProvider.propTypes = {
  children: PropTypes.node, // `children` must be a valid React node
};
