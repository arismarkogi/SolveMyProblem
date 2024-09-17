import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Profile from './components/Profile';
import SubmitProblem from './components/SubmitProblem';
import Statistics from './components/Statistics';
import BuyCredits from './components/BuyCredits';
import SubmissionsPage from './components/SubmissionsPage';
import Home from './components/Home'; 

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const handleLogin = (userData) => {
        console.log('Login successful, user data:', userData);
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const handleCreditUpdate = (newCreditAmount) => {
        setUser(prevUser => ({
            ...prevUser,
            creditAmount: newCreditAmount
        }));
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
                    <Route 
                        path="/home" 
                        element={user ? <Home user={user} /> : <Navigate to="/login" replace={true} />} 
                    />
                    <Route 
                        path="/profile" 
                        element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace={true} />} 
                    />
                    <Route 
                        path="/submit-problem" 
                        element={user ? <SubmitProblem user={user} /> : <Navigate to="/login" replace={true} />} 
                    />
                    <Route 
                        path="/statistics" 
                        element={user ? <Statistics /> : <Navigate to="/login" replace={true} />} 
                    />
                    <Route 
                        path="/buy-credits" 
                        element={user ? <BuyCredits user={user} onCreditUpdate={handleCreditUpdate} /> : <Navigate to="/login" replace={true} />} 
                    />
                    <Route 
                        path="/user-submissions" 
                        element={user ? <SubmissionsPage isAdmin={false} user={user} /> : <Navigate to="/login" replace={true} />} 
                    />
                    <Route 
                        path="/admin-activity" 
                        element={
                            user && user.role === 'admin' 
                                ? <SubmissionsPage isAdmin={true} user={user} /> 
                                : <Navigate to="/" replace={true} />
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
