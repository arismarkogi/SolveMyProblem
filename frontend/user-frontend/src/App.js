// import React from 'react';

// const App = () => {
//     return (
//         <div>
//             <h1>User Frontend</h1>
//         </div>
//     );
// };
// export default App;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/user')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div>
            <h1>User Frontend</h1>
            <p>{message}</p>
        </div>
    );
};

export default App;