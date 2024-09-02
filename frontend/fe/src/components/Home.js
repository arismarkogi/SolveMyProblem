import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h2>Welcome to the Home Page</h2>
            <button className="btn btn-primary m-2" onClick={() => navigate('/buy-credits')}>Add Credits</button>
            <button className="btn btn-secondary m-2" onClick={() => navigate('/submit-problem')}>New Submission</button>
            <button className="btn btn-success m-2" onClick={() => navigate('/user-submissions')}>View Submissions</button>
        </div>
    );
}

export default Home;
