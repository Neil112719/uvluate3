import React from 'react';
import './ProgramCard.css';

const ProgramCard = ({ program }) => {
  const handleAddCourse = () => {
    alert(`Add course for program: ${program.program_name} clicked!`); // Replace with actual logic
  };

  const handleManageProgram = () => {
    alert(`Manage settings for program: ${program.program_name} clicked!`); // Replace with actual logic
  };

  const handleEditCourse = (course) => {
    alert(`Edit course: ${course.course_name} clicked!`); // Replace with actual logic
  };

  const handleDeleteCourse = (course) => {
    alert(`Delete course: ${course.course_name} clicked!`); // Replace with actual logic
  };

  return (
    <div className="program-card">
      <div className="program-actions">
        <button className="manage-program-btn" onClick={handleManageProgram}>
          ⚙️
        </button>
        <button className="add-course-btn" onClick={handleAddCourse}>
          + Add Courses
        </button>
      </div>
      <div className="courses-list">
        {program.courses && program.courses.length > 0 ? (
          program.courses.map((course) => (
            <div key={course.code} className="course-item">
              <span>{course.course_name}</span>
              <button className="edit-course-btn" onClick={() => handleEditCourse(course)}>
                Edit
              </button>
              <button className="delete-course-btn" onClick={() => handleDeleteCourse(course)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;
