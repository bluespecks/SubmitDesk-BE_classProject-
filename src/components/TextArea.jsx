import React from 'react';
import '../styles/components/Input.css';

const TextArea = ({ label, error, className = '', ...props }) => {
    const id = props.id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <textarea
                id={id}
                className={`input-field ${error ? 'input-error' : ''}`}
                style={{ minHeight: '100px', resize: 'vertical' }}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default TextArea;
