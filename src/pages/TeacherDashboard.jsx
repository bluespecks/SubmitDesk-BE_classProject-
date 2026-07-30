import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Plus } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AssignmentCard from '../components/AssignmentCard';
import '../styles/pages/TeacherDashboard.css';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({
        totalAssignments: 0,
        pendingGrading: 0,
        averageScore: 0,
        totalStudents: 0
    });
    const [recentAssignments, setRecentAssignments] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch real stats from new endpoint
                const statsRes = await fetch('/api/stats/teacher', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                // Fetch assignments
                const assignRes = await fetch('/api/assignments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const assignments = await assignRes.json();
                setRecentAssignments(assignments.slice(0, 3));

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Teacher Dashboard</h1>
                <Link to="/teacher/create-assignment" className="create-btn">
                    <Plus size={20} />
                    Create Assignment
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="stats-container">
                <StatsCard
                    index={0}
                    label="Total Assignments"
                    value={stats.totalAssignments}
                    icon={BookOpen}
                    trend={12}
                />
                <StatsCard
                    index={1}
                    label="Pending Grading"
                    value={stats.pendingGrading}
                    icon={Clock}
                    trend={-5}
                />
                <StatsCard
                    index={2}
                    label="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    trend={4}
                />
                <StatsCard
                    index={3}
                    label="Average Score"
                    value={`${stats.averageScore}%`}
                    trend={2}
                />
            </div>

            {/* Recent Assignments */}
            <div className="dashboard-section">
                <h2 className="section-header">Recent Assignments</h2>
                {recentAssignments.length > 0 ? (
                    <div className="assignments-grid">
                        {recentAssignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                role="teacher"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No assignments created yet.</p>
                        <Link to="/teacher/create-assignment" className="link-text">Create your first assignment</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;

