import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, LogIn, LogOut, Menu, X, User } from 'lucide-react';
import AuthModal from './AuthModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setIsLoggedIn(true);
    // Stay on the current page after login
    window.location.reload(); // This will refresh the current page
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" className="nav-brand">
            <Building2 className="nav-icon" />
            <span>Better Banking</span>
          </Link>
        </div>

        <div className="nav-links desktop-menu">
          <Link to="/" className="nav-link">Home</Link>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="nav-link">Loans</button>
            <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
              <Link to="/loans/home" className="dropdown-item">Home Loans</Link>
              <Link to="/loans/car" className="dropdown-item">Car Loans</Link>
              <Link to="/loans/gold" className="dropdown-item">Gold Loans</Link>
            </div>
          </div>
          <div className="nav-dropdown">
            <span className="nav-link">Policies</span>
            <div className="dropdown-content">
              <Link to="/policies/privacy" className="dropdown-item">Privacy Policy</Link>
              <Link to="/policies/terms" className="dropdown-item">Terms & Conditions</Link>
              <Link to="/policies/security" className="dropdown-item">Security</Link>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="auth-buttons">
              <button onClick={() => navigate('/profile')} className="profile-button">
                <User className="button-icon" />
              </button>
              <button onClick={handleAuthClick} className="auth-button logout">
                <LogOut className="button-icon" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="login-button"
            >
              <LogIn className="button-icon" />
              Login
            </button>
          )}
        </div>

        <div className="mobile-menu">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="menu-button"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-nav">
          <Link to="/" className="nav-link">Home</Link>
          <div 
            className="mobile-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="nav-link">Loans</button>
            <div className={`mobile-dropdown-content ${showDropdown ? 'show' : ''}`}>
              <Link to="/loans/home" className="nav-link">Home Loans</Link>
              <Link to="/loans/car" className="nav-link">Car Loans</Link>
              <Link to="/loans/gold" className="nav-link">Gold Loans</Link>
            </div>
          </div>
          <div className="mobile-dropdown">
            <span className="nav-link">Policies</span>
            <div className="mobile-dropdown-content">
              <Link to="/policies/privacy" className="nav-link">Privacy Policy</Link>
              <Link to="/policies/terms" className="nav-link">Terms & Conditions</Link>
              <Link to="/policies/security" className="nav-link">Security</Link>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="auth-buttons">
              <button onClick={() => navigate('/profile')} className="profile-button">
                <User className="button-icon" />
              </button>
              <button onClick={handleAuthClick} className="auth-button logout">
                <LogOut className="button-icon" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="login-button"
            >
              Login
            </button>
          )}
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;