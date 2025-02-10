// src/components/layout/Navbar.js
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { state, logout, resetRegistration } = useContext(AuthContext);
  const { isAuthenticated, user } = state;
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    if (location.pathname === path) {
  
      resetRegistration();
      navigate('/temp'); // Navigate to a temporary route
      setTimeout(() => navigate(path), 1);
    } else {
      resetRegistration();
      navigate(path);
    }
  };

  const authLinks = (
    <>
      <li className="nav-item">
        <span className="nav-link">Hello {user ? user.name : 'User'}</span>
      </li>
      <li className="nav-item">
        <button className="btn btn-link nav-link" onClick={onLogout}>
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <button className="btn btn-link nav-link" onClick={() => handleNavigation('/register')}>
          Signup  
        </button>
      </li>
      <li className="nav-item">
        <button className="btn btn-link nav-link" onClick={() => handleNavigation('/login')}>
          Login
        </button>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <button className="navbar-brand btn btn-link text-white" onClick={() => handleNavigation('/')}>
          Taskio
        </button>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
