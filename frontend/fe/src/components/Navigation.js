import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ onLogout }) => {
  return (
    <nav>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'space-around' }}>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/buy-credits">Buy Credits</Link></li>
        <li><Link to="/submit-problem">Submit Problem</Link></li>
        <li><Link to="/statistics">Statistics</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navigation;