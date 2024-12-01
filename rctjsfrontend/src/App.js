import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage';
import DeanPage from './pages/DeanPage';
import ProgramCoordinatorPage from './pages/ProgramCoordinatorPage';
import FacultyPage from './pages/FacultyPage';
import StudentPage from './pages/StudentPage';
import ProtectedRoute from './components/misc/ProtectedRoute.jsx'; // A custom component to protect routes
import './App.css';

function App() {
  // Main `App` component where all the routing is defined
  return (
    <Router>
      <Routes>
        {/* Default Route - Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Role-specific protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredUsertype={1}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dean" element={<ProtectedRoute><DeanPage /></ProtectedRoute>} />
        <Route path="/program-coordinator" element={<ProtectedRoute><ProgramCoordinatorPage /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute><FacultyPage /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute><StudentPage /></ProtectedRoute>} />

        {/* Fallback to redirect to login if route is not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
