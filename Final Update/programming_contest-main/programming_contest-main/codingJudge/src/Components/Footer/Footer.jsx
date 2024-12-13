import { Link } from "react-router-dom"; // Importing Link component for navigation in React Router
import logo from "../../../public/favicon.png"; // Importing logo image from public folder
import useAuth from "../../Hooks/useAuth"; // Custom hook to manage authentication state
import { useEffect, useState } from "react"; // Importing React hooks (useState, useEffect)

const Footer = () => {
  // Extracting user information from custom authentication hook
  const { user } = useAuth();

  // State to store user data fetched from the backend
  const [dbUser, setDbUser] = useState(null);

  // Fetch user data based on email when the component is mounted or user changes
  useEffect(() => {
    const getDbUser = async () => {
      // Fetch user details from the backend using the email
      const res = await fetch(`https://coding-judge-server.vercel.app/users/${user?.email}`);
      const data = await res.json(); // Parsing the response JSON
      setDbUser(data); // Storing fetched user data in the state
    };
    getDbUser(); // Calling the async function to fetch user data
  }, [user]); // Dependency on 'user' to refetch data if the user changes

  // Defining the navigation items for different roles and conditions
  const navItems = (
    <>
      <Link className="link link-hover hover:text-active-color" to={"/"}>Home</Link>
      <Link className="link link-hover hover:text-active-color" to={"/contests"}>Contests</Link>

      {/* Conditionally render the 'Submitted Contests' link for 'User' role */}
      {user && dbUser?.role === "User" && (
        <Link className="link link-hover hover:text-active-color" to={"/submittedContests"}>
          Submitted Contests
        </Link>
      )}

      {/* Conditionally render 'Create Contest' and 'Submitted Contests' links for 'Admin' role */}
      {user && dbUser?.role === "Admin" && (
        <Link className="link link-hover hover:text-active-color" to={"/createContest"}>
          Create Contest
        </Link>
      )}
      {user && dbUser?.role === "Admin" && (
        <Link className="link link-hover hover:text-active-color" to={"/allSubmittedContests"}>
          Submitted Contests
        </Link>
      )}

      {/* Always show 'Leaderboard' link for authenticated users */}
      {user && (
        <Link className="link link-hover hover:text-active-color" to={"/leaderboard"}>
          Leaderboard
        </Link>
      )}
    </>
  );

  return (
    <div className="bg-white">
      <footer className="footer footer-center pt-10 text-base-content rounded bg-secondary-color">
        <div className="w-full flex justify-between max-w-screen-lg px-4 xl:px-0 xl:mx-auto border-b border-[#FFFFFF19] pb-10">
          <div className="flex justify-center items-center gap-2">
            <img className="w-10" src={logo} alt="Logo" /> {/* Logo image */}
            <span className="text-xl font-bold text-active-color">Coding Judge</span>
          </div>
          <nav>
            <div className="grid grid-flow-col gap-8">
              {/* Social media icons for platforms like Twitter, Facebook, and YouTube */}
              <a>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current cursor-pointer text-active-color">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current cursor-pointer text-active-color">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current cursor-pointer text-active-color">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
          </nav>
        </div>

        {/* Navigation items in the footer */}
        <nav className="flex justify-center items-center flex-wrap gap-8 text-white px-4 text-base">
          {navItems} {/* Render the navigation links dynamically based on the user's role */}
        </nav>

        {/* Footer copyright section */}
        <aside className="bg-secondary-color w-full h-20">
          <p className="text-white">
            Copyright © 2023 - All right reserved by{" "}
            <span className="text-active-color font-semibold">Coding Judge</span> Ltd
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer; // Exporting the Footer component for use in other parts of the app
