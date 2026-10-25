import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import RootLayout from '../layouts/RootLayout';

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
    ]
  },
]);

export default router;
