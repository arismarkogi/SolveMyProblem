/*
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Profile from './components/Profile';
import SubmitProblem from './components/SubmitProblem';
import Statistics from './components/Statistics';
import BuyCredits from './components/BuyCredits';
import SubmissionsPage from './components/SubmissionsPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    ///////////
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
      setUser(userData);
    };
  
    /////////////
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
                    <Route 
                         path="/profile" 
                        element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
                     />
                  
                    <Route path="/submit-problem" element={<SubmitProblem />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/buy-credits" element={<BuyCredits />} />
                    <Route path="/user-submissions" element={<SubmissionsPage isAdmin={false} />} />
                    <Route path="/admin-activity" element={<SubmissionsPage isAdmin={true} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
*/
/*
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

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to validate the token here
            setUser({ token });
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
                    <Route 
                        path="/profile" 
                        element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/submit-problem" 
                        element={user ? <SubmitProblem user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route 
                        path="/buy-credits" 
                        element={user ? <BuyCredits user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/user-submissions" 
                        element={user ? <SubmissionsPage isAdmin={false} user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/admin-activity" 
                        element={
                            user && user.role === 'admin' 
                                ? <SubmissionsPage isAdmin={true} user={user} /> 
                                : <Navigate to="/" />
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
*/

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

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to validate the token here
            setUser({ token });
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
                    <Route 
                        path="/profile" 
                        element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/submit-problem" 
                        element={user ? <SubmitProblem user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route 
                        path="/buy-credits" 
                        element={user ? <BuyCredits user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/user-submissions" 
                        element={user ? <SubmissionsPage isAdmin={false} user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/admin-activity" 
                        element={
                            user && user.role === 'admin' 
                                ? <SubmissionsPage isAdmin={true} user={user} /> 
                                : <Navigate to="/" />
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
/*
 // <Route path="/login" element={<LogIn />} />
                   // <Route path="/profile" element={<Profile />} />
*/