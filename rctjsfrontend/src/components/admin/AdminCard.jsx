import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminCard.css';

function AdminCard() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsertype, setSelectedUsertype] = useState(''); // For filtering by user type
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ id_number: '', fname: '', lname: '', mname: '', suffix: '', email: '' });
  const [editAdmin, setEditAdmin] = useState(null); // To hold data for editing admin

  // Function to fetch admins
  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_admins.php', {
        withCredentials: true,
      });
      if (response.data.success) {
        setAdmins(response.data.admins);
        setFilteredAdmins(response.data.admins);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('An error occurred while fetching admins.');
    }
  };

  // Fetch admins when the component mounts or when the admins need to be updated
  useEffect(() => {
    if (showAdmins) {
      fetchAdmins();
    }
  }, [showAdmins]);

  // Function to handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle filtering by user type
  const handleUsertypeFilter = (event) => {
    setSelectedUsertype(event.target.value);
  };

  // Effect to filter admins based on search query and user type filter
  useEffect(() => {
    let results = admins;

    // Apply search query filter
    if (searchQuery) {
      results = results.filter((admin) =>
        (admin.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
         admin.lname.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply usertype filter
    if (selectedUsertype) {
      results = results.filter((admin) => parseInt(admin.usertype) === parseInt(selectedUsertype));
    }

    setFilteredAdmins(results);
  }, [searchQuery, selectedUsertype, admins]);

  // Function to handle toggling showing all admins
  const handleToggleAdmins = () => {
    if (showAdmins) {
      setShowAdmins(false);
    } else {
      setShowCreateAdminForm(false);
      setEditAdmin(null);
      setShowAdmins(true);
    }
  };

  // Function to handle toggling create custom admin form
  const handleToggleCreateAdminForm = () => {
    if (showCreateAdminForm) {
      setShowCreateAdminForm(false);
    } else {
      setShowAdmins(false);
      setEditAdmin(null);
      setShowCreateAdminForm(true);
    }
  };

  // Function to handle creating a new admin
  const handleCreateAdmin = async () => {
    const adminData = { ...newAdmin };
    if (!adminData.mname) delete adminData.mname; // Remove mname if empty
    if (!adminData.suffix) delete adminData.suffix; // Remove suffix if empty

    // Set password as the ID number
    adminData.password = adminData.id_number;

    try {
      const response = await axios.post('http://localhost:8000/create_custom_admin.php', adminData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data.success) {
        alert('Admin created successfully!');
        setShowCreateAdminForm(false);
        setNewAdmin({ id_number: '', fname: '', lname: '', mname: '', suffix: '', email: '' });
        fetchAdmins(); // Refresh the admin list
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('An error occurred while creating an admin.');
    }
  };

  // Function to handle deleting an admin
  const handleDeleteAdmin = async (id_number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await axios.post('http://localhost:8000/delete_admin.php', { id_number }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        if (response.data.success) {
          alert('Admin deleted successfully!');
          fetchAdmins(); // Refresh the admin list after deletion
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('An error occurred while deleting an admin.');
      }
    }
  };

  // Function to handle editing an admin
  const handleEditAdmin = (admin) => {
    setEditAdmin({ ...admin, password: '' }); // Clear the password to prompt user to enter a new one
    setShowAdmins(false);
    setShowCreateAdminForm(true);
  };

  // Function to handle updating an admin
  const handleUpdateAdmin = async () => {
    const adminData = { ...editAdmin };
    if (!adminData.mname) delete adminData.mname; // Remove mname if empty
    if (!adminData.suffix) delete adminData.suffix; // Remove suffix if empty

    try {
      const response = await axios.post('http://localhost:8000/update_admin.php', adminData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data.success) {
        alert('Admin updated successfully!');
        setEditAdmin(null);
        setShowCreateAdminForm(false);
        fetchAdmins(); // Refresh the admin list
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('An error occurred while updating an admin.');
    }
  };

  return (
    <div className="admin-card">
      <div className="button-container">
        <button onClick={handleToggleAdmins}>
          {showAdmins ? 'Hide Admins' : 'Show All Admins'}
        </button>
        <button onClick={handleToggleCreateAdminForm}>
          {showCreateAdminForm && !editAdmin ? 'Close Create Admin' : 'Create Custom Admin'}
        </button>
      </div>

      {/* Show All Admins Section */}
      {showAdmins && (
        <div className="admin-list">
          <h3>Admin Users</h3>
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search Admins"
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              value={selectedUsertype}
              onChange={handleUsertypeFilter}
            >
              <option value="">Filter by User Type</option>
              <option value="0">Deactivated</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <ul>
            {filteredAdmins.map((admin) => (
              <li key={admin.id_number} className="admin-item">
                <div className="admin-details">
                  {admin.fname} {admin.mname && `${admin.mname} `} {admin.lname} {admin.suffix && `(${admin.suffix})`} (ID: {admin.id_number})
                </div>
                <div className="admin-actions">
                  <button onClick={() => handleEditAdmin(admin)}>Edit</button>
                  <button onClick={() => handleDeleteAdmin(admin.id_number)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create or Edit Custom Admin Form */}
      {showCreateAdminForm && (
        <div className="create-admin-form">
          <h3>{editAdmin ? 'Edit Admin' : 'Create New Admin'}</h3>
          <label>
            ID Number
            <input
              type="text"
              value={editAdmin ? editAdmin.id_number : newAdmin.id_number}
              onChange={(e) =>
                editAdmin ? setEditAdmin({ ...editAdmin, id_number: e.target.value }) : setNewAdmin({ ...newAdmin, id_number: e.target.value })
              }
              disabled={editAdmin !== null} // Disable ID field when editing
            />
          </label>
          <label>
            First Name
            <input
              type="text"
              value={editAdmin ? editAdmin.fname : newAdmin.fname}
              onChange={(e) =>
                editAdmin ? setEditAdmin({ ...editAdmin, fname: e.target.value }) : setNewAdmin({ ...newAdmin, fname: e.target.value })
              }
            />
          </label>
          <label>
            Middle Name (Optional)
            <input
              type="text"
              value={editAdmin ? editAdmin.mname : newAdmin.mname}
              onChange={(e) =>
                editAdmin ? setEditAdmin({ ...editAdmin, mname: e.target.value }) : setNewAdmin({ ...newAdmin, mname: e.target.value })
              }
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              value={editAdmin ? editAdmin.lname : newAdmin.lname}
              onChange={(e) =>
                editAdmin ? setEditAdmin({ ...editAdmin, lname: e.target.value }) : setNewAdmin({ ...newAdmin, lname: e.target.value })
              }
            />
          </label>
          <label>
            Suffix (Optional)
            <input
              type="text"
              value={editAdmin ? editAdmin.suffix : newAdmin.suffix}
              onChange={(e) =>
                editAdmin ? setEditAdmin({ ...editAdmin, suffix: e.target.value }) : setNewAdmin({ ...newAdmin, suffix: e.target.value })
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={editAdmin ? editAdmin.email : newAdmin.email}
              onChange={(e) =>
                editAdmin ? setEditAdmin({ ...editAdmin, email: e.target.value }) : setNewAdmin({ ...newAdmin, email: e.target.value })
              }
            />
          </label>
          {editAdmin ? (
            <>
              <label>
                User Type
                <select
                  value={editAdmin.usertype}
                  onChange={(e) =>
                    setEditAdmin({ ...editAdmin, usertype: parseInt(e.target.value) })
                  }
                >
                  <option value="">Select User Type</option>
                  <option value="0">Deactivated</option>
                  <option value="1">Admin</option>
                </select>
              </label>
              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter a new password if you wish to change it"
                  value={editAdmin.password}
                  onChange={(e) => setEditAdmin({ ...editAdmin, password: e.target.value })}
                />
              </label>
              <button onClick={handleUpdateAdmin}>Update Admin</button>
            </>
          ) : (
            <button onClick={handleCreateAdmin}>Create Admin</button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminCard;
