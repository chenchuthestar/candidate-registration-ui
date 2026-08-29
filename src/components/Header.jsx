import React, { useState } from "react";
import {
  FaRegStar,
  FaUser,
  FaBuilding,
  FaPhoneAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { MdBusinessCenter } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <NavLink to="/" className="brand-section" onClick={closeMenu}>
          <div className="logo-wrapper">
            <FaRegStar className="main-star" />
            <span className="orbit-line" />
            <span className="small-star star-one">✦</span>
            <span className="small-star star-two">✦</span>
          </div>

          <div className="brand-content">
            <h1>
              STAR <span>TECH</span>
            </h1>
            <p>Connecting Talent, Building Futures</p>
          </div>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaRegStar className="nav-icon" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/jobseeker-registration"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaUser className="nav-icon" />
            <span>Job Seeker Registration</span>
          </NavLink>

          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaBuilding className="nav-icon" />
            <span>Employer Registration</span>
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FiLogIn className="nav-icon" />
            <span>Empoyer Login</span>
          </NavLink>

          <NavLink
            to="/company-login"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <MdBusinessCenter className="nav-icon" />
            <span>Company Owner Login(dummy)</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaPhoneAlt className="nav-icon" />
            <span>Contact Us(Dummy)</span>
          </NavLink>

          <NavLink
            to="/welcome"
            className="welcome-button"
            onClick={closeMenu}
          >
            <FaRegStar />
            <span>
              Welcome to
              <strong>Star Tech</strong>
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;