import React, { useState, useEffect } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/StudentAssignments.css';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'open', 'submitted', 'graded'

    const { token } = useAuth();
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const [assigRes, subRes] = await Promise.all([
                    fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/submissions', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                if (assigRes.ok && subRes.ok) {
                    const allAssignments = await assigRes.json();
                    const mySubmissions = await subRes.json();
                    
                    const enhanced = allAssignments.map(a => {
                        const submission = mySubmissions.find(s => s.assignmentId?._id === a._id);
                        let status = 'open';
                        if (submission) {
                            status = submission.status;
                        }
                        return { ...a, status, submission };
                    });
                    
                    setAssignments(enhanced);
                }
            } catch (err) {
                console.error("Failed to fetch assignment list", err);
            }
        };
        
        loadData();
    }, [token]);

    const filteredAssignments = assignments.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'open') return a.status === 'open';
        if (filter === 'submitted') return a.status === 'submitted';
        if (filter === 'graded') return a.status === 'graded';
        return true;
    });

    return (
        <div className="student-assignments-page">
            <div className="page-header">
                <h1>My Assignments</h1>
                <div className="filters">
                    {['all', 'open', 'submitted', 'graded'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="assignments-grid">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map(assignment => (
                        <AssignmentCard
                            key={assignment._id}
                            assignment={assignment}
                            role="student"
                        />
                    ))
                ) : (
                    <p>No assignments found.</p>
                )}
            </div>
        </div>
    );
};

export default StudentAssignments;
