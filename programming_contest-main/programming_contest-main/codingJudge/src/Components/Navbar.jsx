import { Link, NavLink } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-toastify";
import defaultUser from "./../../public/user.png";
import logo from "./../../public/favicon.png";
import "./navbar.css";
import Container from "./../Layout/Container";
import { useEffect } from "react";
import { useState } from "react";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const getDbUser = async () => {
      const res = await fetch(`http://localhost:5000/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data);
    };
    if (user) {
      getDbUser();
    }
  }, [user]);

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("SignOut Successful.");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const navItems = (
    <>
      <li>
        <NavLink to={"/"}>Home</NavLink>
      </li>
      <li>
        <NavLink to={"/contests"}>Contests</NavLink>
      </li>
      {/* {user && dbUser?.role === "User" && (
        <li>
          <NavLink to={"/participating"}>Participating</NavLink>
        </li>
      )} */}
      {user && dbUser?.role === "User" && (
        <li>
          <NavLink to={"/submittedContests"}>Submitted Contests</NavLink>
        </li>
      )}
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
      {user && (
        <li>
          <NavLink to={"/leaderBoard"}>Leaderboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="z-50 sticky top-0 bg-secondary-color">
      <Container>
        <div className="w-full navbar px-0">
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
          <div className="flex-1 flex items-center gap-2">
            <img className="w-10" src={logo} alt="Logo" />
            <span className="text-xl font-bold text-active-color">
              Coding Judge
            </span>
          </div>
          <div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                {navItems}
              </ul>
            </div>
            <div>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="dropdown dropdown-end">
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
                      <li className="text-base font-medium">
                        <p>
                          {dbUser?.name}
                          <span className="text-sm font-normal">
                            ({dbUser?.role})
                          </span>
                        </p>
                      </li>
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
                  <Link
                    to={"/logIn"}
                    className={
                      "text-white btn normal-case btn-sm px-6 hover:bg-active-color hover:text-black duration-500 font-medium border-none"
                    }
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

export default Navbar;
