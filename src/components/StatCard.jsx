import React from 'react';
import '../styles/components/GlassCard.css';

const StatCard = ({ icon: Icon, label, value, index = 0 }) => {
    // Generate a rotation angle based on index (e.g. -15, 0, 15)
    const rotation = (index - 1) * 15;

    return (
        <div data-text={label} style={{ '--r': rotation }} className="stat-glass-card">
            {Icon && <Icon size={40} />}
            <div className="glass-value">{value}</div>
        </div>
    );
};

export default StatCard;
