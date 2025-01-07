import React, { useState, useEffect, useContext } from "react";
import "./NavBar.css";
import Logo from "../images/Logo.png";
import hamBurger from "../images/ham.png";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/context";
import SearchBar from "./SearchBar";
import AccountMenu from "./AccountMenu";
import ChatBox from "./ChatBox";

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

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <NavLink to="/" onClick={handleLinkClick}>
                <div className="logo-container">
                    <img src={Logo} alt="Logo" className="logo" />
                    <span className="website-name">GEA</span>
                </div>
            </NavLink>

            {/* Navigation links */}
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/institutions" onClick={handleLinkClick}>
                        Institutions
                    </NavLink>
                </li>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/destination" onClick={handleLinkClick}>
                        Destinations
                    </NavLink>
                </li>
                <li>
                    <NavLink className={(e) => (e.isActive ? "activeColor" : "")} to="/documents" onClick={handleLinkClick}>
                        Documents
                    </NavLink>
                </li>
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

                {/* Show Login/Signup links if not logged in */}
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

            {/* Show Login/Signup buttons if not logged in */}
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

            {/* Show search, chat & profile icon if logged in*/}
            {LoggedIn && (
                <div className="nav-buttons">
                    <SearchBar />
                    <ChatBox />
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
