import React from 'react';
import { Card, Tag, Typography, Progress } from 'antd';
import { UserSwitchOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';
import type { ColumnsType } from 'antd/es/table';
import DashboardTable from '../components/DashboardTable';

const { Text } = Typography;

interface ClientRiskRow {
    brand: string;
    status: string;
    statusType: string;
    q3: string;
    q4: string;
}

const ClientRisk: React.FC = () => {
    const { chartData, table } = DUMMY_DASHBOARD_DATA.clientRisk;

    const columns: ColumnsType<ClientRiskRow> = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (text: string) => <b>{text}</b>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: string, record: ClientRiskRow) => (
                <Tag color={record.statusType}>{text}</Tag>
            )
        },
        {
            title: 'Qty (Q3 vs Q4)',
            key: 'qty',
            align: 'right',
            render: (_: unknown, record: ClientRiskRow) => (
                <div style={{ color: '#999' }}>
                    {record.q3} <ArrowRightOutlined style={{ margin: '0 4px', fontSize: 10 }} />
                    <span style={{ color: record.statusType === 'red' || record.statusType === 'orange' ? record.statusType : '#333', fontWeight: 'bold' }}>
                        {record.q4}
                    </span>
                </div>
            )
        }
    ];

    return (
        <Card
            title={
                <span><UserSwitchOutlined style={{ color: '#2A9D8F', marginRight: 8 }} /> 3A. Client Risk Warning</span>
            }
            style={{ height: '100%' }}
        >
            <div style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                {chartData.map((item, index) => (
                    <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                            <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                            <span style={{ fontSize: 10 }}>{item.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ flex: 1 }}>
                                <Progress
                                    percent={item.q3}
                                    strokeColor="#e5e5e5"
                                    showInfo={false}
                                    size="small"
                                />
                                <div style={{ fontSize: 9, color: '#999', textAlign: 'right' }}>Q3</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Progress
                                    percent={item.q4}
                                    strokeColor="#2A9D8F"
                                    showInfo={false}
                                    size="small"
                                />
                                <div style={{ fontSize: 9, color: '#2A9D8F', textAlign: 'right' }}>Q4</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 16 }}>
                <DashboardTable<ClientRiskRow>
                    dataSource={table as ClientRiskRow[]}
                    columns={columns}
                    rowKey="brand"
                    height={150}
                />
            </div>

            <div style={{ marginTop: 8, textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 10 }}>Based on quarterly volume comparison</Text>
            </div>
        </Card>
    );
};

export default ClientRisk;

