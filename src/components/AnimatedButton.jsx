import React from 'react';
import '../styles/components/AnimatedButton.css';

const AnimatedButton = ({ 
    text = 'Delete', 
    icon: Icon, 
    onClick, 
    variant = 'danger', 
    className = '',
    ...props 
}) => {
    return (
        <button 
            className={`animated-btn anim-btn-${variant} noselect ${className}`} 
            onClick={onClick}
            {...props}
        >
            <span className="text">{text}</span>
            <span className="icon">
                {Icon && <Icon size={20} />}
            </span>
        </button>
    );
};

export default AnimatedButton;
