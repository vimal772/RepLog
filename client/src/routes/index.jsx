import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import RootLayout from '../layouts/RootLayout';
import Login from '../components/Login';
import Signup from "../components/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/test",
        element: <h1>In Test Route</h1>,
      },
      {
        path: "/login",
        element: <Login />,
      },{
        path: "/signup",
        element: <Signup />,
      },
    ]
  },
]);

export default router;
