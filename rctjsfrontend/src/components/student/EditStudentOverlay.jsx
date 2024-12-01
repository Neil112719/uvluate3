import React, { useState, useEffect } from 'react';
import axios from 'axios';
import programsData from '../misc/programs.json'; // Import the updated programs.json file
import './css/EditStudentOverlay.css'; // Import a CSS file for styling the overlay

const EditStudentOverlay = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id_number: student.id_number, // Ensure ID is always included
    fname: student.fname || '',
    mname: student.mname || '',
    lname: student.lname || '',
    suffix: student.suffix || '',
    email: student.email || '',
    department: student.department || '',
    program: student.program || '',
    section: student.section || '',
    year: student.year || '',
    password: '', // Password field (optional)
    usertype: student.usertype || '',
  });

  const [selectedDepartment, setSelectedDepartment] = useState(student.department || '');
  const [programs, setPrograms] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (selectedDepartment) {
      const department = programsData.departments.find(dep => dep.id.toString() === selectedDepartment);
      if (department) {
        setPrograms(department.programs);
        const selectedProgram = department.programs.find(program => program.name === formData.program);
        setSections(selectedProgram ? selectedProgram.sections : []);
      }
    } else {
      setPrograms([]);
      setSections([]);
    }
  }, [selectedDepartment, formData.program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    setFormData(prev => ({
      ...prev,
      department,
      program: '', // Reset program and section when department changes
      section: '',
    }));
  };

  const handleProgramChange = (e) => {
    const program = e.target.value;
    setFormData(prev => ({
      ...prev,
      program,
      section: '', // Reset section when program changes
    }));
    const selectedProgram = programs.find(p => p.name === program);
    setSections(selectedProgram ? selectedProgram.sections : []);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined && v !== ''));

      const response = await axios.post('http://localhost:8000/update_student.php', cleanPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        alert('Student updated successfully');
        onUpdate(cleanPayload); // Update the parent component
        onClose(); // Close the overlay
      } else {
        alert(`Failed to update student: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('There was an error while saving the student data');
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-backdrop" onClick={onClose}></div>
      <div className="overlay-content">
        <h3>Edit Student</h3>

        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>ID</label>
            <input type="text" name="id_number" value={formData.id_number} readOnly disabled />
          </div>

          <div>
            <label>First Name</label>
            <input type="text" name="fname" value={formData.fname} onChange={handleChange} />
          </div>

          <div>
            <label>Middle Name</label>
            <input type="text" name="mname" value={formData.mname} onChange={handleChange} />
          </div>

          <div>
            <label>Last Name</label>
            <input type="text" name="lname" value={formData.lname} onChange={handleChange} />
          </div>

          <div>
            <label>Suffix</label>
            <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} />
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label>Department</label>
            <select name="department" value={selectedDepartment} onChange={handleDepartmentChange}>
              <option value="">Select Department</option>
              {programsData.departments.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Program</label>
            <select name="program" value={formData.program} onChange={handleProgramChange} disabled={!selectedDepartment}>
              <option value="">Select Program</option>
              {programs.map(program => (
                <option key={program.id} value={program.name}>{program.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Section</label>
            <select name="section" value={formData.section} onChange={handleChange} disabled={!formData.program}>
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>{section.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Year</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} />
          </div>

          <div>
            <label>Password (Optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to keep current password"
            />
          </div>

          <div>
            <label>User Type</label>
            <select name="usertype" value={formData.usertype} onChange={handleChange}>
              <option value="">Select User Type</option>
              <option value="5">Student</option>
              <option value="7">Deactivated Student</option>
            </select>
          </div>

          <div className="buttons">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentOverlay;
