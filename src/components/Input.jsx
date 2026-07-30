import React from 'react';
import '../styles/components/Input.css';

const Input = ({ label, error, className = '', id, ...props }) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`form-control ${className}`} style={{ width: '100%' }}>
            <input
                id={inputId}
                className={error ? 'input-error' : ''}
                required
                {...props}
            />
            {label && (
                <label htmlFor={inputId}>
                    {label.split('').map((char, index) => (
                        <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </label>
            )}
            {error && <div className="input-error-message" style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '5px' }}>{error}</div>}
        </div>
    );
};

export default Input;
