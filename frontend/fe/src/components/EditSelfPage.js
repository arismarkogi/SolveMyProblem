import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditSelfPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
      } else {
        fetchUserData(token);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:6900/get-user-by-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = response.data.user;
      setUsername(userData.username);
      setEmail(userData.email);
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
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:6900/update-user-token', 
        { username, email, password },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setSuccessMessage('Profile updated successfully');
      setPassword('');
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/home');
  };
  const handleViewSubmissions = () => {
    navigate(`/get-transactions`);
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
        <h2 className="text-center mb-4">Edit Profile</h2>

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
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary" style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>
              Update Profile
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
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditSelfPage;