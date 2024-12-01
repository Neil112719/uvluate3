import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/misc/Navbar';
import './AdminPage.css'; // Assuming you're using the original AdminPage.css file
import AdminCard from '../components/admin/AdminCard';
import FacultyCard from '../components/faculty/FacultyCard';
import StudentCard from '../components/student/StudentCard';
import DepartmentCard from '../components/DepartmentCard';
import axios from 'axios';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userType, setUserType] = useState('');
  const [userName, setUserName] = useState('');
  const [showChangeOverlay, setShowChangeOverlay] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName('Unknown User');
    }

    const idNumber = localStorage.getItem('id_number');
    if (idNumber) {
      axios.post(
        'http://localhost:8000/check_user_status.php',
        { id_number: idNumber },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then(response => {
        if (response.data.force_password_change === true) {
          setShowChangeOverlay(true); // Show password change overlay
        }
      })
      .catch(error => {
        console.error('Error checking user status:', error);
      });
    } else {
      alert('No user information found. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  // Handlers to change the active section to be displayed
  const handleShowDashboard = () => {
    setActiveSection('dashboard');
    setUserType('');
  };
  const handleShowUsers = () => setActiveSection('users');
  const handleShowDepartments = () => {
    setActiveSection('departments');
    setUserType('');
  };
  const handleShowCourses = () => {
    setActiveSection('courses');
    setUserType('');
  };

  // Handlers to set the specific user type in Users section
  const handleShowAdmins = () => setUserType('admins');
  const handleShowFaculty = () => setUserType('faculty');
  const handleShowStudents = () => setUserType('students');

  // Function to show the overlay for changing password/email
  const handleShowChangeOverlay = () => {
    setShowChangeOverlay(true);
  };

  // Function to hide the overlay
  const handleHideChangeOverlay = () => {
    setShowChangeOverlay(false);
    setNewPassword('');
    setConfirmPassword('');
    setNewEmail('');
  };

  // Submit handler for the password change
  const handleSubmitChange = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    const idNumber = localStorage.getItem('id_number');
    if (!idNumber) {
      alert('No user information found. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/misc/change_password.php', // The PHP script for password change
        {
          id_number: idNumber,
          new_password: newPassword,
          new_email: newEmail, // If email is also being updated, otherwise omit
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert('Password (and/or email) updated successfully.');
        handleHideChangeOverlay(); // Hide the overlay after successful change
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Error updating user information. Please try again later.');
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="sidebar">
          <button onClick={handleShowDashboard}>Dashboard</button>
          <button onClick={handleShowUsers}>Users</button>
          <button onClick={handleShowDepartments}>Departments</button>
          <button onClick={handleShowCourses}>Courses</button>

          <button className="user-card" onClick={handleShowChangeOverlay}>
            <p>Logged in as:</p>
            <span>{userName}</span>
          </button>
        </div>

        <div className="content">
          {activeSection === 'dashboard' && (
            <>
              <h1>Admin Dashboard</h1>
              <p>Welcome, Admin. You can manage the system here by clicking one of the sections on the sidebar.</p>
            </>
          )}

          {activeSection === 'users' && (
            <>
              <h2>Users Management</h2>
              <div className="user-buttons-container">
                <button onClick={handleShowAdmins}>Admins</button>
                <button onClick={handleShowFaculty}>Faculty</button>
                <button onClick={handleShowStudents}>Students</button>
              </div>

              {userType === 'admins' && <AdminCard />}
              {userType === 'faculty' && (<FacultyCard/>)}
              {userType === 'students' && (<StudentCard/>)}
            </>
          )}

          {activeSection === 'departments' && (
            <DepartmentCard/>
          )}

          {activeSection === 'courses' && (
            <>
              <h2>Courses Management</h2>
              <p>Content for managing courses will go here...</p>
            </>
          )}
        </div>
      </div>

      {/* Overlay for changing password and email */}
      {showChangeOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Change Password/Email</h3>

            {/* New Password Field and Toggle Icon */}
            <div className="input-wrapper">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="toggle-visibility"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>

            {/* Confirm Password Field and Toggle Icon */}
            <div className="input-wrapper">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="toggle-visibility"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>

            {/* Email Field */}
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <button onClick={handleSubmitChange}>Submit</button>
            <button className="cancel-button" onClick={handleHideChangeOverlay}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
