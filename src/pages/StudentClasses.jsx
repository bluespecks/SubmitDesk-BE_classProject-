import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import { Users, Plus } from 'lucide-react';
import '../styles/pages/TeacherDashboard.css';

const StudentClasses = () => {
    const { user, token } = useAuth();
    const [classes, setClasses] = useState([]);
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');

    const loadData = async () => {
        try {
            const res = await fetch('/api/classes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setClasses(await res.json());
        } catch (err) {
            console.error('Failed to load student classes', err);
        }
    };

    useEffect(() => {
        if (token) loadData();
    }, [token]);

    const handleJoinClass = async (e) => {
        e.preventDefault();
        setJoinError('');
        setJoinSuccess('');
        
        try {
            const res = await fetch('/api/classes/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ code: joinCode.trim().toUpperCase() })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setJoinSuccess(`Successfully joined ${data.name}!`);
                setJoinCode('');
                loadData();
                setTimeout(() => setJoinSuccess(''), 3000);
            } else {
                setJoinError(data.message || 'Failed to join class');
            }
        } catch (err) {
            setJoinError(err.message);
        }
    };

    return (
        <div className="dashboard teacher-dashboard" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h2 className="dashboard-title">My Classes</h2>
                <p style={{ color: 'var(--text-secondary)' }}>View your enrolled classes and join new ones.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
                <Card padding="medium">
                    <h3 className="section-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Enrolled Classes
                    </h3>
                    {classes.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {classes.map(c => (
                                <li key={c._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{c.name}</span>
                                    <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)', alignSelf: 'center' }}>{c.code}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You are not enrolled in any classes yet.</p>
                    )}
                </Card>

                <Card padding="medium">
                    <h3 className="section-header" style={{ marginBottom: '1rem' }}>Join New Class</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Enter the 6-character text code provided by your teacher to join their class and access specific assignments.
                    </p>
                    <form onSubmit={handleJoinClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input 
                            placeholder="Enter Class Code (e.g. AB12XY)" 
                            value={joinCode}
                            onChange={e => setJoinCode(e.target.value)}
                            required
                            style={{ margin: 0 }}
                        />
                        <AnimatedButton text="Join Class" icon={Plus} variant="primary" type="submit" />
                    </form>
                    {joinError && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 500 }}>{joinError}</p>}
                    {joinSuccess && <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 500 }}>{joinSuccess}</p>}
                </Card>
            </div>
        </div>
    );
};

export default StudentClasses;
