import React from "react";
import "./NavBar.css";
import Logo from "./images/Logo.png"; // Import your logo

const Navbar = () => {
    return (
        <nav class="navbar">

            <div class="logo-container">
                <img src={Logo} alt="Logo" class="logo" />
                <span class="website-name">GEA</span>
            </div>

            <ul class="nav-links">
                <li><a href="/" class="active">About</a></li>
                <li><a href="/">Institutions</a></li>
                <li><a href="/">Destinations</a></li>
                <li><a href="/">Documents</a></li>
                <li><a href="/">Agents</a></li>
            </ul>

            <div class="auth-buttons">
                <button class="login-button">Login</button>
                <button class="signup-button">Signup</button>
            </div>

        </nav>

    );
};

export default Navbar;
