import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Ενημερώστε το URL ώστε να χρησιμοποιεί το API Gateway
        axios.get('http://localhost:8080/problem')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div>
            <h1>Problem Frontend</h1>
            <p>{message}</p>
        </div>
    );
};

export default App;
