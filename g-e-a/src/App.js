import "./App.css";
import Navbar from "./components/NavBar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Destinations from "./Pages/Destinations/Destinations";
import Institutions from "./Pages/Institutions/Institutions";
import About from "./Pages/About/About";
import Agents from "./Pages/Agents/Agents";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Documents from "./Pages/Documents/Documents";

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
