import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        fetchTransactions(token);
    }, [navigate]);

    const fetchTransactions = async (token) => {
        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            };

            const response = await axios.get('http://localhost:6900/get-transactions', {
                ...config,
            });

            console.log('Transactions fetched successfully:', response.data);
            setTransactions(response.data.transactions || []);
        } catch (error) {
            console.error('There was an error fetching the transactions:', error);
        }
    };

    const handleGoBack = () => {
        navigate('/home');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
                <h2 className="mb-4">My Transactions</h2>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Date and Time</th>
                                <th>Amount</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id} style={{
                                    backgroundColor: transaction.amount < 0 ? '#ffcccc' : '#ccffcc'
                                }}>
                                    <td>{formatDate(transaction.createdAt)}</td>
                                    <td>{transaction.amount}</td>
                                    
                                    <td>{transaction.type == 'spend'?'expense':'purchase'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default TransactionsPage;