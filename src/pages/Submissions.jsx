import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, FileText, Download, User } from 'lucide-react';
import StatusChip from '../components/StatusChip';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Submissions.css';

const Submissions = () => {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

    // Grading State
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    const { token } = useAuth();

    useEffect(() => {
        const fetchAssignments = async () => {
            const res = await fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setAssignments(await res.json());
        };
        fetchAssignments();

        const params = new URLSearchParams(window.location.search);
        const assignId = params.get('assignmentId');
        if (assignId) setSelectedAssignmentId(assignId);

    }, [token]);

    useEffect(() => {
        const fetchSubmissions = async () => {
             if (!selectedAssignmentId) return;
             const res = await fetch(`/api/submissions?assignmentId=${selectedAssignmentId}`, { headers: { Authorization: `Bearer ${token}` } });
             if (res.ok) setSubmissions(await res.json());
        };
        fetchSubmissions();
    }, [selectedAssignmentId, token]);

    useEffect(() => {
        if (selectedSubmissionId) {
            const sub = submissions.find(s => s.id === selectedSubmissionId);
            if (sub) {
                setGrade(sub.grade || '');
                setFeedback(sub.feedback || '');
            }
        }
    }, [selectedSubmissionId, submissions]);

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch(`/api/submissions/${selectedSubmissionId}/grade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ grade, feedback })
            });

            if (res.ok) {
                // Refresh local state without refetching everything right now
                setSubmissions(submissions.map(sub => 
                   sub._id === selectedSubmissionId 
                     ? { ...sub, grade, feedback, status: 'graded' } 
                     : sub
                ));
                setSelectedSubmissionId(null);
            }
        } catch (err) {
            console.error('Failed to submit grade', err);
        }
    };

    const selectedAssignment = assignments.find(a => a._id === selectedAssignmentId);
    const selectedSubmission = submissions.find(s => s._id === selectedSubmissionId);

    // View 1: List of Assignments
    if (!selectedAssignmentId) {
        return (
            <div className="submissions-page">
                <div className="submissions-header">
                    <h1>Submissions</h1>
                    <p>Select an assignment to view submissions</p>
                </div>
                <div className="assignments-list-sidebar" style={{ width: '100%' }}>
                    <div className="list-header">Assignments</div>
                    <div className="list-content">
                        {assignments.map(assignment => (
                            <div
                                key={assignment._id}
                                className="list-item"
                                onClick={() => setSelectedAssignmentId(assignment._id)}
                            >
                                <span className="list-item-title">{assignment.title}</span>
                                <div className="list-item-meta">
                                    <span>{assignment.subject}</span> • <span>Due: {assignment.dueDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // View 3: Grading Interface
    if (selectedSubmissionId && selectedSubmission) {
        return (
            <div className="submissions-page">
                <div className="main-header">
                    <button className="back-btn" onClick={() => setSelectedSubmissionId(null)}>
                        <ChevronLeft size={16} /> Back to Student List
                    </button>
                    <h3>Grading: {selectedSubmission.studentName}</h3>
                </div>
                <div className="grading-view">
                    {/* Left: Content */}
                    <div className="submission-content">
                        <h4>Student Work</h4>
                        <div className="content-preview">
                            {selectedSubmission.content && typeof selectedSubmission.content === 'object' && selectedSubmission.content.filename ? (
                                <div>
                                    <p>Uploaded File:</p>
                                    <a
                                        href={`/api/submissions/${selectedSubmission._id}/download`}
                                        className="file-link"
                                        download
                                    >
                                        <FileText size={16} />
                                        <span>{selectedSubmission.content.originalName}</span>
                                        <Download size={16} style={{ marginLeft: 'auto' }} />
                                    </a>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        Size: {(selectedSubmission.content.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            ) : (
                                <div className="mcq-review">
                                    <p style={{ marginBottom: '1rem', fontWeight: 600 }}>MCQ Results:</p>
                                    {selectedAssignment.content && selectedAssignment.content.map((q, i) => {
                                        const studentAnswer = Array.isArray(selectedSubmission.content)
                                            ? selectedSubmission.content[i]
                                            : null;
                                        const isCorrect = studentAnswer === q.correctOption;

                                        return (
                                            <div key={i} style={{
                                                marginBottom: '1rem',
                                                padding: '1rem',
                                                backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                border: `1px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`,
                                                borderRadius: '0.5rem'
                                            }}>
                                                <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{i + 1}. {q.text}</p>
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    <div style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                                        Student Answer: {q.options[studentAnswer]} {isCorrect ? '(Correct)' : '(Incorrect)'}
                                                    </div>
                                                    {!isCorrect && (
                                                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                            Correct Answer: {q.options[q.correctOption]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Grading Form */}
                    <div className="grading-panel">
                        <div className="student-profile-mini">
                            <div className="avatar"><User size={20} /></div>
                            <div>
                                <div className="student-name">{selectedSubmission.studentName}</div>
                                <div className="submitted-at">Submitted: {selectedSubmission.submittedAt}</div>
                            </div>
                        </div>

                        <form onSubmit={handleGradeSubmit}>
                            <Input
                                label="Grade (0-100)"
                                type="number"
                                min="0"
                                max="100"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                required
                            />

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Feedback</label>
                                <textarea
                                    className="text-input"
                                    rows={5}
                                    placeholder="Enter feedback for student..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
                                />
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Button type="submit" variant="primary" style={{ width: '100%' }}>
                                    {selectedSubmission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // View 2: Student List for Assignment
    return (
        <div className="submissions-page">
            <div className="main-header">
                <button className="back-btn" onClick={() => setSelectedAssignmentId(null)}>
                    <ChevronLeft size={16} /> Back to Assignments
                </button>
                <h2>{selectedAssignment.title} - Submissions</h2>
            </div>

            <div className="students-grid">
                {submissions.length > 0 ? submissions.map(sub => (
                    <div
                        key={sub._id}
                        className="student-card"
                        onClick={() => setSelectedSubmissionId(sub._id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>{sub.studentId?.name || "Student"}</span>
                            <StatusChip status={sub.status} />
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Date: {sub.submittedAt}
                        </div>
                        {sub.grade && (
                            <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                                Grade: {sub.grade}/100
                            </div>
                        )}
                    </div>
                )) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No submissions found for this assignment.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Students who haven't submitted yet: Everyone else.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Submissions;
