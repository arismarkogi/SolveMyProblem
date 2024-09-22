import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function SubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        if (!token) {
            navigate('/');
            return;
        }
        setRole(userRole);

        fetchSubmissions(token, userRole === 'admin' ? userId : null);
    }, [navigate, location, userId]);

    const fetchSubmissions = async (token, adminUserId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get('http://localhost:5000/getProblems', {
                ...config,
                params: {
                    userId: adminUserId,
                    token: token
                }
            });

            console.log('Data fetched successfully:', response.data);
            setSubmissions(response.data.problems || []);
        } catch (error) {
            console.error('There was an error fetching the submissions:', error);
        }
    };

    const handleNewProblemClick = () => {
        navigate('/submit-problem');
    };

    const handleGoBack = () => {
        if (role === 'admin') {
            navigate(`/edit-user/${userId}`);
        } else {
            navigate('/home');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
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
                onClick={handleGoBack}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <main className="container my-4 flex-grow-1">
                <h2 className="mb-4">{role === 'admin' ? `User Submissions for ID: ${userId}` : 'My submissions'}</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name (ID)</th>
                            <th>Submission Date and Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission) => (
                            <tr key={submission._id}>
                                <td>{submission._id}</td>
                                <td>{formatDate(submission.submissionDate)}</td>
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
                {role !== 'admin' && (
                    <button
                        className="btn btn-primary mt-3"
                        style={{ backgroundColor: '#00A86B', borderColor: '#00A86B' }}
                        onClick={handleNewProblemClick}
                    >
                        New Problem
                    </button>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default SubmissionsPage;