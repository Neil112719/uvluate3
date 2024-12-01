import React, { useState } from 'react';
import StudentList from './StudentList'; // Directly import StudentList
import RegisterStudent from './RegisterStudent'; // Directly import RegisterStudent
import './css/StudentCard.css'; // Import the CSS file for styling

const StudentCard = () => {
  const [activeComponent, setActiveComponent] = useState('studentList'); // Default to showing StudentList

  const handleShowStudents = () => {
    setActiveComponent('studentList'); // Set the active component to StudentList
  };

  const handleRegisterStudent = () => {
    setActiveComponent('registerStudent'); // Set the active component to RegisterStudent
  };

  return (
    <div className="student-card">
      <h2>Student Management</h2>
      <div className="student-card-buttons">
        <button onClick={handleShowStudents}>Show Students</button>
        <button onClick={handleRegisterStudent}>Register Student</button>
      </div>

      {/* Conditionally render the appropriate component based on state */}
      {activeComponent === 'studentList' && <StudentList />}
      {activeComponent === 'registerStudent' && <RegisterStudent />}
    </div>
  );
};

export default StudentCard;
