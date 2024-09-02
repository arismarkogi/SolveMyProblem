import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function SubmissionsPage({ isAdmin }) {
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate(); // Προσθήκη του useNavigate

    useEffect(() => {
        const endpoint = isAdmin ? 'http://localhost:5000/admin-activity' : 'http://localhost:5000/user-submissions';
        console.log(`Fetching data from: ${endpoint}`); // Διαγνωστικό μήνυμα
        axios.get(endpoint)
            .then(response => {
                console.log('Data fetched successfully:', response.data); // Διαγνωστικό μήνυμα
                setSubmissions(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the submissions:', error);
            });
    }, [isAdmin]);

    const handleNewProblemClick = () => {
        navigate('/submit-problem');
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
                    <span className="navbar-brand">{isAdmin ? 'administrator' : 'username'}</span>
                    <span className="navbar-text">
                        system info: date/time, health, ...
                    </span>
                </div>
            </nav>

            <main className="container my-5">
                <h2>{isAdmin ? 'Activity' : 'My submissions'}</h2>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        {isAdmin && <th>Creator</th>}
                        <th>Name</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={index}>
                            {isAdmin && <td>{submission.creator}</td>}
                            <td>{submission.name}</td>
                            <td>{submission.createdOn}</td>
                            <td>{submission.status}</td>
                            <td>
                                <button className="btn btn-link">view/edit</button>
                                <button className="btn btn-link">run</button>
                                <button className="btn btn-link">view results</button>
                                <button className="btn btn-link">delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {!isAdmin && <button className="btn btn-primary" onClick={handleNewProblemClick}>New Problem</button>}
            </main>

            <footer className="bg-light text-center p-3">
                <div className="container">
                    <p>footer: solveME stuff (legal, etc)</p>
                </div>
            </footer>
        </div>
    );
}

export default SubmissionsPage;
