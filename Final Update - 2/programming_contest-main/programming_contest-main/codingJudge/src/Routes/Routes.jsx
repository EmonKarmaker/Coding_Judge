// Importing necessary modules for routing and components
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Home from "../Pages/Home/Home";
import LogIn from "../Pages/LogIn/LogIn";
import SignUp from "../Pages/SignUp/SignUp";
import PrivateRoutes from "./PrivateRoutes"; // Protects routes requiring authentication
import CreateContest from "../Pages/CreateContest/CreateContest"; // Admin route to create contests
import AdminRoutes from "./AdminRoutes"; // Protects admin-specific routes
import CreateQuestion from "../Pages/CreateQuestion/CreateQuestion"; // Admin route to create questions
import Contests from "../Pages/Contests/Contests"; // Public page displaying contests
import ContestDetails from "../Pages/ContestDetails/ContestDetails"; // Public page showing contest details
import ContestPaper from "../Pages/ContestPaper/ContestPaper"; // Public page showing contest paper
import SubmittedContests from "../Pages/SubmittedContests/SubmittedContests"; // Page for submitted contests
import AllSubmittedContests from "../Pages/AllSubmittedContests/AllSubmittedContests"; // Admin route for all submitted contests
import SubmittedContestDetailsForUser from "../Pages/SubmittedContestDetailsForUser/SubmittedContestDetailsForUser"; // Details of user's submitted contest
import SubmittedContestsDetails from "../Pages/SubmittedContestsDetails/SubmittedContestsDetails"; // Admin view of submitted contest details
import Leaderboard from "../Pages/Leaderboard/Leaderboard"; // Page showing leaderboard
import Emergency from "../Pages/Emergency/Emergency"; // Admin notifications/emergency page

// Define the routes and their respective components
const Routes = createBrowserRouter([
  {
    // The root path with MainLayout wrapping all child routes
    path: "/",
    element: <MainLayout></MainLayout>, // Layout wrapper for the main content
    errorElement: <ErrorPage></ErrorPage>, // Fallback component for unmatched routes
    children: [
      {
        index: true, // Default route at the root
        element: <Home></Home>, // Main home page
      },
      {
        path: "contests", // Path for the contests page
        element: <Contests />,
      },
      {
        // Admin route for creating contests, wrapped with AdminRoutes for access control
        path: "createContest",
        element: (
          <AdminRoutes>
            <CreateContest />
          </AdminRoutes>
        ),
      },
      {
        // Admin route for creating questions
        path: "createQuestion",
        element: (
          <AdminRoutes>
            <CreateQuestion />
          </AdminRoutes>
        ),
      },
      {
        // Contest details page, wrapped in PrivateRoutes to ensure the user is authenticated
        path: "contestDetails/:id",
        element: (
          <PrivateRoutes>
            <ContestDetails />
          </PrivateRoutes>
        ),
      },
      {
        // Contest paper page, wrapped in PrivateRoutes to ensure the user is authenticated
        path: "contestPaper/:id",
        element: (
          <PrivateRoutes>
            <ContestPaper />
          </PrivateRoutes>
        ),
      },
      {
        // Page showing all submitted contests, requires authentication
        path: "submittedContests",
        element: (
          <PrivateRoutes>
            <SubmittedContests />
          </PrivateRoutes>
        ),
      },
      {
        // Submitted contest details for a user, requires authentication
        path: "submittedContestDetailsForUser/:id",
        element: (
          <PrivateRoutes>
            <SubmittedContestDetailsForUser />
          </PrivateRoutes>
        ),
      },
      {
        // Admin route to see all submitted contests
        path: "allSubmittedContests",
        element: (
          <AdminRoutes>
            <AllSubmittedContests />
          </AdminRoutes>
        ),
      },
      {
        // Admin route to see details of a submitted contest
        path: "submittedContestDetails/:id",
        element: (
          <AdminRoutes>
            <SubmittedContestsDetails />
          </AdminRoutes>
        ),
      },
      {
        // Admin notifications or emergency page
        path: "notifications",
        element: (
          <AdminRoutes>
            <Emergency />
          </AdminRoutes>
        ),
      },
      {
        // Leaderboard page, wrapped in PrivateRoutes for authentication
        path: "leaderboard",
        element: (
          <PrivateRoutes>
            <Leaderboard />
          </PrivateRoutes>
        ),
      },
      {
        // Leaderboard page for a specific contest, wrapped in PrivateRoutes for authentication
        path: "leaderboard/:id",
        element: (
          <PrivateRoutes>
            <Leaderboard />
          </PrivateRoutes>
        ),
      },
      {
        // Login page for users who are not logged in
        path: "logIn",
        element: <LogIn></LogIn>,
      },
      {
        // Signup page for users who are not registered
        path: "signUp",
        element: <SignUp></SignUp>,
      },
    ],
  },
]);

export default Routes;
