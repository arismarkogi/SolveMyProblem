import React, { useState } from 'react';
import axios from 'axios';

function BuyCredits() {
    const [amount, setAmount] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/buy-credits', { amount })
            .then(response => {
                console.log('Credits bought successfully:', response.data);
            })
            .catch(error => {
                console.error('There was an error buying credits:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Buy Credits</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" className="form-control" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Buy Credits</button>
            </form>
        </div>
    );
}

export default BuyCredits;
/////done?
