// src/components/Header.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../solve.png';  // Ensure the path is correct for your logo

const Header = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="p-3 text-center" style={{ backgroundColor: '#00A86B' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <div>
                    <img src={logo} alt="solveME logo" style={{ width: '100px' }} />
                </div>
                <div className="text-white">
                    <h1>solveME</h1>
                </div>
                <div>
                    <span className="navbar-text text-white">
                        {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </header>
    );
}

export default Header;
