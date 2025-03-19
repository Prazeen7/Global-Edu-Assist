import React, { useState, useEffect, useContext } from "react";
import "./NavBar.css";
import Logo from "../images/Logo.png";
import hamBurger from "../images/ham.png";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/context";
import SearchBar from "./SearchBar";
import AccountMenu from "./AccountMenu";
import Chats from "./Chats";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { LoggedIn } = useContext(AuthContext);

    // Toggle the menu state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close the menu when the screen is resized (when width > 960px)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 960) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Close the menu when a link is clicked
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            {/* Logo and Website Name */}
            <NavLink to="/" onClick={handleLinkClick}>
                <div className="logo-container">
                    <img src={Logo} alt="Logo" className="logo" />
                    <span className="website-name">GEA</span>
                </div>
            </NavLink>

            {/* Navigation Links */}
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                {/* Institutions */}
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/institutions" onClick={handleLinkClick}>
                        Institutions
                    </NavLink>
                </li>

                {/* Programs */}
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/programs" onClick={handleLinkClick}>
                        Programs
                    </NavLink>
                </li>

                {/* Documents */}
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/documents" onClick={handleLinkClick}>
                        Documents
                    </NavLink>
                </li>

                {/* Cost Estimation (visible only when logged in) */}
                {LoggedIn && (
                    <li>
                        <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/cost-estimation" onClick={handleLinkClick}>
                            Cost Estimation
                        </NavLink>
                    </li>
                )}

                {/* Progress Tracking (visible only when logged in) */}
                {LoggedIn && (
                    <li>
                        <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/progress-tracking" onClick={handleLinkClick}>
                            Progress Tracking
                        </NavLink>
                    </li>
                )}

                {/* About */}
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/about" onClick={handleLinkClick}>
                        About
                    </NavLink>
                </li>

                {/* Agents */}
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/agents" onClick={handleLinkClick}>
                        Agents
                    </NavLink>
                </li>

                {/* Login and Signup (visible only when not logged in) */}
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

            {/* Auth Buttons (visible only when not logged in) */}
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

            {/* Nav Buttons (visible only when logged in) */}
            {LoggedIn && (
                <div className="nav-buttons">
                    <Chats />
                    <AccountMenu />
                </div>
            )}

            {/* Hamburger Menu */}
            <button className="hamburger" onClick={toggleMenu}>
                <span className="hamburger-icon">
                    <img className="hamburger-icon" src={hamBurger} alt="hamburger" />
                </span>
            </button>
        </nav>
    );
};

export default Navbar;