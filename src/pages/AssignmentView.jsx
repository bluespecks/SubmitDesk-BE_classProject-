import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, FileText, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/AssignmentView.css';

const AssignmentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [answers, setAnswers] = useState({}); // For MCQ: { qIndex: optionIndex }
    const [file, setFile] = useState(null); // For File Upload
    const [submitted, setSubmitted] = useState(false);
    const [grade, setGrade] = useState(null);

    const { token } = useAuth();
    
    useEffect(() => {
        const loadAssignmentData = async () => {
            try {
                // Fetch all assignments and filter (in a real app, you'd make a GET /api/assignments/:id route, but this works given current routes)
                const assignRes = await fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } });
                if (assignRes.ok) {
                    const data = await assignRes.json();
                    const target = data.find(a => a._id === id);
                    if (target) setAssignment(target);
                }

                // Check submissions
                const subRes = await fetch('/api/submissions', { headers: { Authorization: `Bearer ${token}` } });
                if (subRes.ok) {
                    const subs = await subRes.json();
                    const mySub = subs.find(s => s.assignmentId?._id === id || s.assignmentId === id);
                    if (mySub) {
                        setSubmitted(true);
                        setGrade(mySub.grade);
                        if (mySub.content) setAnswers(mySub.content);
                    }
                }
            } catch (err) {
                console.error("Failed loading assignment view", err);
            }
        };
        
        loadAssignmentData();
    }, [id, token]);

    if (!assignment) return <div>Loading...</div>;

    const handleMcqChange = (qIndex, optionIndex) => {
        setAnswers({ ...answers, [qIndex]: optionIndex });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            if (assignment.type === 'mcq') {
                // MCQ submission
                const answers = assignment.content.map((_, i) => answers[i]);

                const res = await fetch('/api/submissions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        assignmentId: assignment._id,
                        content: JSON.stringify(answers)
                    })
                });

                if (res.ok) {
                    const submission = await res.json();
                    setSubmitted(true);
                    if (submission.grade !== null) {
                        setGrade(submission.grade);
                    }
                }
            } else {
                // File submission
                if (!file) {
                    alert('Please select a file to upload');
                    return;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('assignmentId', assignment._id);

                const res = await fetch('/api/submissions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                if (res.ok) {
                    const submission = await res.json();
                    setSubmitted(true);
                    if (submission.grade !== null) {
                        setGrade(submission.grade);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to submit", err);
            alert('Submission failed. Please try again.');
        }
    };

    return (
        <div className="assignment-view">
            <div className="assignment-header">
                <h1>{assignment.title}</h1>
                <div className="meta-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} /> Closed 11:59 PM
                    </span>
                </div>
            </div>

            <div className="assignment-body">
                <h3>Instructions</h3>
                <p>{assignment.description || "No instructions provided."}</p>
            </div>

            {submitted && grade !== null && (
                <div className="grade-result">
                    <h3>Assignment Graded</h3>
                    <div className="grade-score">{grade}%</div>
                    <p>Good job!</p>
                </div>
            )}

            {!submitted ? (
                <div className="submission-section">
                    <h3 className="section-title">Your Work</h3>
                    <Card padding="medium">
                        {assignment.type === 'mcq' ? (
                            <div className="mcq-form">
                                {assignment.content.map((q, qIndex) => (
                                    <div key={q.id} className="mcq-question">
                                        <div className="question-text">{qIndex + 1}. {q.text}</div>
                                        <div className="mcq-options">
                                            {q.options.map((opt, oIndex) => (
                                                <label key={oIndex} className="option-label">
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
                                                        checked={answers[qIndex] === oIndex}
                                                        onChange={() => handleMcqChange(qIndex, oIndex)}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={handleSubmit} variant="primary" style={{ marginTop: '1rem' }}>
                                    Submit Quiz
                                </Button>
                            </div>
                        ) : (
                            <div className="file-upload-form">
                                <div className="file-upload-container">
                                    <label className="file-upload-box">
                                        <input type="file" onChange={handleFileChange} hidden />
                                        <div className="upload-content">
                                            <div className="upload-icon-circle">
                                                <FileText size={32} color="var(--accent-primary)" strokeWidth={1.5} />
                                            </div>
                                            <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600' }}>
                                                Choose a file to submit
                                            </h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                                                Click to browse or drag and drop
                                            </p>
                                            {file && (
                                                <div className="selected-file-badge">
                                                    <CheckCircle size={16} color="var(--color-success)" />
                                                    <span>{file.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                    <Button onClick={handleSubmit} variant="primary" disabled={!file} style={{ minWidth: '200px' }}>
                                        Submit Assignment
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                <div className="submission-status">
                    <Card padding="small">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-success)' }}>
                            <CheckCircle size={24} />
                            <div>
                                <strong>Submitted</strong>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    You have already submitted this assignment.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AssignmentView;
