import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
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
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="container my-4 flex-grow-1">
                <h2 className="mb-4">{isAdmin ? 'Activity' : 'My submissions'}</h2>
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
                                <button className="btn btn-link text-decoration-none">view/edit</button>
                                <button className="btn btn-link text-decoration-none">run</button>
                                <button className="btn btn-link text-decoration-none">view results</button>
                                <button className="btn btn-link text-decoration-none">delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {!isAdmin && <button className="btn btn-primary mt-3"
                                     style={{ backgroundColor: '#00A86B', borderColor: '#00A86B' }}
                                     onClick={handleNewProblemClick}>New Problem</button>}
            </main>
            <Footer/>
        </div>
    );
}

export default SubmissionsPage;
