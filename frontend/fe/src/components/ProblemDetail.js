import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function ProblemDetail() {
  const { problemId } = useParams(); // Get problemId from URL
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    // Fetch the problem details when the page loads
    const fetchProblemDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get(`http://localhost:5000/getProblem/${problemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
        alert('Failed to fetch problem details.');
      }
    };

    fetchProblemDetails();
  }, [problemId]);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!problem) {
    return <div>Loading...</div>; // Show a loading message until the data is loaded
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container my-4 flex-grow-1">
        <button
          className="btn btn-light mb-3"
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
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onClick={handleGoBack}
        >
          Back
        </button>

        <h2>Problem Details</h2>

        <div className="problem-details">
          <p><strong>Problem ID:</strong> {problem._id}</p>
          <p><strong>Submission Date:</strong> {new Date(problem.submissionDate).toLocaleString()}</p>
          <p><strong>Status:</strong> {problem.status}</p>
          <p><strong>Number of Vehicles:</strong> {problem.numVehicles}</p>
          <p><strong>Depot:</strong> {problem.depot}</p>
          <p><strong>Max Distance:</strong> {problem.maxDistance} km</p>
          <p><strong>Max Route Distance:</strong> {problem.maxRouteDistance} m</p>
          <p><strong>Total Distance Traveled:</strong> {problem.totalDistTravel} m</p>
          <p><strong>Execution Duration:</strong> {problem.executionDuration} seconds</p>
          <p><strong>Solution:</strong> {problem.solution}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProblemDetail;
