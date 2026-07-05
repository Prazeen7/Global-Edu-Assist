import { useState, useEffect, useContext } from "react"
import "./NavBar.css"
import Logo from "../images/Logo.png"
import hamBurger from "../images/ham.png"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../Context/context"
import AccountMenu from "./AccountMenu"
import ChatSystem from "./ChatSystem"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { LoggedIn } = useContext(AuthContext)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 960) {
                setIsMenuOpen(false)
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleLinkClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <nav className="navbar">
            <NavLink to="/" onClick={handleLinkClick}>
                <div className="logo-container">
                    <img src={Logo || "/placeholder.svg"} alt="Logo" className="logo" />
                    <span className="website-name">GEA</span>
                </div>
            </NavLink>

            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/institutions" onClick={handleLinkClick}>
                        Institutions
                    </NavLink>
                </li>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/programs" onClick={handleLinkClick}>
                        Programs
                    </NavLink>
                </li>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/documents" onClick={handleLinkClick}>
                        Documents
                    </NavLink>
                </li>
                {LoggedIn && (
                    <>
                        <li>
                            <NavLink
                                className={(e) => (e.isActive ? "activeColor" : "")}
                                to="/cost-estimation"
                                onClick={handleLinkClick}
                            >
                                Cost Estimation
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={(e) => (e.isActive ? "activeColor" : "")}
                                to="/progress-tracking"
                                onClick={handleLinkClick}
                            >
                                Progress Tracking
                            </NavLink>
                        </li>
                    </>
                )}
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/about" onClick={handleLinkClick}>
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/agents" onClick={handleLinkClick}>
                        Agents
                    </NavLink>
                </li>
                {!LoggedIn && (
                    <>
                        <li className="auth-link" onClick={handleLinkClick}>
                            <NavLink to="/login" className={(e) => (e.isActive ? "activeColor" : "")}>
                                Login
                            </NavLink>
                        </li>
                        <li className="auth-link" onClick={handleLinkClick}>
                            <NavLink to="/signup" className={(e) => (e.isActive ? "activeColor" : "")}>
                                Signup
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>

            {!LoggedIn && (
                <div className="auth-buttons">
                    <NavLink to="/login">
                        <button className="login-button">Login</button>
                    </NavLink>
                    <NavLink to="/signup">
                        <button className="signup-button">Signup</button>
                    </NavLink>
                </div>
            )}

            {LoggedIn && (
                <div className="nav-buttons">
                    <ChatSystem />
                    <AccountMenu />
                </div>
            )}

            <button className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
                <span className="hamburger-icon">
                    <img src={hamBurger || "/placeholder.svg"} alt="Menu" className="hamburger-icon" />
                </span>
            </button>
        </nav>
    )
}

export default Navbar
