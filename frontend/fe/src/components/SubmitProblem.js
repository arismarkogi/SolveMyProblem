// import React, { useState } from 'react';
// import axios from 'axios';
//
// function SubmitProblem() {
//     const [description, setDescription] = useState('');
//     const [inputFile, setInputFile] = useState(null);
//
//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const formData = new FormData();
//         formData.append('description', description);
//         formData.append('inputFile', inputFile);
//
//         axios.post('/api/submit-problem', formData)
//             .then(response => {
//                 console.log('Problem submitted successfully:', response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error submitting the problem:', error);
//             });
//     };
//
//     return (
//         <div className="container mt-5">
//             <h2>Submit a Problem</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="description">Problem Description</label>
//                     <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="inputFile">Input File</label>
//                     <input type="file" className="form-control-file" id="inputFile" onChange={(e) => setInputFile(e.target.files[0])} required />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Submit</button>
//             </form>
//         </div>
//     );
// }
//
// export default SubmitProblem;
//
//

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
//
// function SubmitProblem() {
//     const [inputFile, setInputFile] = useState(null);
//     const [message, setMessage] = useState('');
//
//     // Σταθερό προεπιλεγμένο μοντέλο
//     const defaultModel = { id: '13', title: 'MySolver', notes: 'Θα είναι ωραία με το 7ο παρέα' };
//
//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const formData = new FormData();
//         formData.append('inputFile', inputFile);
//         formData.append('model', defaultModel.id);
//
//         // Simulate an API call
//         setTimeout(() => {
//             console.log('Problem submitted successfully:', {
//                 inputFile,
//                 model: defaultModel.id
//             });
//             setMessage('Problem submitted successfully');
//         }, 1000);
//     };
//
//     return (
//         <div>
//             <header className="bg-light p-3 text-center">
//                 <div className="container">
//                     <h1>solveME</h1>
//                     <p className="lead">solveME logo area (70%)</p>
//                 </div>
//             </header>
//
//             <nav className="navbar navbar-light bg-light">
//                 <div className="container">
//                     <span className="navbar-text">
//                         status (username, company, account status, logout)
//                     </span>
//                     <span className="navbar-text">
//                         system info: date/time, health, ...
//                     </span>
//                 </div>
//             </nav>
//
//             <main className="container my-5">
//                 <h2>Submit a Problem</h2>
//                 <div className="bg-light p-3 mb-3">
//                     <div className="row">
//                         <div className="col-md-2">
//                             <strong>Model ID:</strong> {defaultModel.id}
//                         </div>
//                         <div className="col-md-3">
//                             <strong>Title:</strong> {defaultModel.title}
//                         </div>
//                         <div className="col-md-7">
//                             <strong>Notes:</strong> {defaultModel.notes}
//                         </div>
//                     </div>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label htmlFor="inputFile">Input File</label>
//                         <input
//                             type="file"
//                             className="form-control-file"
//                             id="inputFile"
//                             onChange={(e) => setInputFile(e.target.files[0])}
//                             required
//                         />
//                     </div>
//
//                     <button type="submit" className="btn btn-primary">Submit</button>
//                 </form>
//
//                 <div className="mt-3">
//                     <p>{message}</p>
//                 </div>
//             </main>
//
//             <footer className="bg-light text-center p-3">
//                 <div className="container">
//                     <p>footer: solveME stuff (legal, etc)</p>
//                 </div>
//             </footer>
//         </div>
//     );
// }
//
// export default SubmitProblem;
//
// //done?
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SubmitProblem() {
    const [inputFile, setInputFile] = useState(null);
    const [message, setMessage] = useState('');
    const [dateTime, setDateTime] = useState(new Date());

    // Σταθερό προεπιλεγμένο μοντέλο
    const defaultModel = { id: '13', title: 'MySolver', notes: 'Θα είναι ωραία με το 7ο παρέα' };

    useEffect(() => {
        // Ενημέρωση της ημερομηνίας και ώρας κάθε δευτερόλεπτο
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // Καθαρισμός του timer κατά την αποσύνδεση του component
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('inputFile', inputFile);
        formData.append('model', defaultModel.id);

        // Simulate an API call
        setTimeout(() => {
            console.log('Problem submitted successfully:', {
                inputFile,
                model: defaultModel.id
            });
            setMessage('Problem submitted successfully');
        }, 1000);
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
