// src/components/Footer.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="p-3 text-center" style={{ backgroundColor: '#00A86B', color: 'white' }}>
            <div className="container">
                <p>Created by [Ariadni], [Kostis], [Aris], [Tasos], [Thanasis], [Basilis]</p>
                <p>&copy; {new Date().getFullYear()} solveME. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
