import React from 'react';
import { Card, Row, Col, Typography, theme, Progress, Tag, Space } from 'antd';
import { DatabaseOutlined, CalendarOutlined, WarningOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataQualityStat } from '../../../utils/dashboardAnalytics';
import DashboardTable from '../components/DashboardTable';

const { Text } = Typography;
const { useToken } = theme;

interface DataQualityMonitorProps {
    data: DataQualityStat;
}

interface IssueRow {
    id: string;
    product: string;
    issue: string;
    icon: string;
    color: string;
    time: string;
    user: string;
}

const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({ data }) => {
    const { token } = useToken();
    const { issues, issueTypes, score } = data;

    const columns: ColumnsType<IssueRow> = [
        {
            title: 'Contract / Product',
            dataIndex: 'id',
            key: 'id',
            render: (text: string, record: IssueRow) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: 10, color: token.colorTextSecondary }}>{record.product}</div>
                </div>
            )
        },
        {
            title: 'Issue',
            dataIndex: 'issue',
            key: 'issue',
            render: (text: string, record: IssueRow) => {
                let icon = <ExclamationCircleOutlined />;
                if (record.icon === 'calendar-times') icon = <CalendarOutlined />;
                if (record.icon === 'scale') icon = <WarningOutlined />;
                if (record.icon === 'clock') icon = <ClockCircleOutlined />;

                return (
                    <Space size={4} style={{ color: record.color === 'red' ? token.colorError : (record.color === 'orange' ? token.colorWarning : token.colorTextSecondary) }}>
                        {icon}
                        <span style={{ fontSize: 12 }}>{text}</span>
                    </Space>
                )
            }
        },
        {
            title: 'Update',
            dataIndex: 'time',
            key: 'time',
            width: 80,
            render: (text: string, record: IssueRow) => (
                <div style={{ fontSize: 10, color: token.colorTextSecondary, lineHeight: 1.2 }}>
                    {text}<br />by {record.user}
                </div>
            )
        }
    ];

    return (
        <Card
            type="inner"
            title={
                <span><DatabaseOutlined style={{ color: '#722ED1', marginRight: 8 }} /> P1-D. Data Quality</span>
            }
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Last Update: 10m ago</Text>}
            style={{ height: '100%' }}
        >
            <Row gutter={24} style={{ height: '100%' }}>
                <Col span={24} lg={12}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                            {/* Chart 1: Good vs Bad */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Progress
                                    type="circle"
                                    percent={score}
                                    strokeColor="#2A9D8F"
                                    size={100}
                                    format={(percent) => (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -4 }}>
                                            <span style={{ fontSize: 20, fontWeight: 'bold', color: token.colorText }}>{percent}%</span>
                                            <span style={{ fontSize: 10, color: token.colorTextSecondary }}>Completeness</span>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Chart 2: Issue Types (Simulated with Progress bars) */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                                {issueTypes.map((type: any) => (
                                    <div key={type.name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                                            <Text style={{ color: token.colorText }}>{type.name}</Text>
                                            <Text style={{ fontWeight: 'bold' }}>{type.value}</Text>
                                        </div>
                                        <Progress
                                            percent={(type.value / 10) * 100} // Mock scales
                                            showInfo={false}
                                            strokeColor={type.color}
                                            size="small"
                                            steps={5}
                                            strokeWidth={6}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginTop: 16, fontSize: 10, color: token.colorTextSecondary, textAlign: 'center', background: token.colorFillQuaternary, padding: 8, borderRadius: token.borderRadiusSM }}>
                            <ExclamationCircleOutlined /> Note: Issues can overlap per contract.
                        </div>
                    </div>
                </Col>
                <Col span={24} lg={12}>
                    <div style={{
                        border: `1px solid ${token.colorBorderSecondary}`,
                        borderRadius: token.borderRadiusLG,
                        overflow: 'hidden',
                        height: '100%'
                    }}>
                        <div style={{
                            background: token.colorBgContainer,
                            padding: '8px 12px',
                            fontSize: 12,
                            fontWeight: 'bold',
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <span>Issue List</span>
                            <Tag style={{ margin: 0, fontSize: 10, lineHeight: '18px' }} variant="filled">All Issues</Tag>
                        </div>
                        <DashboardTable<IssueRow>
                            dataSource={issues as IssueRow[]}
                            columns={columns}
                            rowKey="id"
                            height={160}
                        />
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default DataQualityMonitor;

