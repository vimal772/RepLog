
import { createBrowserRouter } from "react-router";

import RootLayout from "../layouts/RootLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../components/Home";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";

// Add your other page imports here

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "workout",
            element: <h1>Workout Page</h1>,
          },
        ],
      },
    ],
  },
]);

export default router;
