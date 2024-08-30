/*import React, { useState, useEffect } from 'react';
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
*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:6900/user-profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to fetch profile data');
      }
    };

    fetchProfileData();
  }, [user.token]);

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
*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:6900/user-profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to fetch profile data');
      }
    };

    fetchProfileData();
  }, [user.token]);

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

export default Profile;*/
/*
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
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:6900/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response && error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          onLogout();
          navigate('/login');
        } else {
          setError('Failed to fetch profile data');
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

export default Profile;*/
/*
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
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:6900/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response && error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          if (onLogout) {
            onLogout();
          } else {
            localStorage.removeItem('token');
          }
          navigate('/login');
        } else {
          setError('Failed to fetch profile data');
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

export default Profile;*/
/*
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
        console.log('Token from localStorage:', token); // Log the token

        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:6900/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Profile response:', response.data); // Log the response
        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        if (error.response && error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          if (onLogout) {
            onLogout();
          } else {
            localStorage.removeItem('token');
          }
          navigate('/login');
        } else {
          setError('Failed to fetch profile data');
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

export default Profile;*/
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
