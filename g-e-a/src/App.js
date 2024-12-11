import "./App.css";
import Navbar from "./components/LandingPage/NavBar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Destinations from "./components/LandingPage/Destinations";
import Institutions from "./components/LandingPage/Institutions";
import About from "./components/LandingPage/About";
import Agents from "./components/LandingPage/Agents";
import Login from "./components/LandingPage/Login";
import Signup from "./components/LandingPage/Signup";
import Documents from "./components/LandingPage/Documents";

function App() {
  // Creating react router for dynamic navigation from Navbar
  const router = createBrowserRouter([
    {
      path: "/",
      element: <> <Navbar /> <LandingPage /></>
    },

    {
      path: "/about",
      element: <><Navbar /><About /></>
    },

    {
      path: "/institutions",
      element: <><Navbar /><Institutions /></>
    },

    {
      path: "/destination",
      element: <><Navbar /><Destinations /></>
    },

    {
      path: "/documents",
      element: <><Navbar /><Documents /></>
    },

    {
      path: "/agents",
      element: <><Navbar /><Agents /></>
    },

    {
      path: "/login",
      element: <><Navbar /><Login /></>
    },

    {
      path: "/signup",
      element: <><Navbar /><Signup /></>
    }

  ])

  return (
    <div className="App">
      {/* Router Configure */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
