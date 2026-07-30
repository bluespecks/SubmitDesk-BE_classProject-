import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import StatusChip from '../components/StatusChip';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock, Users, Plus } from 'lucide-react';
import '../styles/pages/TeacherDashboard.css'; // Reusing dashboard grid styles for now

const StudentDashboard = () => {
    const { user, token } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (!token) return;
            try {
                const [assigRes, subRes] = await Promise.all([
                    fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/submissions', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                if (assigRes.ok) setAssignments(await assigRes.json());
                if (subRes.ok) setSubmissions(await subRes.json());
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            }
        };
        loadData();
    }, [token]);


    // Derived mock stats
    const totalAssignments = assignments.length;
    // Realistically, we'd check submissions, but we'll mock based on assignment status for demo
    const completedIds = submissions.map(s => s.assignmentId?._id || s.assignmentId);
    
    const completedAssignments = completedIds.length;
    const pendingAssignments = totalAssignments - completedAssignments;

    const upcomingDeadlines = useMemo(() => {
        const pending = assignments.filter(a => !completedIds.includes(a._id));
        // Sort by closest due date and return just the single nearest
        return pending.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 1);
    }, [assignments, completedIds]);

    const columns = [
        { header: 'Assignment', accessor: 'title' },
        { header: 'Type', accessor: 'type' },
        { 
            header: 'Due Date', 
            render: (row) => new Date(row.deadline).toLocaleDateString()
        },
        { 
            header: 'Status', 
            render: (row) => <StatusChip status={completedIds.includes(row._id) ? 'graded' : 'pending'} /> 
        }
    ];

    return (
        <div className="dashboard teacher-dashboard">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Student Dashboard</h2>
            </div>
            
            <div className="stats-container">
                <StatCard 
                    index={0}
                    label="Total Assignments" 
                    value={totalAssignments} 
                    icon={BookOpen} 
                    trend="+2"
                    trendDirection="up"
                />
                <StatCard 
                    index={1}
                    label="Completed" 
                    value={completedAssignments} 
                    icon={CheckCircle} 
                    trend="+1"
                    trendDirection="up"
                    color="success"
                />
                <StatCard 
                    index={2}
                    label="Pending" 
                    value={pendingAssignments} 
                    icon={Clock} 
                    color="warning"
                />
                    <StatCard 
                        index={3}
                        label="Nearest Deadline" 
                        value={upcomingDeadlines.length > 0 ? new Date(upcomingDeadlines[0].deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'None'} 
                        icon={Clock} 
                        color="danger"
                    />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <Card padding="medium">
                    <h3 className="section-header" style={{ marginBottom: '1rem' }}>All Active Tasks</h3>
                    <Table 
                        columns={columns} 
                        data={assignments.filter(a => !completedIds.includes(a._id))} 
                    />
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;
