import React, { useState, useEffect } from "react";
import "./NavBar.css";
import Logo from "../images/Logo.png";
import hamBurger from "../images/ham.png";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        // Add event listener for resize
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener
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
            <div className="logo-container">
                <img src={Logo} alt="Logo" className="logo" />
                <NavLink to="/" onClick={handleLinkClick}><span className="website-name">GEA</span></NavLink>
            </div>

            {/* Hamburger Menu */}
            <button className="hamburger" onClick={toggleMenu}>
                <span className="hamburger-icon">
                    <img className="hamburger-icon" src={hamBurger} alt="hamburger" />
                </span>
            </button>

            {/* Navigation links */}
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <li><NavLink className={(e) => { return e.isActive ? "activeColor" : "" }} to="/institutions" onClick={handleLinkClick}>Institutions</NavLink></li>
                <li><NavLink className={(e) => { return e.isActive ? "activeColor" : "" }} to="/destination" onClick={handleLinkClick}>Destinations</NavLink></li>
                <li><NavLink className={(e) => { return e.isActive ? "activeColor" : "" }} to="/documents" onClick={handleLinkClick}>Documents</NavLink></li>
                <li><NavLink className={(e) => { return e.isActive ? "activeColor" : "" }} to="/about" onClick={handleLinkClick}>About</NavLink></li>
                <li><NavLink className={(e) => { return e.isActive ? "activeColor" : "" }} to="/agents" onClick={handleLinkClick}>Agents</NavLink></li>
                <li className="auth-link" onClick={handleLinkClick}><NavLink to="/login" className={(e) => { return e.isActive ? "activeColor" : "" }}>Login</NavLink></li>
                <li className="auth-link" onClick={handleLinkClick}><NavLink to="/signup" className={(e) => { return e.isActive ? "activeColor" : "" }}>Signup</NavLink></li>
            </ul>

            {/* Login Singup */}
            <div className="auth-buttons">
                <NavLink to="/login"><button className="login-button">Login</button></NavLink>
                <NavLink to="/signup"><button className="signup-button">Signup</button></NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
