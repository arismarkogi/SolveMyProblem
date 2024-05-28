import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState({ name: '', email: '' });
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        axios.get('/api/profile')
            .then(response => {
                setUser(response.data.user);
                setCredits(response.data.credits);
            })
            .catch(error => {
                console.error('There was an error fetching the profile data:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put('/api/profile', user)
            .then(response => {
                console.log('Profile updated successfully:', response.data);
            })
            .catch(error => {
                console.error('There was an error updating the profile:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
            <h3 className="mt-5">Credits: <span>{credits}</span></h3>
        </div>
    );
}

export default Profile;
