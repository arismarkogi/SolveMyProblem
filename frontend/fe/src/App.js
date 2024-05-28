import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Profile from './components/Profile';
import SubmitProblem from './components/SubmitProblem';
import ProblemList from './components/ProblemList';
import Statistics from './components/Statistics';
import BuyCredits from './components/BuyCredits';
import SubmissionsPage from './components/SubmissionsPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/submit-problem" element={<SubmitProblem />} />
                    <Route path="/problems-list" element={<ProblemList />} />
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
