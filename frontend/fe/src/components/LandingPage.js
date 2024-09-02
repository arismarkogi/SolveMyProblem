import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from '../solve.png';  // Ensure the path is correct for your logo
import infographic from '../center.png';  // Ensure the path is correct for the new infographic

function LandingPage() {
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="p-3 text-center" style={{backgroundColor: '#00A86B'}}>
                <div className="container">
                    <img src={logo} alt="solveME logo" style={{width: '100px'}}/>
                    <h1 className="text-white">solveME</h1>
                    <p className="lead text-white">solveME logo area (70%)</p>
                </div>
            </header>

            <nav className="navbar navbar-light" style={{backgroundColor: '#F5F5F5'}}>
                <div className="container d-flex justify-content-between">
                    <div>
                        <button className="btn btn-primary mx-2" onClick={handleLoginClick}>Login</button>
                        <button className="btn btn-secondary mx-2" onClick={handleSignupClick}>Signup</button>
                    </div>
                    <span className="navbar-text">
                        {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
                    </span>
                </div>
            </nav>

            <main className="container my-4 flex-grow-1">
                <div className="text-center mb-4">
                    <img src={infographic} alt="big solveME" className="img-fluid" style={{maxHeight: '400px'}}/>
                </div>
                <div className="text-center">
                    <a href="#" className="btn btn-secondary mx-2"
                       style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>About</a>
                    <a href="#" className="btn btn-secondary mx-2"
                       style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>Demo</a>
                    <a href="#" className="btn btn-secondary mx-2"
                       style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>Instructions</a>
                </div>
            </main>

            <footer className="text-center p-3" style={{backgroundColor: '#F5F5F5'}}>
                <div className="container">
                    <p>Created by [Your Name], [Team Member 1], [Team Member 2], ...</p>
                    <p>&copy; {new Date().getFullYear()} solveME. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
