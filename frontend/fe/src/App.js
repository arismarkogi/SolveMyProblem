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
import AdminMainPage from './components/AdminMainPage';
import UserEditPage from './components/UserEditPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            setUser({ token, role });
        }
    }, []);

    const handleLogin = (userData) => {
        console.log('Login successful, user data:', userData);
        const { token, role } = userData;
        setUser({ token, role });
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
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
                                : <Navigate to="/login" replace={true} />
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            user && user.role === 'admin'
                                ? <AdminMainPage user={user} />
                                : <Navigate to="/login" replace={true} />
                        }
                    />
                    <Route
                        path="/edit-user/:userId"
                        element={
                            user && user.role === 'admin'
                                ? <UserEditPage />
                                : <Navigate to="/login" replace={true} />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;