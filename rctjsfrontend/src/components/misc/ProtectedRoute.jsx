import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredUsertype }) {
  // Get user data from localStorage
  const usertype = parseInt(localStorage.getItem('usertype'), 10);

  // Check if the user is logged in and has the correct usertype
  if (usertype !== requiredUsertype) {
    // Redirect to the login page if not authorized
    return <Navigate to="/" />;
  }

  // If authorized, render the children components (e.g., AdminPage)
  return children;
}

export default ProtectedRoute;
