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
import { AuthContext } from "./Context/context";
import { useState } from "react";

function App() {
  // Create routes using React Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <LandingPage />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <Navbar />
          <About />
        </>
      ),
    },
    {
      path: "/institutions",
      element: (
        <>
          <Navbar />
          <Institutions />
        </>
      ),
    },
    {
      path: "/destination",
      element: (
        <>
          <Navbar />
          <Destinations />
        </>
      ),
    },
    {
      path: "/documents",
      element: (
        <>
          <Navbar />
          <Documents />
        </>
      ),
    },
    {
      path: "/agents",
      element: (
        <>
          <Navbar />
          <Agents />
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          <Navbar />
          <Signup />
        </>
      ),
    },
  ]);

  // State for authentication context
  const [LoggedIn, setLoggedIn] = useState(false);
  const [UserAvatar, setUserAvatar] = useState('');

  return (
    <AuthContext.Provider value={{ LoggedIn, setLoggedIn, UserAvatar, setUserAvatar}}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
