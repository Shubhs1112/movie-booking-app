import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FaUsers } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Import Link for navigation
import AdminNavbar from './AdminNavbar';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8180/management/Admin/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle deleting a user
  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    setUsers(users.filter(user => user.userId !== userId));
  };

  return (
    <>
      <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h1><FaUsers /> Manage Users</h1>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="table table-bordered table-rounded mt-4">
            <thead>
              <tr>
                <th>User Name</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.username}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm mx-1"
                        onClick={() => handleDelete(user.userId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageUsers;
