import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import infographic from '../center.png';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Δημιουργία state για το error
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = { username: name, email, password };
        console.log('Sending data:', userData);
        axios.post('http://localhost:6900/sign-up', userData)
            .then(response => {
                console.log('User signed up successfully:', response.data);
                navigate('/home'); // Redirect to /home after successful sign up
            })
            .catch(error => {
                console.error('There was an error signing up:', error);
            });
    };

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="container my-4 flex-grow-1">
                <button
                  className="btn btn-light mb-3"
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
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onClick={handleGoBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="text-center mb-4">
                    <img src={infographic} alt="big solveME" className="img-fluid" style={{ maxHeight: '400px' }} />
                </div>
                <div className="text-center mt-4">
                    <form onSubmit={handleSubmit} className="d-inline-block">
                        <div className="form-group d-inline-block">
                            <label htmlFor="name" className="d-inline-block mr-2">Name:</label>
                            <input
                                type="text"
                                className="form-control d-inline-block w-auto"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group d-inline-block ml-3">
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
                        <div className="mt-3">
                            <button type="submit" className="btn mx-2" style={{ backgroundColor: '#00A86B', color: 'white' }}>
                                Sign Up
                            </button>
                            <button type="button" className="btn mx-2" style={{ backgroundColor: '#006B3C', color: 'white' }} onClick={() => navigate('/')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                    {error && <div className="text-danger mt-3">{error}</div>}
                </div>
            </main>

            <Footer />
        </div>
    );

}

export default SignUp;
