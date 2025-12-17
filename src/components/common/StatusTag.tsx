import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
    status: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
    let color = 'default';

    // Red Scope: Critical / Pending Action
    const errorStatuses = [
        'New Contract',
        'Pending Preparation',
        'Pending Scheduling',
        'Pending Production',
        'Pending Shipping',
        'Missing',
        'Issue'
    ];

    // Yellow Scope: In Progress
    const warningStatuses = [
        'On-Going Production',
        'On-Going Shipping',
        'Pending' // Fallback for generic pending
    ];

    // Green Scope: Completed
    const successStatuses = [
        'Done',
        'Completed',
        'Ready'
    ];

    // Blue Scope: Active / Processing (Optional, if needed for "On-Going" preference over yellow)
    const processingStatuses = [
        'Production'
    ];

    if (errorStatuses.includes(status)) {
        color = 'error';
    } else if (warningStatuses.includes(status)) {
        color = 'warning';
    } else if (successStatuses.includes(status)) {
        color = 'success';
    } else if (processingStatuses.includes(status)) {
        color = 'processing';
    }

    return <Tag color={color} style={{ margin: 0 }}>{status}</Tag>;
};

export default StatusTag;
