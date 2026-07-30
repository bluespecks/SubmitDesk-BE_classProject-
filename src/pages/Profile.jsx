import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

// Simple profile styles, can reuse standard dashboard layouts instead of a whole new stylesheet for this mock
const Profile = () => {
    const { user, login } = useAuth(); // we'll use login function to mock-update local storage if we wanted
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        // Since it's a mock, we just pretend it updated our auth context
        // In a real app we'd call an API then sync the state
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h2 className="dashboard-title">Edit Profile</h2>
            </div>
            
            <Card padding="large" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                       {user?.avatar ? ( <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%' }} /> ) : ( <span style={{ fontSize: '2rem' }}>{user?.name?.charAt(0) || '?'}</span> )}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{user?.name || 'User'}</h3>
                        <span className={`status-chip`} style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Role: {user?.role || 'Unknown'}</span>
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <Input 
                        label="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your full name"
                    />
                    <Input 
                        label="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email"
                        placeholder="your.email@school.edu"
                    />
                    
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Button type="submit" variant="primary">Save Changes</Button>
                        {isSaved && <span style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>Changes saved successfully!</span>}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Profile;
