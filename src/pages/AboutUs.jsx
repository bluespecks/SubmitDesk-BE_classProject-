import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/pages/InfoPage.css';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="info-page">
            <nav className="info-nav">
                <div className="info-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    SUBMITDESK
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <ThemeToggle />
                    <Button variant="secondary" onClick={() => navigate('/login')}>Sign In</Button>
                </div>
            </nav>

            <div className="info-container animate-fade-in-up">
                <h1 className="info-title">About the Project</h1>
                
                <div className="info-content">
                    <h2>Our Mission</h2>
                    <p>
                        SUBMITDESK was built to radically simplify the assignment and submission lifecycle. 
                        We noticed that traditional learning management systems were bloated, difficult to navigate, 
                        and visually unappealing. Our goal was to strip away the excess and provide a completely 
                        distraction-free environment tailored specifically for file management and automated assessment.
                    </p>

                    <h2>The Backend Architecture</h2>
                    <p>
                        This portal serves as the front-facing client for a robust backend architecture project. 
                        While visually minimal, the system is designed to interface with complex backend microservices 
                        handling authentication, secure file upload pipelines, and automated multi-threading for MCQ evaluation.
                    </p>

                    <h2>The Team</h2>
                    <p>
                        This project was engineered and designed collaboratively by a dedicated team of students:
                    </p>
                    
                    <div className="team-list">
                        <div className="team-member">Naman</div>
                        <div className="team-member">Mridul</div>
                        <div className="team-member">Nandini</div>
                        <div className="team-member">Nikhil</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
