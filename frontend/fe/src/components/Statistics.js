import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Statistics() {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        //axios.get('/api/statistics')
            axios.get('http://localhost:5000/statistics')
            .then(response => {
                setStatistics(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the statistics:', error);
            });
    }, []);

    return (
        <div className="container mt-5">
            <h2>Statistics</h2>
            <div>
                {/* Προσαρμόστε την προβολή των στατιστικών δεδομένων ανάλογα */}
                <p>Total Problems: {statistics.totalProblems}</p>
                <p>Completed Problems: {statistics.completedProblems}</p>
                <p>Pending Problems: {statistics.pendingProblems}</p>
            </div>
        </div>
    );
}

export default Statistics;
