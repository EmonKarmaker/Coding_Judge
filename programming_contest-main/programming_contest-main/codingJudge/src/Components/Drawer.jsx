import { Link } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { useEffect, useState } from "react";

const Drawer = () => {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const getDbUser = async () => {
      const res = await fetch(`http://localhost:5000/users/${user?.email}`);
      const data = await res.json();
      setDbUser(data);
    };
    getDbUser();
  }, [user]);

  const navItems = (
    <>
      <li>
        <Link to={"/"}>Home</Link>
      </li>
      <li>
        <Link to={"/contests"}>Contests</Link>
      </li>
      {user && dbUser?.role === "User" && (
        <li>
          <Link to={"/submittedContests"}>Submitted Contests</Link>
        </li>
      )}
      {/* {user && dbUser?.role === "User" && (
        <li>
          <Link to={"/participating"}>Participating</Link>
        </li>
      )} */}
      {user && dbUser?.role === "Admin" && (
        <li>
          <Link to={"/createContest"}>Create Contest</Link>
        </li>
      )}
      {user && dbUser?.role === "Admin" && (
        <li>
          <Link to={"/allSubmittedContests"}>Submitted Contests</Link>
        </li>
      )}
    </>
  );
  return (
    <div className="drawer-side z-50">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu p-4 w-80 min-h-full bg-base-200">
        {/* Sidebar content here */}
        {navItems}
      </ul>
    </div>
  );
};

export default Drawer;
