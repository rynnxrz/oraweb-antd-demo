import React, { useState, useMemo } from 'react';
import { Card, Segmented, Tag, theme } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { KeyContractView } from '../../../utils/dashboardAnalytics';
import DashboardTable from '../components/DashboardTable';
import DashboardMatrix, { type MatrixRow } from '../components/DashboardMatrix';

const { useToken } = theme;

interface KeyContractsOverviewProps {
    contracts: KeyContractView[];
}

/**
 * P1-B. Key Contracts Overview
 * 
 * Displays key contracts in two views:
 * - List View: Table with contract details.
 * - Matrix View: Stage-based grid visualization.
 * 
 * Uses DashboardTable and DashboardMatrix for consistent styling.
 */
const KeyContractsOverview: React.FC<KeyContractsOverviewProps> = ({ contracts }) => {
    const { token } = useToken();
    const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

    // ===== List View Columns =====
    const columns: ColumnsType<KeyContractView> = [
        {
            title: 'Contract / Brand',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: 10, color: token.colorTextSecondary }}>{record.client}</div>
                </div>
            )
        },
        {
            title: 'Current Stage',
            dataIndex: 'stage',
            key: 'stage',
            render: (text) => <Tag variant="filled" style={{ background: token.colorFillSecondary }}>{text}</Tag>
        },
        {
            title: 'Delay',
            dataIndex: 'delay',
            key: 'delay',
            render: (text) => <span style={{ color: token.colorError, fontWeight: 'bold' }}>+{text}d</span>
        },
        {
            title: 'Status / Reason',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                let color = 'default';
                if (record.category === 'money') color = 'error';
                if (record.category === 'materials') color = 'warning';
                return (
                    <Tag color={color} variant="filled">
                        {text}
                    </Tag>
                );
            }
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            align: 'right',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: 10, color: token.colorTextSecondary }}>{record.lastUpdate}</div>
                </div>
            )
        }
    ];

    // ===== Matrix View Data Transformation =====
    const matrixHeaders = ['Contract', 'S1 Money', 'S2 Mat', 'S3 Wait', 'S4 Prod', 'S5 Ship'];
    const stages = ['S1', 'S2', 'S3', 'S4', 'S5'];

    const matrixRows: MatrixRow[] = useMemo(() => {
        return contracts.map(item => {
            const currentStageIdx = stages.findIndex(s => item.stage.includes(s));

            const cells = stages.map((stage, idx) => {
                const isCurrentStage = item.stage.includes(stage);
                let bg = token.colorFillQuaternary;
                let color = token.colorText;
                let value: React.ReactNode = null;

                if (isCurrentStage && item.delay > 0) {
                    if (item.category === 'money') bg = token.colorError;
                    else if (item.category === 'materials') bg = token.colorWarning;
                    else bg = token.colorError;
                    color = '#fff';
                    value = (
                        <div style={{ lineHeight: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>+{item.delay}</div>
                            <div style={{ fontSize: 8, opacity: 0.9 }}>{stage}</div>
                        </div>
                    );
                } else if (idx < currentStageIdx) {
                    bg = token.colorSuccess;
                    color = '#fff';
                    value = <b>OK</b>;
                }

                return { value, bg, color };
            });

            return {
                id: item.id,
                label: { primary: item.contractNo, secondary: item.client },
                cells
            };
        });
    }, [contracts, token]);

    return (
        <Card
            type="inner"
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AppstoreOutlined />
                    <span>P1-B. Key Contracts Overview</span>
                    <Segmented
                        size="small"
                        options={[
                            { value: 'list', icon: <UnorderedListOutlined /> },
                            { value: 'graph', icon: <AppstoreOutlined /> }
                        ]}
                        value={viewMode}
                        onChange={(val: any) => setViewMode(val)}
                    />
                </div>
            }
            style={{ height: '100%', marginBottom: 0 }}
            styles={{ body: { padding: 0 } }}
        >
            {viewMode === 'list' ? (
                <DashboardTable<KeyContractView>
                    dataSource={contracts}
                    columns={columns}
                    rowKey="id"
                    height={240}
                />
            ) : (
                <DashboardMatrix
                    headers={matrixHeaders}
                    rows={matrixRows}
                    height={280}
                />
            )}
        </Card>
    );
};

export default KeyContractsOverview;
