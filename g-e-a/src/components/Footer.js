import React from 'react';
import logo from '../images/Logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Company Info */}
                <div className="company-info">
                    <div className="logo-wrapper">
                        <img 
                            src={logo} 
                            alt="Global Edu Assist Logo" 
                            className="company-logo" 
                        />
                        <h3 className="company-text">Global Edu Assist</h3>
                    </div>
                    <p className="company-description">
                        Empowering learners worldwide with innovative educational solutions.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="quick-links">
                    <h4 className="links-heading">Quick Links</h4>
                    <ul className="links-list">
                        {['About Us', 'Courses', 'Blog', 'Contact'].map((item) => (
                            <li className="link-item" key={item}>
                                <a href="/">{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social Media */}
                <div className="social-links">
                    <h4 className="social-heading">Follow Us</h4>
                    <div className="social-icons">
                        {[
                            { name: 'Twitter', icon: 'twitter' },
                            { name: 'Facebook', icon: 'facebook' },
                            { name: 'LinkedIn', icon: 'linkedin' },
                            { name: 'GitHub', icon: 'github' }
                        ].map((platform) => (
                            <a 
                                key={platform.icon}
                                href="/"
                                className="social-item"
                                aria-label={`${platform.icon} link`}
                            >
                                <i className={`fab fa-${platform.icon}`} />
                                <span className="social-text">{platform.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="copyright-section">
                <p>© 2025 Global Edu Assist. All rights reserved.</p>
                <p className="copyright-links">
                    <a href="/privacy">Privacy Policy</a> | 
                    <a href="/terms">Terms of Service</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;