import React, { useState } from "react";
import "./NavBar.css";
import Logo from "./images/Logo.png"; // Import your logo
import hamBurger from "./images/ham.png"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className="navbar">

            <div className="logo-container active">
                <img src={Logo} alt="Logo" className="logo" />
                <span className="website-name">GEA</span>
            </div>

            <button className="hamburger" onClick={toggleMenu}>
                <span className="hamburger-icon"> <img className="hamburger-icon" src={hamBurger}/></span>
            </button>

            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <li><a href="/">About</a></li>
                <li><a href="/">Institutions</a></li>
                <li><a href="/">Destinations</a></li>
                <li><a href="/">Documents</a></li>
                <li><a href="/">Agents</a></li>
                <li className="auth-link"><a href="/">Login</a></li>
                <li className="auth-link"><a href="/">Signup</a></li>
            </ul>

            <div className="auth-buttons">
                <button className="login-button">Login</button>
                <button className="signup-button">Signup</button>
            </div>

        </nav>

    );
};

export default Navbar;
