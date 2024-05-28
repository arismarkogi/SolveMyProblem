import React, { useState } from 'react';
import axios from 'axios';

function SubmitProblem() {
    const [description, setDescription] = useState('');
    const [inputFile, setInputFile] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('inputFile', inputFile);

        axios.post('/api/submit-problem', formData)
            .then(response => {
                console.log('Problem submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('There was an error submitting the problem:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Submit a Problem</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description">Problem Description</label>
                    <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="inputFile">Input File</label>
                    <input type="file" className="form-control-file" id="inputFile" onChange={(e) => setInputFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default SubmitProblem;
