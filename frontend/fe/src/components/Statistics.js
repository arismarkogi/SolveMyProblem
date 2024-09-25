import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend);

function Statistics() {
    const [statistics, setStatistics] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:6900/get-stats', { 
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }})
            .then(response => {
                setStatistics(response.data.stats);
            })
            .catch(error => {
                console.error('There was an error fetching the statistics:', error);
            });
    }, []);

    if (!statistics || Object.keys(statistics).length === 0) {
        return <p>Loading statistics...</p>;
    }

    // Data for charts

    const statusCountsData = {
        labels: ['Finished', 'Pending'],
        datasets: [{
            label: 'Submission Status',
            data: [statistics.statusCounts.finished, statistics.statusCounts.pending],
            backgroundColor: ['#00A86B', '#FF6347'],
        }],
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}`;
                        },
                    },
                },
            },
        },
    };

    const solutionCountsData = {
        labels: ['Has Solution', 'No Solution'],
        datasets: [{
            label: 'Submission Status',
            data: [statistics.solutionCounts.hasSolution, statistics.solutionCounts.noSolution],
            backgroundColor: ['#00A86B', '#FF6347'],
        }],
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}`;
                        },
                    },
                },
            },
        },
    };


    // Updated function to handle multiple datasets
    const createGraph = (submissions, datasetsInfo) => {
        return {
            labels: submissions.map(item => new Date(item.submissionDate).toLocaleDateString()),
            datasets: datasetsInfo.map(info => ({
                label: info.label,
                data: submissions.map(item => item[info.field]),
                backgroundColor: info.backgroundColor || 'rgba(0, 168, 107, 0.2)', // Adjust for fill color if needed
                borderColor: info.borderColor || '#00A86B', // Line color
                fill: info.fill || false, // Set to true if you want the area under the line filled
                tension: 0.3, // Adjusts the curvature of the line
            }))
        };
    };

    // Example usage for multiple datasets in one chart:
    const last20executionDuration = createGraph(statistics.last20Submissions, [
        { label: 'Time (seconds)', field: 'executionDuration' }
    ]);
    
    const last20numVehicles = createGraph(statistics.last20Submissions, [
        { label: 'Cardinality', field: 'numVehicles' }
    ]);

    const last20totalDistTravel= createGraph(statistics.last20Submissions, [
        { label: 'Distance (metres)', field: 'totalDistTravel' }
    ]);

    // **Combined graph for maxRouteDistance and maxDistance in the same plot**
    const last20maxDistanceComparison = createGraph(statistics.last20Submissions, [
        { label: 'Max Route Distance (metres)', field: 'maxRotueDistance', borderColor: '#00A86B', backgroundColor: 'rgba(0, 168, 107, 0.2)' },
        { label: 'Max Distance Constraint (metres)', field: 'maxDistance', borderColor: '#FF6347', backgroundColor: 'rgba(255, 99, 71, 0.2)' }
    ]);

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
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
            <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            </div>
            <main className="container my-4 flex-grow-1">
                <h2 className="text-center mb-4">Statistics Overview</h2>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Submissions per Day</h5>
                                <p className="card-text display-4 text-center">{statistics.averageSubmissionsPerDay.toFixed(5)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Submissions per User</h5>
                                <p className="card-text display-4 text-center">{statistics.averageSubmissionsPerUser.toFixed(5)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Submission Status Counts</h5>
                                <Pie data={statusCountsData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title"> Has Feasible Solution Counts</h5>
                                <Pie data={solutionCountsData} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Average Time at Solver</h5>
                                <p className="card-text display-4 text-center">{statistics.averageExecutionDuration.toFixed(5)} seconds</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Time at Solver for the Last 20 Submissions</h5>
                                <Line data={last20executionDuration} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Combined chart for maxRouteDistance and maxDistance */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Max Route Distance and Max Distance Constraint for the Last 20 Submissions</h5>
                                <Line data={last20maxDistanceComparison} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Distance Traveled for the Last 20 Submissions</h5>
                                <Line data={last20totalDistTravel} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Number of Vehicles for the Last 20 Submissions</h5>
                                <Line data={last20numVehicles} />
                            </div>
                        </div>
                    </div>
                </div>
                
            </main>

            <Footer />
        </div>
    );
}

export default Statistics;
