import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentProfileCard from './StudentProfileCard';
import StudentListNavBar from './StudentListNavBar';
import './css/StudentList.css'; // Import the CSS file

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const fetchStudentsData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_students.php');
      if (response.data.success && response.data.students.length > 0) {
        setStudents(response.data.students);
        setFilteredStudents(response.data.students);
      } else {
        console.error('Failed to fetch students data');
      }
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = searchTerm
      ? students.filter(student =>
          `${student.fname} ${student.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.id_number.includes(searchTerm)
        )
      : students;
    setFilteredStudents(filtered);
  };

  const handleFilterChange = (filters) => {
    const filtered = students.filter(student => {
      const matchesUserType = !filters.userType || student.usertype === filters.userType;
      const matchesDepartment = !filters.department || student.department === filters.department;
      const matchesProgram = !filters.program || student.program === filters.program;
      const matchesSection = !filters.section || student.section === filters.section;
      const matchesYear = !filters.year || student.year === filters.year;

      return (
        matchesUserType &&
        matchesDepartment &&
        matchesProgram &&
        matchesSection &&
        matchesYear
      );
    });
    setFilteredStudents(filtered);
  };

  return (
    <div className="student-list-container">
      <StudentListNavBar onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {filteredStudents.length === 0 ? (
        <div className="no-students">No students found.</div>
      ) : (
        <div className="student-list">
          {filteredStudents.map(student => (
            <StudentProfileCard
              key={student.id_number}
              student={student}
              onRefresh={fetchStudentsData} // Pass fetchStudentsData as onRefresh
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;
