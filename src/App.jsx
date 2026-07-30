import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layout/AppLayout';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentView from './pages/AssignmentView';
import Submissions from './pages/Submissions';
import StudentAssignments from './pages/StudentAssignments';
import StudentClasses from './pages/StudentClasses';
import AboutUs from './pages/AboutUs';
import Terms from './pages/Terms';
import Profile from './pages/Profile';
import TeacherStudents from './pages/TeacherStudents';
import Analytics from './pages/Analytics';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/terms" element={<Terms />} />

                        <Route element={<AppLayout />}>
                            {/* Student Routes */}
                            <Route path="student/dashboard" element={<StudentDashboard />} />
                            <Route path="student/classes" element={<StudentClasses />} />
                            <Route path="student/assignments" element={<StudentAssignments />} />
                            <Route path="student/assignments/:id" element={<AssignmentView />} />

                            {/* Common Auth Routes */}
                            <Route path="profile" element={<Profile />} />

                            {/* Teacher Routes */}
                            <Route path="teacher/dashboard" element={<TeacherDashboard />} />
                            <Route path="teacher/students" element={<TeacherStudents />} />
                            <Route path="teacher/create-assignment" element={<CreateAssignment />} />
                            <Route path="teacher/submissions" element={<Submissions />} />
                            <Route path="teacher/analytics" element={<Analytics />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
