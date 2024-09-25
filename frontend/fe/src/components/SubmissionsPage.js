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
                headers: { Authorization: `Bearer ${token}`,
             }
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

    const generateUniqueId = () => {
        return 'ID-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    };


  const handleViewResults = (problemId) => {
    navigate(`/problem/${problemId}`);  // Navigate to the ProblemDetail page
  };


  const handleDelete = async (id) => {
    console.log('Attempting to delete problem with ID:', id);
    const token = localStorage.getItem('token');
    if (!id) {
        console.error('No ID provided, cannot delete problem.');
        return;
    }
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.delete(`http://localhost:5000/deleteProblem/${id}`, config);
        console.log('Problem deleted:', response.data);
        // Refresh the submissions after deletion
        fetchSubmissions(token, role === 'admin' ? userId : null);
    } catch (error) {
        console.error('Error deleting problem:', error);
        if (error.response && error.response.status === 400) {
            alert('Cannot delete problem. The problem is not finished.');
        } else {
            alert('Server error while deleting problem.');
        }
    }
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
                        {submissions.map((submission, index) => (
                            <tr key={submission._id || index}>
                                <td>{submission._id || generateUniqueId()}</td> {/* Use _id if available, otherwise generate one */}
                                <td>{formatDate(submission.submissionDate)}</td>
                                <td>{submission.status}</td>
                                <td>
                                    <button className="btn btn-link text-decoration-none"
                                    onClick={() => handleViewResults(submission._id)}>view results</button>
                                    <button className="btn btn-link text-decoration-none"    
                                    onClick={() => handleDelete(submission._id)}>delete</button>
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
