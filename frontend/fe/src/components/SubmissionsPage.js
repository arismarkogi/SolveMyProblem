import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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

    const handleGoHome = () => {
        navigate('/home'); // Navigate to the home page
    };


    return (
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            <button
                className="btn btn-light"
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onClick={handleGoHome}
            >
                <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
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
                                     style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                                     onClick={handleNewProblemClick}>New Problem</button>}
            </main>
            <Footer/>
        </div>
    );
}

export default SubmissionsPage;
