import React from 'react';
import { theme } from 'antd';
import DashboardHeaderCell from './DashboardHeaderCell';
import styles from './DashboardTable.module.css';

const { useToken } = theme;

export interface MatrixCell {
    value: React.ReactNode;
    bg?: string;
    color?: string;
}

export interface MatrixRow {
    id: string;
    label: {
        primary: string;
        secondary?: string;
    };
    cells: MatrixCell[];
}

export interface DashboardMatrixProps {
    headers: string[];
    rows: MatrixRow[];
    height?: number;
}

/**
 * DashboardMatrix - A grid-based visualization component for stage data.
 * 
 * Features:
 * - Consistent header styling matching DashboardTable.
 * - Sticky header with scrollable body.
 * - Flexible cell rendering with customizable backgrounds.
 * 
 * Usage:
 * ```tsx
 * <DashboardMatrix
 *     headers={['Contract', 'S1 Money', 'S2 Mat', 'S3 Wait', 'S4 Prod', 'S5 Ship']}
 *     rows={[
 *         { id: 'C24-001', label: { primary: 'C24-001', secondary: 'BrandX' }, cells: [...] }
 *     ]}
 *     height={280}
 * />
 * ```
 */
const DashboardMatrix: React.FC<DashboardMatrixProps> = ({ headers, rows, height = 280 }) => {
    const { token } = useToken();

    // Generate grid template columns based on headers
    const gridTemplateColumns = `1.5fr repeat(${headers.length - 1}, 1fr)`;

    return (
        <div style={{ height, overflowY: 'auto' }}>

            {/* Header Row */}
            <div
                className={`${styles.matrixGrid} ${styles.header}`}
                style={{
                    gridTemplateColumns,
                    backgroundColor: token.colorBgContainer, // Bg color via token
                    borderBottom: `1px solid ${token.colorSplit}`
                    // No vertical padding on container! Cells handle it via .headerCell css (which is now 8px)
                }}
            >
                {headers.map((header, index) => (
                    <div
                        key={header}
                        className={index === 0 ? styles.headerCellFirst : styles.headerCell}
                    >
                        <DashboardHeaderCell isFirst={index === 0}>
                            {header}
                        </DashboardHeaderCell>
                    </div>
                ))}
            </div>

            {/* Data Rows */}
            {rows.map(row => (
                <div
                    key={row.id}
                    className={styles.matrixGrid}
                    style={{
                        gridTemplateColumns,
                        padding: '8px 0',
                        borderBottom: `1px solid ${token.colorSplit}`
                    }}
                >
                    {/* Label Cell (First Column) */}
                    <div className={styles.labelCell}>
                        <div className={styles.labelPrimary}>{row.label.primary}</div>
                        {row.label.secondary && (
                            <div className={styles.labelSecondary} style={{ color: token.colorTextSecondary }}>
                                {row.label.secondary}
                            </div>
                        )}
                    </div>

                    {/* Stage Cells */}
                    {row.cells.map((cell, cellIndex) => (
                        <div
                            key={cellIndex}
                            className={styles.matrixCell}
                            style={{
                                backgroundColor: cell.bg || token.colorFillQuaternary,
                                color: cell.color || token.colorText,
                                borderRadius: token.borderRadiusSM
                            }}
                        >
                            {cell.value}
                        </div>
                    ))}
                </div>
            ))}

            {/* Footer */}
            <div style={{ marginTop: 16, textAlign: 'center', color: token.colorTextSecondary, fontSize: 10 }}>
                Colored cells indicate days exceeded internal target.
            </div>
        </div>
    );
};

export default DashboardMatrix;
