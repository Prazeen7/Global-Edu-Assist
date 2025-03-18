import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from "./components/NavBar";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Destinations from "./Pages/Programs/Programs";
import Institutions from "./Pages/Institutions/Institutions";
import About from "./Pages/About/About";
import Agents from "./Pages/Agents/Agents";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Documents from "./Pages/Documents/Documents";
import InstitutionPage from './Pages/Institutions/InstitutionPage';
import Admin from './layouts/Admin/DashboardLayout';
import AdminAbout from './Pages/Admin/About';
import AdminAgents from './Pages/Admin/Agents';
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminDocuments from './Pages/Admin/Documents';
import AdminInstitutions from './Pages/Admin/Institutions';
import AdminLandingPage from './Pages/Admin/LandingPage';
import AdminSetting from './Pages/Admin/Settings';
import { AuthContext } from "./Context/context";
import Footer from './components/Footer';

function App() {
  // State for authentication context
  const [LoggedIn, setLoggedIn] = useState(false);
  const [UserAvatar, setUserAvatar] = useState('');
  const [UserType, setUserType] = useState('u');

  // Check for token in local storage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userAvatar = localStorage.getItem('userAvatar');
    const userType = localStorage.getItem('userType');

    if (token) {
      setLoggedIn(true); // Update the auth context if token exists
      setUserAvatar(userAvatar || ''); // Set UserAvatar from local storage
      setUserType(userType || 'u'); // Set UserType from local storage
    }
  }, []);

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
      path: "/programs",
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
    {
      path: "/institutionPage/:id",
      element: (
        <>
          <Navbar />
          <InstitutionPage />
          <Footer />
        </>
      ),
    },
    {
      path: "/admin",
      element: <Admin />, 
      children: [
        {
          index: true, 
          element: <AdminDashboard />,
        },
        {
          path: "dashboard", 
          element: <AdminDashboard />,
        },
        {
          path: "institutions", 
          element: <AdminInstitutions />,
        },
        {
          path: "documents", 
          element: <AdminDocuments />,
        },
        {
          path: "agents", 
          element: <AdminAgents />,
        },
        {
          path: "landingPage", 
          element: <AdminLandingPage />,
        },
        {
          path: "about",
          element: <AdminAbout />,
        },
        {
          path: "settings", 
          element: <AdminSetting />,
        },
      ],
    },
  ]);

  return (
    <AuthContext.Provider
      value={{
        LoggedIn,
        setLoggedIn,
        UserAvatar,
        setUserAvatar,
        UserType,
        setUserType,
      }}
    >
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthContext.Provider>
  );
}

export default App;