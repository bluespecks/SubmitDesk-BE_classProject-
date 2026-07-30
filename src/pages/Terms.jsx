import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/pages/InfoPage.css';

const Terms = () => {
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
                <h1 className="info-title">Terms & Conditions</h1>
                
                <div className="info-content">
                    <h2>1. Academic Project Usage</h2>
                    <p>
                        SUBMITDESK is an educational project built by a team of university students 
                        to demonstrate backend engineering capabilities, API integration, and frontend UI design. 
                        It is not a commercial product.
                    </p>

                    <h2>2. Mock Data and Privacy</h2>
                    <p>
                        This deployment primarily utilizes local state and mocked authentication responses. 
                        Any information inputted into the registration portal or profile settings is stored temporarily 
                        and is not transmitted to a persistent external database for long-term storage or tracking.
                    </p>

                    <h2>3. Usage Rights & Attribution</h2>
                    <p>
                        The ideas, designs, and architectural code structure demonstrated within this platform 
                        were engineered by <b>Naman, Mridul, Nandini, and Nikhil</b>. Feel free to explore the 
                        project, but please refrain from redistributing the source code without proper attribution 
                        to the original academic project members.
                    </p>

                    <h2>4. Availability</h2>
                    <p>
                        As a student backend project, the services (including mock assignments, submissions, 
                        and automated grading) are provided "as-is" without any warranties of uptime or persistence.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
