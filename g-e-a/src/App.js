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

import Footer from './components/Footer';

function App() {
  // Create routes using React Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <LandingPage />

          <Footer />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <Navbar />
          <About />

          <Footer />
        </>
      ),
    },
    {
      path: "/institutions",
      element: (
        <>
          <Navbar />
          <Institutions />

          <Footer />
        </>
      ),
    },
    {
      path: "/destination",
      element: (
        <>
          <Navbar />
          <Destinations />

          <Footer />
        </>
      ),
    },
    {
      path: "/documents",
      element: (
        <>
          <Navbar />
          <Documents />

          <Footer />
        </>
      ),
    },
    {
      path: "/agents",
      element: (
        <>
          <Navbar />
          <Agents />

          <Footer />
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

  const [UserType, setUserType] = useState('u');

  return (
    <AuthContext.Provider value={{ LoggedIn, setLoggedIn, UserAvatar, setUserAvatar, UserType, setUserType}}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
