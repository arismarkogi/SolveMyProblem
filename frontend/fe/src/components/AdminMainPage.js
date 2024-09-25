import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AdminMainPage = ({onLogout}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.clear();
    
    // Call the onLogout function passed from App.js
    if (typeof onLogout === 'function') {
      onLogout();
      navigate('/');
    }};

useEffect(() => {
  // Check if the user is logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token&& role !== 'admin') {
    navigate('/');
  }
}, [navigate]);


  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:6900/search-users', { username, email }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response.data.users) {
        setUsers(response.data.users);
      } else {
        setError('No users found or unexpected response format.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while searching users.');
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleShowStatistics = () => {
    navigate('/statistics');
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
                onClick={handleLogout}
            >
                <FontAwesomeIcon icon={faSignOutAlt}/>
            </button>

      <main className="container my-4 flex-grow-1">
        <h2 className="text-center mb-4">User Search</h2>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="row">
            <div className="col-md-5 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-md-5 mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-2 mb-3">
              <button type="submit" className="btn btn-primary w-100" style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>
                Search
              </button>
            </div>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="user-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
          {users.map((user) => (
            <div key={user._id} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{user.username}</h5>
                  <p className="card-text">{user.email}</p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{backgroundColor: '#006B3C', borderColor: '#006B3C'}}
                  onClick={() => handleEditUser(user._id)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button 
            className="btn btn-primary w-50" 
            style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
            onClick={handleShowStatistics}
          >
            Show Statistics
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminMainPage;
