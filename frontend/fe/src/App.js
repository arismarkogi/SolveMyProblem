import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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

function AuthWrapper({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            setUser({ token, role });
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !['/login', '/signup', '/'].includes(location.pathname)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

function App() {
    const handleLogin = (userData) => {
        console.log('Login successful, user data:', userData);
        const { token, role } = userData;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    const handleCreditUpdate = (newCreditAmount) => {
        // Update user credit logic here
    };

    return (
        <Router>
            <AuthWrapper>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
                        <Route path="/home" element={<Home onLogout={handleLogout} />} />
                        <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
                        <Route path="/submit-problem" element={<SubmitProblem />} />
                        <Route path="/statistics" element={<Statistics isAdmin={true}/>} />
                        <Route path="/buy-credits" element={<BuyCredits token = {localStorage.getItem('token')} onCreditUpdate={handleCreditUpdate} />} />
                        <Route path="/user-submissions" element={<SubmissionsPage isAdmin={false} />} />
                        <Route path="/admin-activity" element={<SubmissionsPage isAdmin={true} />} />
                        <Route path="/admin" element={<AdminMainPage onLogout={handleLogout} />} />
                        <Route path="/edit-user/:userId" element={<UserEditPage />} />
                    </Routes>
                </div>
            </AuthWrapper>
        </Router>
    );
}

export default App;