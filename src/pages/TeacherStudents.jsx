import React, { useState, useEffect } from 'react';
import { Users, Plus, Copy, Check } from 'lucide-react';
import Card from '../components/Card';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/TeacherStudents.css';

const TeacherStudents = () => {
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [copiedCode, setCopiedCode] = useState(null);

    const { token } = useAuth();

    useEffect(() => {
        loadClasses();
    }, [token]);

    const loadClasses = async () => {
        try {
            const res = await fetch('/api/classes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setClasses(await res.json());
        } catch (err) {
            console.error('Failed to load classes', err);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (newClassName.trim()) {
            try {
                const res = await fetch('/api/classes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ name: newClassName.trim() })
                });
                if (res.ok) {
                    setNewClassName('');
                    loadClasses();
                }
            } catch (err) {
                console.error('Failed to register class', err);
            }
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="teacher-students-page">
            <header className="page-header">
                <div>
                    <h2>Students & Classes</h2>
                    <p>Manage your classes and view enrolled students.</p>
                </div>
            </header>

            <div className="grid-container">
                <div className="main-content">
                    {classes.map(c => {
                        const students = c.students || [];
                        return (
                            <Card key={c._id} className="class-card">
                                <div className="class-card-header">
                                    <h3>{c.name}</h3>
                                    <div className="class-code-box">
                                        <code>{c.code}</code>
                                        <button 
                                            className="icon-btn" 
                                            onClick={() => handleCopyCode(c.code)}
                                            title="Copy Code"
                                        >
                                            {copiedCode === c.code ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="student-list-container">
                                    <h4>Enrolled Students ({students.length})</h4>
                                    {students.length > 0 ? (
                                        <ul className="student-list">
                                            {students.map((student, i) => (
                                                <li key={i}>
                                                    <Users size={16} />
                                                    <span>{student?.name || 'Unknown Student'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-students">No students have joined this class yet.</p>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                    
                    {classes.length === 0 && (
                        <div className="empty-state">
                            <Users size={48} opacity={0.5} />
                            <p>You haven't created any classes.</p>
                        </div>
                    )}
                </div>

                <aside className="sidebar-content">
                    <Card>
                        <h3>Create New Class</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Generate a text code to share with your students so they can join your class.
                        </p>
                        <form onSubmit={handleCreateClass} className="create-class-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Class Name (e.g. History 101)"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <AnimatedButton text="Create Class" icon={Plus} variant="primary" style={{ width: '100%' }} type="submit" />
                        </form>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default TeacherStudents;
