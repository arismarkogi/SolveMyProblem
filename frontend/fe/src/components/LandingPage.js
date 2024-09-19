import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from 'react-router-dom';
import infographic from '../center.png';  // Ensure the path is correct for the new infographic
import Header from './Header';
import Footer from './Footer';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
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
                    </div>
                </div>
            </nav>

            <main className="container my-4 flex-grow-1">
                <div className="flip-container">
                    <div className="flipper">
                        <div className="front">
                            {/* The front side with the image */}
                            <img src={infographic} alt="solveME infographic" className="img-fluid"
                                 style={{maxHeight: '400px'}}/>
                        </div>
                        <div className="back">
                            {/* The back side with the text */}
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

//
// <main className="container my-4 flex-grow-1">
//     <div className="text-center mb-4">
//         <img src={infographic} alt="big solveME" className="img-fluid" style={{maxHeight: '400px'}}/>
//     </div>
//     <div className="text-center">
//         <button className="btn btn-secondary mx-2"
//                 style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
//                 onClick={handleAboutClick}>About
//         </button>
//         <button className="btn btn-secondary mx-2"
//                 style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
//                 onClick={handleDemoClick}>Demo
//         </button>
//         <button className="btn btn-secondary mx-2"
//                 style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}
//                 onClick={handleInstructionsClick}>Instructions
//         </button>
//     </div>
// </main>
