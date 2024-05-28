import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


function LandingPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
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
                    <button className="btn btn-link navbar-brand" onClick={handleLoginClick}>login</button>
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
                    <a href="#" className="btn btn-secondary mx-2">about</a>
                    <a href="#" className="btn btn-secondary mx-2">demo</a>
                    <a href="#" className="btn btn-secondary mx-2">instructions</a>
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

export default LandingPage;
