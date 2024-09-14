import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import infographic from "../center.png";
import Footer from "./Footer";

function Home() {
    const navigate = useNavigate();

    return (
        // <div className="d-flex flex-column min-vh-100">
        //     <Header/>
        //     <main className="container my-4 flex-grow-1">
        //         <div className="text-center mb-4">
        //             <img src={infographic} alt="big solveME" className="img-fluid" style={{maxHeight: '400px'}}/>
        //         </div>
        //         <div className="text-center">
        //             <a href="#" className="btn btn-secondary mx-2"
        //                style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>About</a>
        //             <a href="#" className="btn btn-secondary mx-2"
        //                style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>Demo</a>
        //             <a href="#" className="btn btn-secondary mx-2"
        //                style={{backgroundColor: '#00A86B', borderColor: '#00A86B'}}>Instructions</a>
        //         </div>
        //     </main>
        //     <Footer/>
        // </div>
        <div className="d-flex flex-column min-vh-100">
            <Header/>
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
