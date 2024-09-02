import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);

        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:6900/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Profile response:', response.data);
        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        setError('Failed to fetch profile data: ' + (error.response?.data?.error || error.message));
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized, logging out');
          if (onLogout) {
            onLogout();
          } else {
            localStorage.removeItem('token');
          }
          navigate('/login');
        }
      }
    };

    fetchProfileData();
  }, [navigate, onLogout]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {profileData.username}</p>
      <p>Email: {profileData.email}</p>
      <p>Credit Balance: {profileData.creditAmount}</p>
    </div>
  );
};

export default Profile;
//////done
