/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function SubmitProblem() {
    const [inputFile, setInputFile] = useState(null);
    const [message, setMessage] = useState('');
    const [dateTime, setDateTime] = useState(new Date());

    const defaultModel = { id: '13', title: 'MySolver', notes: 'Θα είναι ωραία με το 7ο παρέα' };

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!inputFile) {
            setMessage("Please upload a file.");
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
    
                const requiredFields = ['userId', 'numVehicles', 'depot', 'maxDistance', 'locationFileContent', 'pythonFileContent'];
                for (let field of requiredFields) {
                    if (!jsonData.hasOwnProperty(field)) {
                        setMessage(`Missing required field: ${field}`);
                        return;
                    }
                }
    
                const formData = new FormData();
                formData.append('userId', jsonData.userId);
                formData.append('numVehicles', jsonData.numVehicles);
                formData.append('depot', jsonData.depot);
                formData.append('maxDistance', jsonData.maxDistance);
                formData.append('locationFile', new Blob([JSON.stringify(jsonData.locationFileContent)], { type: 'application/json' }));
                formData.append('pythonFileContent', new Blob([jsonData.pythonFileContent], { type: 'text/plain' }));
    
                const response = await axios.post('http://localhost:5000/submit-problem', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                console.log('Problem submitted successfully:', response.data);
                setMessage('Problem submitted successfully');
            } catch (error) {
                console.error('There was an error submitting the problem:', error);
                setMessage('Error submitting problem');
            }
    
        };
    
        reader.readAsText(inputFile);
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
                <div className="container d-flex justify-content-between">
                    <span className="navbar-text">
                        status (username, company, account status, logout)
                    </span>
                    <span className="navbar-text">
                        {`system info: ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`}
                    </span>
                </div>
            </nav>

            <main className="container my-5">
                <h2>Submit a Problem</h2>
                <div className="bg-light p-3 mb-3">
                    <div className="row">
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
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="inputFile">Input File</label>
                        <input
                            type="file"
                            className="form-control-file"
                            id="inputFile"
                            onChange={(e) => setInputFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

                <div className="mt-3">
                    <p>{message}</p>
                </div>
            </main>

            <footer className="bg-light text-center p-3">
                <div className="container">
                    <p>footer: solveME stuff (legal, etc)</p>
                </div>
            </footer>
        </div>
    );
}

export default SubmitProblem;
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function SubmitProblem() {
    const [inputFile, setInputFile] = useState(null);
    const [message, setMessage] = useState('');

    const defaultModel = { id: '13', title: 'MySolver', notes: 'Θα είναι ωραία με το 7ο παρέα' };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!inputFile) {
            setMessage("Please upload a file.");
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
    
                const requiredFields = ['userId', 'numVehicles', 'depot', 'maxDistance', 'locationFileContent', 'pythonFileContent'];
                for (let field of requiredFields) {
                    if (!jsonData.hasOwnProperty(field)) {
                        setMessage(`Missing required field: ${field}`);
                        return;
                    }
                }
    
                const formData = new FormData();
                formData.append('userId', jsonData.userId); //currentUser, here is the problem!!!!
                formData.append('numVehicles', jsonData.numVehicles);
                formData.append('depot', jsonData.depot);
                formData.append('maxDistance', jsonData.maxDistance);
                formData.append('locationFileContent', new Blob([JSON.stringify(jsonData.locationFileContent)], { type: 'application/json' }));
                formData.append('pythonFileContent', new Blob([jsonData.pythonFileContent], { type: 'text/plain' }));
    
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
                setMessage('Error submitting problem');
            }
    
        };
    
        reader.readAsText(inputFile);
    };
    
    
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header/>
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
                            style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                        >
                            Submit
                        </button>
                    </form>
                    {message && <p className="mt-3">{message}</p>}
                </div>
            </main>

            <Footer/>
        </div>
    );
}

export default SubmitProblem;
