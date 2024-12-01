import React, { useState } from 'react';
import axios from 'axios'; // Assuming you want to use axios to send the request
import programsData from '../misc/programs.json';
import './css/RegisterStudent.css'
const RegisterStudent = () => {
  const [studentData, setStudentData] = useState({
    fname: '',
    lname: '',
    id_number: '',
    email: '',
    department: '',
    program: '',
    section: '',
    year: '',
    password: '', // Password field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Assuming your API endpoint for registration is '/api/register-student'
    try {
      const response = await axios.post('http://localhost:8000/api/admin_request/student/register-student.php', studentData, {
        withCredentials: true, // Enable sending credentials (cookies, tokens)
      });
      if (response.status === 200) {
        setSuccessMessage('Student registered successfully!');
        // Optionally reset form fields
        setStudentData({
          fname: '',
          lname: '',
          id_number: '',
          email: '',
          department: '',
          program: '',
          section: '',
          year: '',
          password: '',
        });
      }
    } catch (error) {
      setErrorMessage('Error registering student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-student">
      <h3>Register a New Student</h3>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="fname" value={studentData.fname} onChange={handleChange} required />
        </label>
        <label>
          Middle Name:
          <input type="text" name="mname" value={studentData.mname} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lname" value={studentData.lname} onChange={handleChange} required />
        </label>
        <label>
          Suffix:
          <input type="text" name="suffix" value={studentData.suffix} onChange={handleChange} />
        </label>
        <label>
          ID Number:
          <input type="text" name="id_number" value={studentData.id_number} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={studentData.email} onChange={handleChange} required />
        </label>

        <label>
          Department:
          <select name="department" value={studentData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {programsData.departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Program:
          <select name="program" value={studentData.program} onChange={handleChange} required>
            <option value="">Select Program</option>
            {studentData.department && programsData.departments
              .find(dep => dep.id.toString() === studentData.department)
              ?.programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
          </select>
        </label>

        <label>
          Section:
          <select name="section" value={studentData.section} onChange={handleChange} required>
            <option value="">Select Section</option>
            {studentData.department && studentData.program && programsData.departments
              .find(dep => dep.id.toString() === studentData.department)
              ?.programs.find(prog => prog.id.toString() === studentData.program)
              ?.sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
          </select>
        </label>

        <label>
          Year:
          <input type="number" name="year" value={studentData.year} onChange={handleChange} required />
        </label>

        <label>
          Password (Auto-generated):
          <input
            type="text"
            name="password"
            value={studentData.password || studentData.id_number} // Auto-generate password based on ID
            disabled
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default RegisterStudent;
