import React from 'react';
import Card from './Card';
import StatusChip from './StatusChip';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/components/AssignmentCard.css';

const AssignmentCard = ({ assignment, role = 'student' }) => {
    const { _id, title, subject, deadline, status, description } = assignment;

    // Link destination based on role
    const linkTo = role === 'student'
        ? `/student/assignments/${_id}`
        : `/teacher/submissions?assignmentId=${_id}`;

    return (
        <Card className="assignment-card" padding="medium">
            <div className="assignment-header">
                <div className="assignment-info">
                    <span className="assignment-subject">{subject}</span>
                    <h3 className="assignment-title">{title}</h3>
                </div>
                <StatusChip status={status} />
            </div>

            <p className="assignment-description">{description}</p>

            <div className="assignment-footer">
                <div className="assignment-meta">
                    <div className="meta-item">
                        <Calendar size={16} />
                        <span>Due: {deadline ? new Date(deadline).toLocaleDateString() : 'No date'}</span>
                    </div>
                    {/* Optional time or other meta */}
                </div>

                <Link to={linkTo} className="view-btn">
                    View Details <ChevronRight size={16} />
                </Link>
            </div>
        </Card>
    );
};

export default AssignmentCard;
