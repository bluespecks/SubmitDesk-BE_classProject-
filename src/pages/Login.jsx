import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/pages/Login.css';

const BackArrow = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [role, setRole] = useState('student'); // 'student' | 'teacher'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname || (role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                await register(name, role, email, password);
            } else {
                await login(role, email, password);
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-top-bar" style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="back-btn" style={{ position: 'relative', top: 'auto', left: 'auto' }} onClick={() => navigate('/')}>
                    <BackArrow />
                    Back to Home
                </button>
                <ThemeToggle />
            </div>
            
            <Card className="login-card" padding="large">
                <div className="login-header">
                    <h1 className="app-title">SUBMITDESK</h1>
                    <p className="app-subtitle">
                        {isRegistering ? 'Create a new account' : 'Sign in to your account'}
                    </p>
                </div>

                <div className="role-toggle">
                    <button
                        className={`role-btn ${role === 'student' ? 'active' : ''}`}
                        onClick={() => setRole('student')}
                    >
                        Student
                    </button>
                    <button
                        className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                        onClick={() => setRole('teacher')}
                    >
                        Teacher
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegistering && (
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                    <Button type="submit" variant="primary" className="login-btn" size="large" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isRegistering ? 'Create Account' : `Sign In as ${role === 'teacher' ? 'Teacher' : 'Student'}`)}
                    </Button>
                </form>

                <div className="login-footer">
                    <p style={{ marginBottom: '1rem' }}>
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? 'Sign In' : 'Register'}
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
