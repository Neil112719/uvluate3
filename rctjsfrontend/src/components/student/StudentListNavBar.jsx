import React, { useState, useEffect } from 'react';
import programsData from '../misc/programs.json'; // Import programs.json for department, program, and section data

const StudentListNavBar = ({
  onSearch,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    userType: '',
    department: '',
    program: '',
    section: '',
    year: '',
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Trigger the search function
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    onFilterChange({ ...filters, [name]: value }); // Trigger the filter function
  };

  // Update program and section options based on selected department
  useEffect(() => {
    if (filters.department) {
      setFilters(prevFilters => ({
        ...prevFilters,
        program: '',
        section: '',
      }));
    }
  }, [filters.department]);

  return (
    <div className="student-list-nav-bar">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Filters */}
      <select name="userType" value={filters.userType} onChange={handleFilterChange}>
        <option value="">User Type</option>
        <option value="5">Student</option>
        <option value="7">Deactivated Student</option>
      </select>

      <select name="department" value={filters.department} onChange={handleFilterChange}>
        <option value="">Department</option>
        {programsData.departments.map(dep => (
          <option key={dep.id} value={dep.id}>{dep.name}</option>
        ))}
      </select>

      <select
        name="program"
        value={filters.program}
        onChange={handleFilterChange}
        disabled={!filters.department}
      >
        <option value="">Program</option>
        {filters.department &&
          programsData.departments
            .find(dep => dep.id.toString() === filters.department)
            ?.programs.map(program => (
              <option key={program.id} value={program.id}>{program.name}</option>
            ))}
      </select>

      <select
        name="section"
        value={filters.section}
        onChange={handleFilterChange}
        disabled={!filters.program}
      >
        <option value="">Section</option>
        {filters.program &&
          programsData.departments
            .find(dep => dep.id.toString() === filters.department)
            ?.programs.find(prog => prog.id.toString() === filters.program)
            ?.sections.map(section => (
              <option key={section.id} value={section.id}>{section.name}</option>
            ))}
      </select>

      <select name="year" value={filters.year} onChange={handleFilterChange}>
        <option value="">Year</option>
        {[1, 2, 3, 4, 5].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default StudentListNavBar;
