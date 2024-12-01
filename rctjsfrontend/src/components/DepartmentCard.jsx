import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentCard.css';
import ProgramCard from './ProgramCard';

const DepartmentCard = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [showAddDepartmentOverlay, setShowAddDepartmentOverlay] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [password, setPassword] = useState('');

  // Manage scrolling when the overlay is active
  useEffect(() => {
    if (showAddDepartmentOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showAddDepartmentOverlay]);

  // Fetch departments from the backend
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/department/get_departments.php', { withCredentials: true })
      .then((response) => {
        const departmentsData = Array.isArray(response.data) ? response.data : [];
        setDepartments(departmentsData);
        setActiveDepartment(departmentsData[0] || null);
        setActiveProgram(departmentsData[0]?.programs[0] || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        setDepartments([]);
        setLoading(false);
      });
  }, []);

  // Handle department selection
  const handleDepartmentClick = (department) => {
    setActiveDepartment(department);
    setActiveProgram(department.programs[0] || null);
  };

  // Handle program selection
  const handleProgramClick = (program) => {
    setActiveProgram(program);
  };

  // Open the add department overlay
  const handleAddDepartment = () => {
    setShowAddDepartmentOverlay(true);
  };

  // Save the new department
  const handleSaveDepartment = async () => {
    if (!newDepartmentName.trim() || !password.trim()) {
      alert('Please enter both the department name and your password.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/department/add_department.php',
        {
          department_name: newDepartmentName,
          password,
        },
        { withCredentials: true } // Sends cookies automatically, including PHPSESSID
      );

      if (response.data.success) {
        alert('Department added successfully!');
        setDepartments((prev) => [...prev, { name: newDepartmentName, programs: [] }]);
        setShowAddDepartmentOverlay(false);
        setNewDepartmentName('');
        setPassword('');
      } else {
        alert(response.data.message || 'Failed to add department.');
      }
    } catch (error) {
      console.error('Error saving department:', error);
      alert('An error occurred while saving the department.');
    }
  };

  if (loading) {
    return <div>Loading departments...</div>;
  }

  return (
    <div className="departments-card">
      {/* Departments Section */}
      <div className="departments-header">
        {departments.map((department) => (
          <button
            key={department.name}
            className={`department-button ${activeDepartment?.name === department.name ? 'active' : ''}`}
            onClick={() => handleDepartmentClick(department)}
          >
            {department.name}
          </button>
        ))}
        <button className="add-department-btn" onClick={handleAddDepartment}>
          + Add Department
        </button>
      </div>

      {/* Programs Section */}
      <div className="programs-header">
        {activeDepartment?.programs?.map((program) => (
          <button
            key={program.program_name}
            className={`program-button ${activeProgram?.program_name === program.program_name ? 'active' : ''}`}
            onClick={() => handleProgramClick(program)}
          >
            {program.program_name}
          </button>
        ))}
        <button className="add-program-btn" onClick={() => alert('Add program clicked!')}>
          + Add Program
        </button>
      </div>

      {/* ProgramCard */}
      {activeProgram && <ProgramCard program={activeProgram} />}

      {/* Add Department Overlay */}
      {showAddDepartmentOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Add New Department</h3>
            <input
              type="text"
              placeholder="Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSaveDepartment}>Save</button>
            <button onClick={() => setShowAddDepartmentOverlay(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;
