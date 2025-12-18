import React from 'react';
import { ConfigProvider, Table, theme } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import DashboardHeaderCell from './DashboardHeaderCell';
import styles from './DashboardTable.module.css';

const { useToken } = theme;

export interface DashboardTableProps<T> extends Omit<TableProps<T>, 'pagination' | 'size' | 'scroll'> {
    dataSource: T[];
    columns: ColumnsType<T>;
    rowKey: string;
    height?: number;
}

/**
 * DashboardTable - A styled wrapper for Ant Design Table.
 * 
 * Features:
 * - Consistent header styling (12px bold, white bg, secondary text color).
 * - Fixed height with scrollable body and sticky header.
 * - First column left-aligned with padding.
 * 
 * Usage:
 * ```tsx
 * <DashboardTable
 *     dataSource={contracts}
 *     columns={columns}
 *     rowKey="id"
 *     height={240}
 * />
 * ```
 */
function DashboardTable<T extends object>({
    dataSource,
    columns,
    rowKey,
    height = 240,
    ...restProps
}: DashboardTableProps<T>) {
    const { token } = useToken();



    // Apply consistent styling to columns
    const styledColumns: ColumnsType<T> = columns.map((col, index) => ({
        ...col,
        title: (
            <DashboardHeaderCell isFirst={index === 0} align={col.align as any}>
                {col.title as React.ReactNode}
            </DashboardHeaderCell>
        ),
        // Add left padding to first column cells
        className: index === 0 ? styles.cellFirst : styles.cell,
    }));

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBg: token.colorBgContainer,
                        headerColor: token.colorTextSecondary,
                        headerSplitColor: token.colorSplit,
                        cellPaddingBlockSM: 8,
                        cellPaddingInlineSM: 8,
                    }
                }
            }}
        >
            <Table<T>
                dataSource={dataSource}
                columns={styledColumns}
                rowKey={rowKey}
                pagination={false}
                size="small"
                scroll={{ y: height }}
                {...restProps}
            />
        </ConfigProvider>
    );
}

export default DashboardTable;
