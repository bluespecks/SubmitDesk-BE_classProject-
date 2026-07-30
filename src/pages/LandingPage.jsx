import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/pages/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        { title: 'Focus on what matters.', desc: 'Dedicated layout and views tailored for both teachers and students, removing unnecessary clutter.', icon: '🎯' },
        { title: 'Seamless file handling.', desc: 'Upload, manage, and distribute assignment files effortlessly in one unified place.', icon: '📁' },
        { title: 'Instant evaluation.', desc: 'Get immediate feedback on your progress with our automated MCQ grading engine.', icon: '⚡' }
    ];

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="landing-logo" style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>SUBMITDESK</div>
                <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <ThemeToggle />
                    <Button variant="secondary" className="nav-signin" onClick={() => navigate('/login')}>Sign In</Button>
                </div>
            </nav>

            <main className="landing-main">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1 className="hero-title animate-fade-in-up">
                        Learning, <br />
                        Beautifully Organized.
                    </h1>
                    <p className="hero-subtitle animate-fade-in-up delay-1">
                        A dramatically different assignment portal. Powerful distribution, 
                        seamless submission, and completely automated grading. All in one place.
                    </p>
                    <div className="hero-cta animate-fade-in-up delay-2">
                        <Button variant="primary" size="large" onClick={() => navigate('/login')}>
                            Get Started
                        </Button>
                    </div>
                </section>

                {/* Hero Hardware Mockup / Illustration Placeholder */}
                <section className="hero-illustration animate-fade-in-up delay-3">
                    <div className="hardware-mockup">
                        <div className="mockup-content">
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Active Assignments</h3>
                            <div className="mockup-skeleton" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="skel-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ width: '150px', height: '16px', background: 'var(--text-secondary)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                        <div style={{ width: '100px', height: '12px', background: 'var(--text-tertiary)', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ width: '80px', height: '28px', background: 'var(--accent-primary)', opacity: '0.2', borderRadius: '14px' }}></div>
                                </div>
                                <div className="skel-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ width: '180px', height: '16px', background: 'var(--text-secondary)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                        <div style={{ width: '120px', height: '12px', background: 'var(--text-tertiary)', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ width: '80px', height: '28px', background: 'var(--color-success)', opacity: '0.2', borderRadius: '14px' }}></div>
                                </div>
                                <div className="skel-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ width: '140px', height: '16px', background: 'var(--text-secondary)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                        <div style={{ width: '90px', height: '12px', background: 'var(--text-tertiary)', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ width: '80px', height: '28px', background: 'var(--color-warning)', opacity: '0.2', borderRadius: '14px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Showcase Section */}
                <section className="bento-section">
                    <h2 className="section-title animate-fade-in scroll-reveal">Pro workflow. <br/> Without the pro learning curve.</h2>
                    <div className="bento-grid">
                        <div className="bento-card large animate-slide-up scroll-reveal delay-1">
                            <h3>For Teachers</h3>
                            <p>Distribute materials, create custom MCQs, and track every student's submission simultaneously.</p>
                            <div className="bento-illustration teacher-ill">👨‍🏫 📊</div>
                        </div>
                        <div className="bento-card large animate-slide-up scroll-reveal delay-2">
                            <h3>For Students</h3>
                            <p>Never miss a deadline. View assignments, upload files, and take quizzes with a completely distraction-free interface.</p>
                            <div className="bento-illustration student-ill">👩‍🎓 📝</div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="capabilities-header">
                        <h2 className="section-title animate-fade-in scroll-reveal">Core Capabilities.</h2>
                        <p className="section-subtitle">Everything you need to succeed, engineered to stay out of your way.</p>
                    </div>
                    <div className="features-list">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className={`feature-item animate-slide-up scroll-reveal delay-${index + 1}`}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <div className="feature-text">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Final CTA Section */}
                <section className="final-cta scroll-reveal">
                    <h2>Ready to transform your classroom?</h2>
                    <Button variant="primary" size="large" onClick={() => navigate('/login')}>
                        Enter SUBMITDESK
                    </Button>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="footer-logo" style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>SUBMITDESK</div>
                    <div className="footer-links" style={{ display: 'flex', gap: '2rem' }}>
                        <button onClick={() => navigate('/about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>About Us</button>
                        <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms & Conditions</button>
                    </div>
                </div>
                <div className="footer-bottom" style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                    <p>&copy; {new Date().getFullYear()} SUBMITDESK. All rights reserved. Designed for minimalists.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
