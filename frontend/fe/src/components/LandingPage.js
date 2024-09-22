import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import infographic from '../center.png';
import Header from './Header';
import Footer from './Footer';
import './LandingPage.css';
import { jwtDecode } from 'jwt-decode';  // Corrected import

function LandingPage({ onLogin }) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const  handleGoogleSignup = async (response) =>{
        try {
                const decoded = jwtDecode(response.credential);
                console.log('Google signup decoded:', decoded);
        

                const signupResponse = await axios.post('http://localhost:6900/google-signup', {
                    id: decoded.sub,
                    username: decoded.name,
                    email: decoded.email,
                });
                console.log('Google signup response:', signupResponse.data);
                if (signupResponse.data && signupResponse.data.token) {
                    localStorage.setItem('token', signupResponse.data.token);
                    localStorage.setItem('role', signupResponse.data.role || 'user');

                    onLogin({ 
                        token: signupResponse.data.token, 
                        role: signupResponse.data.role
                    });

                    navigate('/home');
                } else {
                    console.error('Invalid server response');
                    // Handle error (e.g., show error message to user)
                }
            } catch (error) {
                console.error('Google signup error:', error.response?.data?.error || error.message);
                // Handle error (e.g., show error message to user)
            }
        };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            
            <nav className="navbar navbar-light" style={{backgroundColor: '#F5F5F5'}}>
                <div className="container d-flex justify-content-between">
                    <div>
                        <button className="btn btn-primary mx-2"
                                style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                                onClick={handleLoginClick}>Login
                        </button>
                        <button className="btn btn-secondary mx-2"
                                style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
                                onClick={handleSignupClick}>Signup
                        </button>
                        <GoogleLogin
                            onSuccess={handleGoogleSignup}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div>
                </div>
            </nav>
            
            <main className="container my-4 flex-grow-1">
                <div className="flip-container">
                    <div className="flipper">
                        <div className="front">
                            <img src={infographic} alt="solveME infographic" className="img-fluid"
                                 style={{maxHeight: '400px'}}/>
                        </div>
                        <div className="back">
                            <div className="about-text">
                                <h2>About solveMyProblem</h2>
                                <p>
                                    Welcome to solveMyProblem, a SaaS platform designed to help users solve complex
                                    computational problems without the need for expensive software licenses or hardware.
                                </p>
                                <p>
                                    SolveMyProblem utilizes cloud-based infrastructure to provide access to powerful
                                    computing resources and specialized solvers like Google OR-Tools for business
                                    research solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default LandingPage;