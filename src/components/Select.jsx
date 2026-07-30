import React from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/components/Input.css'; // Reusing input styles

const Select = ({ label, error, options = [], className = '', ...props }) => {
    const selectId = props.id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={selectId} className="input-label">{label}</label>}
            <div className="select-wrapper" style={{ position: 'relative' }}>
                <select
                    id={selectId}
                    className={`input-field ${error ? 'input-error' : ''} select-field`}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'var(--text-secondary)'
                    }}
                />
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Select;
