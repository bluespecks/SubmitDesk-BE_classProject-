import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2, CheckCircle, FileText, List } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import TextArea from '../components/TextArea'; // Need to create/verify this
import Button from '../components/Button';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/CreateAssignment.css';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [type, setType] = useState('file'); // 'file' | 'mcq'
    const [classId, setClassId] = useState('');
    const [availableClasses, setAvailableClasses] = useState([]);

    const { token } = useAuth();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch('/api/classes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAvailableClasses(data);
                }
            } catch (err) {
                console.error('Failed to fetch classes:', err);
            }
        };
        fetchClasses();
    }, [token]);

    // File Upload State
    const [files, setFiles] = useState([]);

    // MCQ State
    const [questions, setQuestions] = useState([
        { id: 1, text: '', options: ['', '', '', ''], correctOption: 0 }
    ]);

    const handleFileUpload = (e) => {
        const newFiles = Array.from(e.target.files).map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
        }));
        setFiles([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // MCQ Handlers
    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), text: '', options: ['', '', '', ''], correctOption: 0 }
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const setCorrectOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctOption = oIndex;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const assignmentData = {
            title,
            subject,
            description,
            deadline: dueDate,
            type,
            classId: classId || null,
            content: type === 'file' ? files : questions
        };

        try {
            const res = await fetch('/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(assignmentData)
            });

            if (res.ok) {
                navigate('/teacher/dashboard');
            } else {
                console.error('Failed to create assignment');
            }
        } catch (err) {
            console.error('Network error building assignment:', err);
        }
    };

    return (
        <div className="create-assignment-page">
            <div className="page-header">
                <h1>Create New Assignment</h1>
            </div>

            <Card padding="large">
                <form onSubmit={handleSubmit} className="form-section">
                    <Input
                        label="Assignment Title"
                        placeholder="e.g., Introduction to React"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <div className="form-row">
                        <Input
                            label="Subject"
                            placeholder="e.g., Frontend Development"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Target Class (Optional)</label>
                        <select 
                            className="form-input" 
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', width: '100%', backgroundColor: 'var(--bg-main)' }}
                            value={classId} 
                            onChange={(e) => setClassId(e.target.value)}
                        >
                            <option value="">All Students (Global)</option>
                            {availableClasses.map(c => (
                                <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            className="text-input"
                            rows={4}
                            placeholder="Instructions for students..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Assignment Type</label>
                        <div className="type-switcher">
                            <button
                                type="button"
                                className={`type-btn ${type === 'file' ? 'active' : ''}`}
                                onClick={() => setType('file')}
                            >
                                <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                File Upload
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${type === 'mcq' ? 'active' : ''}`}
                                onClick={() => setType('mcq')}
                            >
                                <List size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                MCQ Quiz
                            </button>
                        </div>
                    </div>

                    {type === 'file' ? (
                        <div className="file-upload-section">
                            <label className="file-upload-area">
                                <input type="file" multiple onChange={handleFileUpload} hidden />
                                <div className="upload-icon-wrapper">
                                    <Upload size={48} color="var(--accent-primary)" strokeWidth={1.5} />
                                </div>
                                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: '600' }}>
                                    Upload Assignment Files
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                                    Click to browse or drag and drop your files here
                                </p>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    Supports PDF, DOC, DOCX, images and more
                                </p>
                            </label>

                            {files.length > 0 && (
                                <div className="file-list">
                                    <div className="file-list-header">
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                            Uploaded Files ({files.length})
                                        </span>
                                    </div>
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <div className="file-info">
                                                <div className="file-icon">
                                                    <FileText size={20} color="var(--accent-primary)" />
                                                </div>
                                                <div className="file-details">
                                                    <span className="file-name">{file.name}</span>
                                                    <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                                                </div>
                                            </div>
                                            <button type="button" className="remove-file-btn" onClick={() => removeFile(index)} title="Remove file">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mcq-builder">
                            {questions.map((q, qIndex) => (
                                <div key={q.id} className="question-card">
                                    <button type="button" className="remove-question-btn" onClick={() => removeQuestion(qIndex)}>
                                        <Trash2 size={16} />
                                    </button>

                                    <Input
                                        label={`Question ${qIndex + 1}`}
                                        placeholder="Enter question text..."
                                        value={q.text}
                                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                        required
                                    />

                                    <div className="option-list">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="option-item">
                                                <div
                                                    className="correct-check"
                                                    onClick={() => setCorrectOption(qIndex, oIndex)}
                                                    title="Mark as correct answer"
                                                >
                                                    {q.correctOption === oIndex ? (
                                                        <CheckCircle size={20} fill="var(--color-success)" color="white" />
                                                    ) : (
                                                        <div style={{ width: 20, height: 20, border: '2px solid var(--border-color)', borderRadius: '50%' }} />
                                                    )}
                                                </div>
                                                <Input
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    required
                                                    style={{ flex: 1 }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="add-btn" onClick={addQuestion}>
                                <Plus size={18} /> Add Question
                            </button>
                        </div>
                    )}

                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => navigate('/teacher/dashboard')}>
                            Cancel
                        </Button>
                        <AnimatedButton text="Create Assignment" icon={Plus} variant="primary" type="submit" style={{ width: '220px' }} />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateAssignment;
