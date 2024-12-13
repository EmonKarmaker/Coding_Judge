import { Link, NavLink } from "react-router-dom"; // Importing React Router components for navigation
import useAuth from "../Hooks/useAuth"; // Importing a custom hook to manage authentication
import { toast } from "react-toastify"; // Importing toast for displaying notifications
import defaultUser from "/user.png"; // Default user image if the user has no profile picture
import logo from "/favicon.png"; // Importing the site's logo
import "./navbar.css"; // Importing custom CSS for navbar styling
import Container from "./../Layout/Container"; // Importing a Container component for layout
import { useEffect, useState } from "react"; // Importing hooks for managing state and side effects
import { ImNotification } from "react-icons/im"; // Importing the notification icon

const Navbar = () => {
  // Destructuring the `user` and `logOut` from the useAuth hook
  const { user, logOut } = useAuth();
  const [dbUser, setDbUser] = useState(null); // State for storing the user's details from the database

  // Fetch user data from the server once the user is authenticated
  useEffect(() => {
    const getDbUser = async () => {
      const res = await fetch(`https://coding-judge-server.vercel.app/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data); // Setting the user data in the state
    };
    if (user) {
      getDbUser(); // Fetch the user data when the user is available
    }
  }, [user]);

  // Handle user logout
  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("SignOut Successful."); // Show success toast on logout
      })
      .catch((err) => {
        toast.error(err.message); // Show error toast if logout fails
      });
  };

  // Navbar items depending on the user role
  const navItems = (
    <>
      <li>
        <NavLink to={"/"}>Home</NavLink>
      </li>
      <li>
        <NavLink to={"/contests"}>Contests</NavLink>
      </li>
      {/* Render "Submitted Contests" if the user is authenticated and is of "User" role */}
      {user && dbUser?.role === "User" && (
        <li>
          <NavLink to={"/submittedContests"}>Submitted Contests</NavLink>
        </li>
      )}
      {/* Render "Create Contest" and "Submitted Contests" for Admin users */}
      {user && dbUser?.role === "Admin" && (
        <li>
          <NavLink to={"/createContest"}>Create Contest</NavLink>
        </li>
      )}
      {user && dbUser?.role === "Admin" && (
        <li>
          <NavLink to={"/allSubmittedContests"}>Submitted Contests</NavLink>
        </li>
      )}
      {/* Render "Leaderboard" for Users */}
      {user && dbUser?.role === "User" && (
        <li>
          <NavLink to={"/leaderboard"}>Leaderboard</NavLink>
        </li>
      )}
      {/* Render notification icon for Admin users */}
      {user && dbUser?.role === "Admin" && (
        <li>
          <NavLink to={"/notifications"}>
            <ImNotification className="text-lg" />
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="z-50 sticky top-0 bg-secondary-color"> {/* Navbar container */}
      <Container>
        <div className="w-full navbar px-0">
          {/* Hamburger menu for mobile */}
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          {/* Logo and title */}
          <div className="flex-1 flex items-center gap-2">
            <img className="w-10" src={logo} alt="Logo" />
            <span className="text-xl font-bold text-active-color">
              Coding Judge
            </span>
          </div>
          {/* Navbar items (horizontal on large screens) */}
          <div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal items-center">
                {/* Render navigation items */}
                {navItems}
              </ul>
            </div>
            <div>
              {/* User section (either display user profile or login button) */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="dropdown dropdown-end">
                    {/* Avatar dropdown for logged-in user */}
                    <div className="flex justify-center items-center gap-2">
                      <label
                        tabIndex={0}
                        className="btn btn-ghost btn-circle avatar"
                      >
                        <div className="w-10 rounded-full">
                          <img
                            title={user?.displayName}
                            src={user?.photoURL ? user.photoURL : defaultUser}
                            alt="User"
                          />
                        </div>
                      </label>
                    </div>
                    <ul
                      tabIndex={0}
                      className="mt-2 z-50 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                    >
                      {/* Display the user name and role */}
                      <li className="text-base font-medium">
                        <p>
                          {dbUser?.name}
                          <span className="text-sm font-normal">
                            ({dbUser?.role})
                          </span>
                        </p>
                      </li>
                      {/* Logout option */}
                      <li>
                        <button className="mt-1" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {/* Display login button if user is not authenticated */}
                  <Link
                    to={"/logIn"}
                    className="text-white btn normal-case btn-sm px-6 hover:bg-active-color hover:text-black duration-500 font-medium border-none"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar; // Export the Navbar component for use in other parts of the app
