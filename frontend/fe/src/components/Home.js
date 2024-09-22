import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import infographic from "../center.png";
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Home({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Καλούμε τη συνάρτηση που προήλθε από το App.js
        navigate('/'); // Ανακατευθύνουμε στο landing page
    };
    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
        }
      }, [navigate]);


    return (
        <div className="d-flex flex-column min-vh-100">
            <Header/>
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
                onClick={handleLogout}
            >
                <FontAwesomeIcon icon={faSignOutAlt}/>
            </button>

            <main className="container my-4 flex-grow-1">
                <div className="text-center mb-4">
                    <img src={infographic} alt="big solveME" className="img-fluid" style={{maxHeight: '400px'}}/>
                </div>
                <div className="text-center">
                    <button
                        className="btn btn-secondary mx-2"
                        style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                        onClick={() => navigate('/buy-credits')}
                    >
                        Add Credits
                    </button>
                    <button
                        className="btn btn-secondary mx-2"
                        style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                        onClick={() => navigate('/submit-problem')}
                    >
                        New Submission
                    </button>
                    <button
                        className="btn btn-secondary mx-2"
                        style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                        onClick={() => navigate('/user-submissions')}
                    >
                        View Submissions
                    </button>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Home;
