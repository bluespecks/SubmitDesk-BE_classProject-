import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, User, LogOut, Settings } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';
import '../styles/layout/Topbar.css';

const Topbar = ({ title = 'Dashboard', user }) => {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <header className="topbar">
            <h1 className="page-title">{title}</h1>

            <div className="topbar-actions">
                <button
                    className="icon-btn theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="notification-wrapper">
                    <button
                        className={`icon-btn ${showNotifications ? 'active' : ''}`}
                        aria-label="Notifications"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        <span className="notification-badge"></span>
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="dropdown-header">
                                <h3>Notifications</h3>
                                <span className="mark-read">Mark all as read</span>
                            </div>
                            <div className="dropdown-content">
                                <div className="notification-item unread">
                                    <p className="notif-text">New submission: <strong>Alice Johnson</strong> submitted <strong>React Intro</strong></p>
                                    <span className="notif-time">2 mins ago</span>
                                </div>
                                <div className="notification-item">
                                    <p className="notif-text">System update scheduled for tonight</p>
                                    <span className="notif-time">1 hour ago</span>
                                </div>
                            </div>
                            <div className="dropdown-footer">
                                <button className="view-all-btn">View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile-wrapper" style={{ position: 'relative' }}>
                    <div 
                        className="user-profile" 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className="user-role">{user?.role || 'Student'}</span>
                        </div>
                    </div>

                    {showUserMenu && (
                        <div className="user-dropdown" style={{ 
                            position: 'absolute', 
                            top: '110%', 
                            right: '0', 
                            backgroundColor: 'var(--bg-secondary)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px', 
                            boxShadow: 'var(--shadow-md)',
                            minWidth: '180px',
                            zIndex: 100,
                            overflow: 'hidden'
                        }}>
                            <button 
                                className="dropdown-item" 
                                onClick={() => navigate('/profile')}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: 'none', background: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}
                            >
                                <Settings size={16} />
                                <span>Edit Profile</span>
                            </button>
                            <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                <AnimatedButton 
                                    text="Logout" 
                                    icon={LogOut} 
                                    onClick={handleLogout} 
                                    variant="danger" 
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
