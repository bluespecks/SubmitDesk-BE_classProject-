import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Analytics.css';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const Analytics = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/stats/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAnalytics(data);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchAnalytics();
    }, [token]);

    if (loading) return <div className="analytics-page"><p>Loading analytics...</p></div>;
    if (!analytics) return <div className="analytics-page"><p>No analytics data available</p></div>;

    // Transform grade distribution for pie chart
    const gradeDistData = Object.entries(analytics.gradeDistribution).map(([range, count]) => ({
        name: range,
        value: count
    }));

    return (
        <div className="analytics-page">
            <div className="page-header">
                <h1>Analytics Dashboard</h1>
                <p>Comprehensive insights into student performance and assignment completion</p>
            </div>

            <div className="analytics-grid">
                {/* Grade Distribution */}
                <Card padding="medium">
                    <h3 className="chart-title">Grade Distribution</h3>
                    <p className="chart-subtitle">Distribution of grades across all submissions</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={gradeDistData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {gradeDistData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-legend">
                        <p>Total Graded: {analytics.totalGradedSubmissions}</p>
                    </div>
                </Card>

                {/* Assignment Scores */}
                <Card padding="medium">
                    <h3 className="chart-title">Average Scores by Assignment</h3>
                    <p className="chart-subtitle">Performance across different assignments</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.assignmentScores}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="assignmentTitle"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Submission Timeline */}
                <Card padding="medium">
                    <h3 className="chart-title">Submission Timeline (Last 7 Days)</h3>
                    <p className="chart-subtitle">Daily submission activity</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.submissionTimeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} name="Submissions" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Completion Rates */}
                <Card padding="medium">
                    <h3 className="chart-title">Assignment Completion Rates</h3>
                    <p className="chart-subtitle">Submitted vs Graded submissions</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.completionRates}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="assignmentTitle"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="submitted" fill="#eab308" name="Submitted" />
                            <Bar dataKey="graded" fill="#22c55e" name="Graded" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
