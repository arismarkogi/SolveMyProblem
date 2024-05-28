import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = { email, password };
        axios.post('/api/login', userData)
            .then(response => {
                console.log('User logged in successfully:', response.data);
                navigate('/'); // Redirect to home page after login
            })
            .catch(error => {
                console.error('There was an error logging in:', error);
                setError('Invalid email or password');
            });
    };

    return (
        <div>
            <header className="bg-light p-3 text-center">
                <div className="container">
                    <h1>solveME</h1>
                    <p className="lead">solveME logo area (70%)</p>
                </div>
            </header>

            <nav className="navbar navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="#">login</a>
                    <span className="navbar-text">
            system info: date/time, health, ...
          </span>
                </div>
            </nav>

            <main className="container my-5">
                <div className="text-center">
                    <div className="bg-secondary" style={{ height: '300px' }}>
                        <h2 className="text-white">big solveME photo</h2>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Username:</label>
                            <input
                                type="email"
                                className="form-control d-inline-block w-25 mx-2"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                className="form-control d-inline-block w-25 mx-2"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mx-2">Login</button>
                        <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate('/')}>Cancel</button>
                    </form>
                    {error && <div className="text-danger mt-3">{error}</div>}
                </div>
            </main>

            <footer className="bg-light text-center p-3">
                <div className="container">
                    <p>footer: solveME stuff (legal, etc)</p>
                </div>
            </footer>
        </div>
    );
}

export default LoginPage;
