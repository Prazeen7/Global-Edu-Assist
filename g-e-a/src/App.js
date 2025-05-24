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
import { verifyTokenWithServer } from "./utils/authService"
import Profile from "./Pages/profile"
import AgentRegistration from "./Pages/Agents/Registration/Registration"
import AgentLogin from "./Pages/Agents/Login/Login"
import AgentDashboard from "./Pages/Agents/Dashboard/Dashboard"
import AgentResubmit from "./Pages/Agents/Resubmit"

function App() {
    const [LoggedIn, setLoggedIn] = useState(false)
    const [UserAvatar, setUserAvatar] = useState("")
    const [UserType, setUserType] = useState("u") // Default to user
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const verifyUserAuthentication = async () => {
            try {
                // Get the token verification result from the server
                const result = await verifyTokenWithServer();

                if (result.isValid) {
                    // Token is valid according to the server
                    const { userType, userData } = result;

                    // Update state with user information
                    setLoggedIn(true);
                    setUserType(userType);
                    setUserData(userData);

                    // Get avatar from localStorage or use default
                    const userAvatar = localStorage.getItem("userAvatar") || "";
                    setUserAvatar(userAvatar);

                    // Update localStorage with the correct user type from server
                    localStorage.setItem("userType", userType);

                    console.log(`User authenticated as: ${userType}`);
                } else {
                    // Token is invalid or verification failed
                    console.error("Authentication failed:", result.error);

                    // Clear any stored auth data
                    localStorage.removeItem("token");
                    localStorage.removeItem("userAvatar");
                    localStorage.removeItem("userType");

                    setLoggedIn(false);
                    setUserType("u"); // Reset to default
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error during authentication:", error);
                setLoggedIn(false);
                setUserType("u"); // Reset to default
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifyUserAuthentication();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Create routes using React Router
    const router = createBrowserRouter([
        // Routes only for regular users and unauthenticated visitors
        {
            path: "/",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <LandingPage />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/about",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <About />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/institutions",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <Institutions />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/programs",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <Destinations />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/documents",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <Documents />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/agents",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <Agents />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/institutionPage/:id",
            element: (
                <ProtectedRoute allowUnauthenticated allowUserOnly>
                    <Navbar />
                    <InstitutionPage />
                    <Footer />
                </ProtectedRoute>
            ),
        },

        // Authentication Routes - Accessible to unauthenticated visitors
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

        // User-only Routes
        {
            path: "/profile",
            element: (
                <ProtectedRoute isUserRoute>
                    <Navbar />
                    <Profile />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/cost-estimation",
            element: (
                <ProtectedRoute isUserRoute>
                    <Navbar />
                    <Estimation />
                    <Footer />
                </ProtectedRoute>
            ),
        },
        {
            path: "/progress-tracking",
            element: (
                <ProtectedRoute isUserRoute>
                    <Navbar />
                    <ProgressTracking />
                    <Footer />
                </ProtectedRoute>
            ),
        },

        // Agent-only Routes
        {
            path: "/agent-registration",
            element: (
                <AuthRoute>
                    <Navbar />
                    <AgentRegistration />
                </AuthRoute>
            ),
        },
        {
            path: "/agent-login",
            element: (
                <AuthRoute>
                    <Navbar />
                    <AgentLogin />
                </AuthRoute>
            ),
        },
        {
            path: "/agent-dashboard",
            element: (
                <ProtectedRoute isAgentRoute>
                    <AgentDashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: "/agent-resubmit/:id",
            element: (
                    <><Navbar />
                    <AgentResubmit />
                    <Footer /></>

            ),
        },

        // Admin-only Routes
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
                userData,
                setUserData
            }}
        >
            <div className="App">
                <RouterProvider router={router} />
            </div>
        </AuthContext.Provider>
    );
}

export default App;