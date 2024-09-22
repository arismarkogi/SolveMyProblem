import React, { useState ,useEffect} from 'react';
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

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
        }
      }, [navigate]);
      


    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!inputFile) {
            setMessage("Please upload a file.");
            return;
        }
    
        try {
            const fileContent = await readFileAsJSON(inputFile);
            
            // Get token
            const token = localStorage.getItem('token');

            // Add token to the file content
            fileContent.token = token;
    
            // Validate the file content
            const requiredFields = ['userId', 'numVehicles', 'depot', 'maxDistance', 'locationFileContent', 'pythonFileContent'];
            for (let field of requiredFields) {
                if (!fileContent.hasOwnProperty(field)) {
                    setMessage(`Missing required field in JSON: ${field}`);
                    return;
                }
            }
    
            // Send the JSON data to the backend
            const response = await axios.post('http://localhost:6900/submit-problem', fileContent, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Problem submitted successfully:', response.data);
            setMessage('Problem submitted successfully');
        } catch (error) {
            console.error('Error submitting the problem:', error);
            setMessage('Error submitting problem: ' + (error.response?.data?.error || error.message));
        }
    };
    
    // Helper function to read file as JSON
    const readFileAsJSON = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    resolve(json);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
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
                    {/*<form onSubmit={handleSubmit}>
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
                    </form>*/}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="inputFile">Input File (JSON)</label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="inputFile"
                                onChange={(e) => setInputFile(e.target.files[0])}
                                accept=".json,application/json"
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
