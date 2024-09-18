import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import infographic from '../center.png';

const LogIn = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);


  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:6900/login', { email, password, isAdmin });
      console.log('Full login response:', response);
      console.log('Login response data:', response.data);

      if (response.data && response.data.message === 'Login successful') {
        if (response.data.token && response.data.role) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);

          onLogin({ token: response.data.token, role: response.data.role });
          if (response.data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/home');
          }  // Redirect to /home after successful login
        } else {
          setError('Invalid server response. Token or userId missing.');
        }
      } else {
        setError('Login failed. Unexpected server response.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
      <div className="d-flex flex-column min-vh-100">
        <Header />

        <main className="container my-4 flex-grow-1">
          <div className="text-center mb-4">
            <img src={infographic} alt="big solveME" className="img-fluid" style={{maxHeight: '400px'}}/>
          </div>
          <div className="text-center mt-4">
            <form onSubmit={handleSubmit} className="d-inline-block">
              <div className="form-group d-inline-block">
                <label htmlFor="email" className="d-inline-block mr-2">Email:</label>
                <input
                    type="email"
                    className="form-control d-inline-block w-auto"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="form-group d-inline-block ml-3">
                <label htmlFor="password" className="d-inline-block mr-2">Password:</label>
                <input
                    type="password"
                    className="form-control d-inline-block w-auto"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="adminCheck"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="adminCheck">
                  Login as administrator
                </label>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn mx-2" style={{backgroundColor: '#00A86B', color: 'white'}} disabled={password.length < 8}>Login
                </button>
                <button type="button" className="btn mx-2" style={{backgroundColor: '#006B3C', color: 'white'}}
                        onClick={() => navigate('/')}>Cancel
                </button>
              </div>
            </form>
            {error && <div className="text-danger mt-3">{error}</div>}
          </div>
        </main>

        <Footer/>
      </div>
  );

};

export default LogIn;


