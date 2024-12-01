import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear(); // Clear user information from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-title">UVluate System</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
