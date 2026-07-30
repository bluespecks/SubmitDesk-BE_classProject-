import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../styles/layout/AppLayout.css';

const AppLayout = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Get page title based on path (simple mapping for now)
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('create-assignment')) return 'Create Assignment';
        if (path.includes('submissions')) return 'Submissions';
        if (path.includes('assignments')) return 'Assignments';
        return 'Portal';
    };

    return (
        <div className="app-layout">
            <Sidebar role={user.role} />
            <div className="main-content">
                <Topbar title={getPageTitle()} user={user} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
