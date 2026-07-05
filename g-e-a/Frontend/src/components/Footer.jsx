import React from 'react';
import { Twitter, Facebook, LinkedIn, GitHub } from '@mui/icons-material';
import logo from '../images/Logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container" role="contentinfo">
            <div className="footer-content">
                {/* Company Info */}
                <div className="company-info">
                    <div className="logo-wrapper">
                        <img
                            src={logo}
                            alt="Global Edu Assist Logo"
                            className="company-logo"
                            loading="lazy"
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
                    <ul className="links-list" role="navigation" aria-label="Quick Links">
                        {['About', 'Programs', 'Institutions', 'Agents'].map((item) => (
                            <li className="link-item" key={item}>
                                <a
                                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                                    className="link"
                                    aria-label={`${item} page`}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social Media */}
                <div className="social-links">
                    <h4 className="social-heading">Follow Us</h4>
                    <div className="social-icons" role="navigation" aria-label="Social Media Links">
                        {[
                            { name: 'Twitter', icon: <Twitter />, url: 'https://twitter.com' },
                            { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com' },
                            { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://linkedin.com' },
                            { name: 'GitHub', icon: <GitHub />, url: 'https://github.com' },
                        ].map((platform) => (
                            <a
                                key={platform.name}
                                href={platform.url}
                                className="social-item"
                                aria-label={`Follow us on ${platform.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {platform.icon}
                                <span className="social-text">{platform.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="copyright-section">
                <p>© 2025 Global Edu Assist. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;