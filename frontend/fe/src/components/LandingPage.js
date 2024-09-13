import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
//import logo from '../solve.png';  // Ensure the path is correct for your logo
import infographic from '../center.png';  // Ensure the path is correct for the new infographic
import Header from './Header';
import Footer from './Footer';

function LandingPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <nav className="navbar navbar-light" style={{backgroundColor: '#F5F5F5'}}>
                <div className="container d-flex justify-content-between">
                    <div>
                        <button className="btn btn-primary mx-2"
                                style={{ backgroundColor: '#00A86B', borderColor: '#00A86B' }}
                                onClick={handleLoginClick}>Login</button>
                        <button className="btn btn-secondary mx-2"
                                style={{ backgroundColor: '#00A86B', borderColor: '#00A86B' }}
                                onClick={handleSignupClick}>Signup</button>
                    </div>
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
            <Footer />
        </div>
    );
}

export default LandingPage;
