import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FacultyCard.css';

function FacultyCard() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [showFaculty, setShowFaculty] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsertype, setSelectedUsertype] = useState(''); // For filtering by user type
  const [showCreateFacultyForm, setShowCreateFacultyForm] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ id_number: '', fname: '', lname: '', mname: '', suffix: '', email: '', department: '', usertype: 4 });
  const [editFaculty, setEditFaculty] = useState(null); // To hold data for editing faculty

  // Department mapping
  const departmentNames = {
    1: 'CETA',
    2: 'COME',
    3: 'CRIM',
    4: 'CBA',
    5: 'CAHS',
    6: 'COED',
  };

  // Function to fetch faculty members
  const fetchFaculty = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_faculty.php', {
        withCredentials: true,
      });
      if (response.data.success) {
        setFaculty(response.data.faculty);
        setFilteredFaculty(response.data.faculty);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      alert('An error occurred while fetching faculty.');
    }
  };

  // Fetch faculty members when the component mounts or when the faculty list needs to be updated
  useEffect(() => {
    if (showFaculty) {
      fetchFaculty();
    }
  }, [showFaculty]);

  // Function to handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle filtering by user type
  const handleUsertypeFilter = (event) => {
    setSelectedUsertype(event.target.value);
  };

  // Effect to filter faculty members based on search query and user type filter
  useEffect(() => {
    let results = faculty;

    // Apply search query filter
    if (searchQuery) {
      results = results.filter((member) =>
        (member.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
         member.lname.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply usertype filter
    if (selectedUsertype) {
      results = results.filter((member) => parseInt(member.usertype) === parseInt(selectedUsertype));
    }

    setFilteredFaculty(results);
  }, [searchQuery, selectedUsertype, faculty]);

  // Function to handle toggling showing all faculty members
  const handleToggleFaculty = () => {
    if (showFaculty) {
      setShowFaculty(false);
    } else {
      setShowCreateFacultyForm(false);
      setEditFaculty(null);
      setShowFaculty(true);
    }
  };

  // Function to handle toggling create custom faculty form
  const handleToggleCreateFacultyForm = () => {
    if (showCreateFacultyForm) {
      setShowCreateFacultyForm(false);
    } else {
      setShowFaculty(false);
      setEditFaculty(null);
      setShowCreateFacultyForm(true);
    }
  };

  // Function to handle creating a new faculty member
  const handleCreateFaculty = async () => {
    const facultyData = { ...newFaculty };
    if (!facultyData.mname) delete facultyData.mname; // Remove mname if empty
    if (!facultyData.suffix) delete facultyData.suffix; // Remove suffix if empty

    // Set password as the ID number
    facultyData.password = facultyData.id_number;

    try {
      const response = await axios.post('http://localhost:8000/create_custom_faculty.php', facultyData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data.success) {
        alert('Faculty member created successfully!');
        setShowCreateFacultyForm(false);
        setNewFaculty({ id_number: '', fname: '', lname: '', mname: '', suffix: '', email: '', department: '', usertype: 4 });
        fetchFaculty(); // Refresh the faculty list
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error creating faculty:', error);
      alert('An error occurred while creating a faculty member.');
    }
  };

  // Function to handle deleting a faculty member
  const handleDeleteFaculty = async (id_number) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        const response = await axios.post('http://localhost:8000/delete_faculty.php', { id_number }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        if (response.data.success) {
          alert('Faculty member deleted successfully!');
          fetchFaculty(); // Refresh the faculty list after deletion
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting faculty:', error);
        alert('An error occurred while deleting a faculty member.');
      }
    }
  };

  // Function to handle editing a faculty member
  const handleEditFaculty = (member) => {
    setEditFaculty({ ...member, password: '' }); // Clear the password to prompt user to enter a new one
    setShowFaculty(false);
    setShowCreateFacultyForm(true);
  };

  // Function to handle updating a faculty member
  const handleUpdateFaculty = async () => {
    const facultyData = { ...editFaculty };
    if (!facultyData.mname) delete facultyData.mname; // Remove mname if empty
    if (!facultyData.suffix) delete facultyData.suffix; // Remove suffix if empty

    try {
      const response = await axios.post('http://localhost:8000/update_faculty.php', facultyData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data.success) {
        alert('Faculty member updated successfully!');
        setEditFaculty(null);
        setShowCreateFacultyForm(false);
        fetchFaculty(); // Refresh the faculty list
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert('An error occurred while updating a faculty member.');
    }
  };

  // Helper function to display user type
  const getUsertypeLabel = (usertype) => {
    switch (usertype) {
      case 2:
        return 'Dean';
      case 3:
        return 'Coordinator';
      case 4:
        return 'Instructor';
      case 6:
        return 'Deactivated';
      default:
        return 'Unknown User Type';
    }
  };

  return (
    <div className="faculty-card">
      <div className="button-container">
        <button onClick={handleToggleFaculty}>
          {showFaculty ? 'Hide Faculty' : 'Show All Faculty'}
        </button>
        <button onClick={handleToggleCreateFacultyForm}>
          {showCreateFacultyForm && !editFaculty ? 'Close Create Faculty' : 'Create Custom Faculty'}
        </button>
      </div>

      {/* Show All Faculty Section */}
      {showFaculty && (
        <div className="faculty-list">
          <h3>Faculty Members</h3>
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search Faculty"
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              value={selectedUsertype}
              onChange={handleUsertypeFilter}
            >
              <option value="">Filter by User Type</option>
              <option value="2">Dean</option>
              <option value="3">Coordinator</option>
              <option value="4">Instructor</option>
              <option value="6">Deactivated</option>
            </select>
          </div>
          <ul>
            {filteredFaculty.map((member) => (
              <li key={member.id_number} className="faculty-item">
                <div className="faculty-details">
                  <strong>{member.fname} {member.mname && `${member.mname} `} {member.lname} {member.suffix && `(${member.suffix})`}</strong><br />
                  ID: {member.id_number}<br />
                  Department: {departmentNames[member.department] || 'Unknown Department'}<br />
                  User Type: {getUsertypeLabel(parseInt(member.usertype))}
                </div>
                <div className="faculty-actions">
                  <button onClick={() => handleEditFaculty(member)}>Edit</button>
                  <button onClick={() => handleDeleteFaculty(member.id_number)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create or Edit Custom Faculty Form */}
      {showCreateFacultyForm && (
        <div className="create-faculty-form">
          <h3>{editFaculty ? 'Edit Faculty' : 'Create New Faculty'}</h3>
          <label>
            ID Number
            <input
              type="text"
              value={editFaculty ? editFaculty.id_number : newFaculty.id_number}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, id_number: e.target.value }) : setNewFaculty({ ...newFaculty, id_number: e.target.value })
              }
              disabled={editFaculty !== null} // Disable ID field when editing
            />
          </label>
          <label>
            First Name
            <input
              type="text"
              value={editFaculty ? editFaculty.fname : newFaculty.fname}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, fname: e.target.value }) : setNewFaculty({ ...newFaculty, fname: e.target.value })
              }
            />
          </label>
          <label>
            Middle Name (Optional)
            <input
              type="text"
              value={editFaculty ? editFaculty.mname : newFaculty.mname}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, mname: e.target.value }) : setNewFaculty({ ...newFaculty, mname: e.target.value })
              }
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              value={editFaculty ? editFaculty.lname : newFaculty.lname}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, lname: e.target.value }) : setNewFaculty({ ...newFaculty, lname: e.target.value })
              }
            />
          </label>
          <label>
            Suffix (Optional)
            <input
              type="text"
              value={editFaculty ? editFaculty.suffix : newFaculty.suffix}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, suffix: e.target.value }) : setNewFaculty({ ...newFaculty, suffix: e.target.value })
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={editFaculty ? editFaculty.email : newFaculty.email}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, email: e.target.value }) : setNewFaculty({ ...newFaculty, email: e.target.value })
              }
            />
          </label>
          <label>
            Department
            <select
              value={editFaculty ? editFaculty.department : newFaculty.department}
              onChange={(e) =>
                editFaculty ? setEditFaculty({ ...editFaculty, department: e.target.value }) : setNewFaculty({ ...newFaculty, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              <option value="1">CETA</option>
              <option value="2">COME</option>
              <option value="3">CRIM</option>
              <option value="4">CBA</option>
              <option value="5">CAHS</option>
              <option value="6">COED</option>
            </select>
          </label>
          {editFaculty ? (
            <>
              <label>
                User Type
                <select
                  value={editFaculty.usertype}
                  onChange={(e) =>
                    setEditFaculty({ ...editFaculty, usertype: parseInt(e.target.value) })
                  }
                >
                  <option value="">Select User Type</option>
                  <option value="2">Dean</option>
                  <option value="3">Coordinator</option>
                  <option value="4">Instructor</option>
                  <option value="6">Deactivated</option>
                </select>
              </label>
              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter a new password if you wish to change it"
                  value={editFaculty.password}
                  onChange={(e) => setEditFaculty({ ...editFaculty, password: e.target.value })}
                />
              </label>
              <button onClick={handleUpdateFaculty}>Update Faculty</button>
            </>
          ) : (
            <button onClick={handleCreateFaculty}>Create Faculty</button>
          )}
        </div>
      )}
    </div>
  );
}

export default FacultyCard;
