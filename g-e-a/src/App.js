"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Navbar from "./components/NavBar"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LandingPage from "./Pages/LandingPage/LandingPage"
import Destinations from "./Pages/Programs/Programs"
import Institutions from "./Pages/Institutions/Institutions"
import About from "./Pages/About/About"
import Agents from "./Pages/Agents/Agents"
import Login from "./Pages/Login/Login"
import Signup from "./Pages/Signup/Signup"
import Documents from "./Pages/Documents/Documents"
import InstitutionPage from "./Pages/Institutions/InstitutionPage"
import Estimation from "./components/Estimation"
import ProgressTracking from "./components/ProgressTracking"
import Admin from "./layouts/Admin/DashboardLayout"
import AdminAgents from "./Pages/Admin/Agents"
import AdminLogin from "./Pages/Admin/Login"
import AdminDashboard from "./Pages/Admin/Dashboard"
import AdminDocuments from "./Pages/Admin/Documents"
import AdminInstitutions from "./Pages/Admin/Institutions"
import AdminInstitutionsPage from "./Pages/Admin/InstitutionPage"
import ManageAdmins from "./Pages/Admin/ManageAdmins"
import { AuthContext } from "./Context/context"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProctectedRoute/ProtectedRoute"
import AuthRoute from "./components/ProctectedRoute/AuthRoute"
import Verify from "./components/verify"
import { validateToken, isTokenExpired } from "./utils/utils"
import Profile from "./Pages/profile"
import AgentRegistration from "./Pages/Agents/Registration/Registration"
import AgentLogin from "./Pages/Agents/Login/Login"
import AgentDashboard from "./Pages/Agents/Dashboard/Dashboard"

function App() {
    const [LoggedIn, setLoggedIn] = useState(false)
    const [UserAvatar, setUserAvatar] = useState("")
    const [UserType, setUserType] = useState("u")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userAvatar = localStorage.getItem("userAvatar")
        const userType = localStorage.getItem("userType")

        if (token) {
            const { isValid } = validateToken(token)
            const expired = isTokenExpired(token)

            if (isValid && !expired) {
                setLoggedIn(true)
                setUserAvatar(userAvatar || "")
                setUserType(userType || "u")
            } else {
                // Clear invalid/expired token
                localStorage.removeItem("token")
                localStorage.removeItem("userAvatar")
                localStorage.removeItem("userType")
                setLoggedIn(false)
            }
        }
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

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
            path: "/profile",
            element: (
                <>
                    <Navbar />
                    <Profile />
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
            path: "/cost-estimation",
            element: (
                <ProtectedRoute>
                    <Navbar />
                    <Estimation />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/progress-tracking",
            element: (
                <ProtectedRoute>
                    <Navbar />
                    <ProgressTracking />
                    <Footer />
                </ProtectedRoute>
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
                <AuthRoute>
                    <Navbar />
                    <Login />
                </AuthRoute>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthRoute>
                    <Navbar />
                    <Signup />
                </AuthRoute>
            ),
        },
        {
            path: "/verify-email",
            element: (
                <AuthRoute>
                    <Navbar />
                    <Verify />
                </AuthRoute>
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
            path: "/agent-registration",
            element: (
                <>
                    <Navbar />
                    <AgentRegistration />
                </>
            ),
        },
        {
            path: "/agent-login",
            element: (
                <>
                    <Navbar />
                    <AgentLogin />
                </>
            ),
        },
        {
            path: "/agent-dashboard",
            element: <AgentDashboard />,
        },

        {
            path: "/admin",
            element: <AdminLogin />,
        },
        {
            path: "/admin/*",
            element: (
                <ProtectedRoute isAdminRoute>
                    <Admin />
                </ProtectedRoute>
            ),
            children: [
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
                    path: "institutionPage/:id",
                    element: <AdminInstitutionsPage />,
                },
                {
                    path: "manage-admins",
                    element: <ManageAdmins />,
                },
            ],
        },
    ])

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
    )
}

export default App
