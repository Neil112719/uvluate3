import React, { useState } from 'react';
import axios from 'axios';
import programsData from '../misc/programs.json';
import EditStudentOverlay from './EditStudentOverlay';
import './css/StudentProfileCard.css';

// Helper functions to get department, program, and section names
const getDepartmentName = (departmentId) => {
  const department = programsData.departments.find(dep => dep.id.toString() === departmentId);
  return department ? department.name : "N/A";
};

const getProgramName = (departmentId, programId) => {
  const department = programsData.departments.find(dep => dep.id.toString() === departmentId);
  if (department) {
    const program = department.programs.find(prog => prog.id.toString() === programId);
    return program ? program.name : "N/A";
  }
  return "N/A";
};

const getSectionName = (departmentId, programId, sectionId) => {
  const department = programsData.departments.find(dep => dep.id.toString() === departmentId);
  if (department) {
    const program = department.programs.find(prog => prog.id.toString() === programId);
    if (program) {
      const section = program.sections.find(sec => sec.id.toString() === sectionId);
      return section ? section.name : "N/A";
    }
  }
  return "N/A";
};

const StudentProfileCard = ({ student, onRefresh }) => {
  const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);

  // Handle delete click
  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete student ${student.fname} ${student.lname}?`)) {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/admin_request/student/delete_student.php',
          { id_number: student.id_number },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        if (response.data.status === 'success') {
          alert('Student deleted successfully');
          onRefresh(); // Trigger refresh in parent component
        } else {
          alert(`Failed to delete student: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('An error occurred while deleting the student.');
      }
    }
  };

  return (
    <div className="student-profile-container">
      <div className="student-profile-card">
        <div className="student-info">
          <div className="student-header">
            <h4>
              {student.fname} {student.mname && `${student.mname} `}{student.lname} {student.suffix && `, ${student.suffix}`}
              ({student.id_number}) 
            </h4>
            <span className={`status ${student.usertype === "5" ? "active" : student.usertype === "7" ? "inactive" : "other"}`}>
              {student.usertype === "5" ? "🟢" : student.usertype === "7" ? "🔴" : "🟠"}
            </span>
          </div>
          <p>
            {getDepartmentName(student.department)} --- {getProgramName(student.department, student.program)} --- {getSectionName(student.department, student.program, student.section)} --- {student.year || "N/A"}
          </p>
          <p>
            <span className="email">{student.email}</span>
          </p>
        </div>
      </div>

      {/* The buttons are placed inside the same container, but they take up 15% of the width */}
      <div className="student-actions">
        <button onClick={() => setEditOverlayVisible(true)}>Edit</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </div>

      {isEditOverlayVisible && (
        <EditStudentOverlay
          student={student}
          onClose={() => setEditOverlayVisible(false)}
          onUpdate={(updatedStudent) => console.log('Student updated:', updatedStudent)} // Handle updated student logic
        />
      )}
    </div>
  );
};

export default StudentProfileCard;
