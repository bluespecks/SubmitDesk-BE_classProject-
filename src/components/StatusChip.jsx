import React from 'react';

const StatusChip = ({ status }) => { // status: 'pending' | 'submitted' | 'graded' | 'late'
    const styles = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'capitalize',
    };

    const variants = {
        pending: { bg: '#FEF3C7', color: '#D97706' }, // amber
        submitted: { bg: '#DBEAFE', color: '#2563EB' }, // blue
        graded: { bg: '#D1FAE5', color: '#059669' }, // green
        late: { bg: '#FEE2E2', color: '#DC2626' }, // red
    };

    const variant = variants[status] || variants.pending;

    return (
        <span style={{ ...styles, backgroundColor: variant.bg, color: variant.color }}>
            {status}
        </span>
    );
};

export default StatusChip;
