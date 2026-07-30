import React from 'react';
import '../styles/components/GlassCard.css';

const StatsCard = ({ label, value, icon: Icon, index = 0 }) => {
    // Generate a rotation angle based on index (e.g. -25, -10, 10, 25 for 4 items)
    const rotation = (index - 1.5) * 15;

    return (
        <div data-text={label} style={{ '--r': rotation }} className="stat-glass-card">
            {Icon && <Icon size={40} />}
            <div className="glass-value">{value}</div>
        </div>
    );
};

export default StatsCard;
