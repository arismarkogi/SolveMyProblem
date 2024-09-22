import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function SubmitProblem() {
    const [inputFile, setInputFile] = useState(null);
    const [message, setMessage] = useState('');

    const defaultModel = { id: '13', title: 'MySolver', notes: '' };

    const navigate = useNavigate();

    // Function to decode JWT and extract userId (which is stored under 'id')
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        
        // Log the token to check if it's retrieved correctly
        console.log('Retrieved token from localStorage:', token);

        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decoding the JWT payload
            console.log('Decoded JWT payload:', payload); // Log payload to verify it contains userId
            return payload.id; // Use 'id' because that's where the user ID is stored
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };
/*
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!inputFile) {
            setMessage("Please upload a file.");
            return;
        }

        try {
            const jsonData = { 
                numVehicles: 3, 
                depot: 0, 
                maxDistance: 50,
                locationFileContent: "Some content", // Simulated content
                pythonFileContent: "Python code here" // Simulated Python content
            };

            const requiredFields = ['numVehicles', 'depot', 'maxDistance', 'locationFileContent', 'pythonFileContent'];
            for (let field of requiredFields) {
                if (!jsonData.hasOwnProperty(field)) {
                    setMessage(`Missing required field: ${field}`);
                    return;
                }
            }

            const userId = getUserIdFromToken(); // Extract the userId from the JWT (now correctly using 'id')
            if (!userId) {
                setMessage('User is not authenticated');
                return;
            }

            console.log('Extracted userId from token:', userId); // Log userId to check if it’s correct

            const formData = new FormData();
            formData.append('userId', userId); // Add the extracted userId to the form data
            formData.append('numVehicles', jsonData.numVehicles);
            formData.append('depot', jsonData.depot);
            formData.append('maxDistance', jsonData.maxDistance);
            formData.append('locationFileContent', inputFile); // Attach the uploaded file directly
            formData.append('pythonFileContent', new Blob([jsonData.pythonFileContent], { type: 'text/plain' }));

            // Log the entire formData content before sending
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // Send the problem to the orchestrator via HTTP
            const response = await axios.post('http://localhost:6900/submit-problem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Problem submitted successfully:', response.data);
            setMessage('Problem submitted successfully');
        } catch (error) {
            console.error('There was an error submitting the problem:', error);
            
            // Log the detailed backend error, if available
            if (error.response) {
                console.error('Error response from backend:', error.response.data);
            }

            setMessage('Error submitting problem');
        }
    };
    */

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const userId = getUserIdFromToken(); // Extract userId from token
            if (!userId) {
                setMessage('User is not authenticated');
                return;
            }
    
            const jsonData = { 
                userId,
                numVehicles: 3, 
                depot: 1, 
                maxDistance: 50000,
                locationFileContent: {
                    // Example location data (replace with your real data)
                    Locations: [
                        { Latitude: 37.999833, Longitude: 23.743177 },
                        { Latitude: 37.966783, Longitude: 23.778605 }
                        // ... other locations
                    ]
                },
                pythonFileContent: "Python code here" // Your actual Python code
            };
    
            // Send the JSON data to the backend
            const response = await axios.post('http://localhost:6900/submit-problem', jsonData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Problem submitted successfully:', response.data);
            setMessage('Problem submitted successfully');
        } catch (error) {
            console.error('Error submitting the problem:', error);
            setMessage('Error submitting problem');
        }
    };
    

    const handleGoHome = () => {
        navigate('/home'); // Navigate to the home page
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
                onClick={handleGoHome}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <main className="container my-4 flex-grow-1">
                <div className="bg-light p-4 rounded mb-4">
                    <h2 className="mb-4">Submit a Problem</h2>
                    <div className="row mb-3">
                        <div className="col-md-2">
                            <strong>Model ID:</strong> {defaultModel.id}
                        </div>
                        <div className="col-md-3">
                            <strong>Title:</strong> {defaultModel.title}
                        </div>
                        <div className="col-md-7">
                            <strong>Notes:</strong> {defaultModel.notes}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="inputFile">Input File</label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="inputFile"
                                onChange={(e) => setInputFile(e.target.files[0])}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ backgroundColor: '#00A86B', borderColor: '#00A86B' }}
                        >
                            Submit
                        </button>
                    </form>
                    {message && <p className="mt-3">{message}</p>}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default SubmitProblem;
