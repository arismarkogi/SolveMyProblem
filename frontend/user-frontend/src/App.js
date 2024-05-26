// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// const App = () => {
//     const [message, setMessage] = useState('');
//
//     useEffect(() => {
//         axios.get('http://localhost:8080/user')
//             .then(response => {
//                 setMessage(response.data.message);
//             })
//             .catch(error => {
//                 console.error('There was an error!', error);
//             });
//     }, []);
//
//     return (
//         <div>
//             <h1>User Frontend</h1>
//             <p>{message}</p>
//         </div>
//     );
// };
//
// export default App;
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const App = () => {
    const handleLoginSuccess = (response) => {
        console.log('Login Success:', response);
        // Στείλτε το token στο backend για επαλήθευση και δημιουργία συνεδρίας
    };

    const handleLoginFailure = (error) => {
        console.log('Login Failed:', error);
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div>
                <h1>User Frontend</h1>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default App;
