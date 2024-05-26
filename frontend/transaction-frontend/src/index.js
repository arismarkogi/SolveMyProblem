import React from 'react';
import ReactDOM from 'react-dom/client'; // Αλλάξτε αυτή τη γραμμή
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Αλλάξτε αυτή τη γραμμή

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
