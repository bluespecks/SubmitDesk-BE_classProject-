import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Layers, Users, BarChart3 } from 'lucide-react';
import '../styles/layout/Sidebar.css';

const Sidebar = ({ role }) => { // role: 'student' | 'teacher'
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = role === 'teacher' ? [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
        { icon: Users, label: 'Students & Classes', path: '/teacher/students' },
        { icon: Layers, label: 'Create Assignment', path: '/teacher/create-assignment' },
        { icon: BookOpen, label: 'Submissions', path: '/teacher/submissions' },
        { icon: BarChart3, label: 'Analytics', path: '/teacher/analytics' },
    ] : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
        { icon: Users, label: 'My Classes', path: '/student/classes' },
        { icon: BookOpen, label: 'Assignments', path: '/student/assignments' },
    ];

    const handleLogoClick = () => {
        const pathParts = location.pathname.split('/').filter(Boolean);
        if (pathParts.length > 2) {
            navigate(-1); // Go back if deep nested
        } else {
            navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header" onClick={handleLogoClick} style={{ cursor: 'pointer' }} title="Go Back / Home">
                <span className="logo-text" style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>SUBMITDESK</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
