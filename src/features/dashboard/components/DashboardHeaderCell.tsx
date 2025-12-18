import React from 'react';
import { theme } from 'antd';
import styles from './DashboardTable.module.css';

const { useToken } = theme;

interface DashboardHeaderCellProps {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    isFirst?: boolean;
}

/**
 * Shared header cell content for consistency across DashboardTable and DashboardMatrix.
 * Handles text styling (12px bold secondary) and alignment.
 * Does NOT handle padding (that belongs to the container: th or div).
 */
const DashboardHeaderCell: React.FC<DashboardHeaderCellProps> = ({
    children,
    align = 'center',
    isFirst = false
}) => {
    const { token } = useToken();

    return (
        <div
            className={styles.headerText}
            style={{
                color: token.colorTextSecondary,
                textAlign: isFirst ? 'left' : align,
                // Only specialized padding for content alignment, not structural cell padding
                paddingLeft: isFirst ? 8 : 0
            }}
        >
            {children}
        </div>
    );
};

export default DashboardHeaderCell;
