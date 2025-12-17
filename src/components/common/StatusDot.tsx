import React from 'react';
import { CheckCircleFilled, ClockCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { Tooltip, theme } from 'antd';

interface StatusDotProps {
    status?: string;
    mapping?: Record<string, 'success' | 'warning' | 'error'>;
}

const StatusDot: React.FC<StatusDotProps> = ({ status, mapping }) => {
    const { token } = theme.useToken();

    if (!status) {
        return <span style={{ color: token.colorTextPlaceholder }}>-</span>;
    }

    // Allow custom mapping override, otherwise use default logic
    let type: 'success' | 'warning' | 'error' | undefined;

    if (mapping) {
        type = mapping[status];
    } else {
        // Default logic extracted from legacy code
        if (['Done', 'Paid', 'Ready', 'success', 'Completed'].includes(status)) type = 'success';
        else if (['Issue', 'Missing', 'error'].includes(status)) type = 'error';
        else if (['Pending', 'Unpaid', 'warning'].includes(status)) type = 'warning';
    }

    const iconStyle = { fontSize: token.fontSizeLG }; // Optional: Adjust size to match design

    let icon = null;
    let color = token.colorTextPlaceholder;

    switch (type) {
        case 'success':
            icon = <CheckCircleFilled />;
            color = token.colorSuccess;
            break;
        case 'error':
            icon = <ExclamationCircleFilled />;
            color = token.colorError;
            break;
        case 'warning':
            icon = <ClockCircleFilled />;
            color = token.colorWarning;
            break;
        default:
            // Fallback for unknown statuses if not specifically handled above, 
            // essentially treating them as "neutral" or just text.
            // But based on reqs, we might just want to show the text or a dash if no match?
            // The original code returned "-" for non-matches.
            // let's stick to the dash if no type is found, or maybe just a dot?
            // The original code: return <span style={{ color: '#d9d9d9' }}>-</span>;
            return <span style={{ color: token.colorTextPlaceholder }}>-</span>;
    }

    return (
        <Tooltip title={status}>
            <span style={{ color, ...iconStyle }}>{icon}</span>
        </Tooltip>
    );
};

export default StatusDot;
