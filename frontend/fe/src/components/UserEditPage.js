import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UserEditPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (!token || role !== 'admin') {
        navigate('/');
      } else {
        fetchUserData();
      }
    };

    checkAuth();
  }, [userId, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:6900/get-user-by-id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = response.data.user;
      setUsername(userData.username);
      setEmail(userData.email);
      // Note: We don't set the password for security reasons
    } catch (error) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await axios.post('http://localhost:6900/update-user', 
        { userId, username, email, password },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccessMessage('User updated successfully');
      // Clear password field after successful update
      setPassword('');
    } catch (error) {
      setError('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.post('http://localhost:6900/delete-user', 
          { userId },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setSuccessMessage('User deleted successfully');
        // Redirect to admin page after successful deletion
        setTimeout(() => navigate('/admin'), 2000);
      } catch (error) {
        setError('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleGoHome = () => {
    navigate('/admin'); // Navigate to the admin page
  };
  const handleViewSubmissions = () => {
    navigate(`/user-submissions/${userId}`, { state: { userId } });
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <button
        className="btn btn-light"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onClick={handleGoHome}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <main className="container my-4 flex-grow-1">
        <h2 className="text-center mb-4">Edit User</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password (leave blank to keep current)</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <button type="submit" className="btn btn-primary" style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>
                Update User
              </button>
              <div className="mt-3">
              <button 
                  className="btn btn-secondary" 
                 onClick={handleViewSubmissions}
              >
                View User Submissions
              </button>
        </div>
            </div>
            <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>
              Delete User
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default UserEditPage;