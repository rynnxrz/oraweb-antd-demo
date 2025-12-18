import React from 'react';
import { Button, Select, Space, Typography, theme } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import InternalExceptionRadar from './Part1/InternalExceptionRadar';
import LeadTimeDeepDive from './Part2/LeadTimeDeepDive';
import ClientCapacityRadar from './Part3/ClientCapacityRadar';
import { BRAND_OPTIONS, DATE_RANGE_OPTIONS, LINE_OPTIONS } from '../../constants/dashboardOptions';

const { Title, Text } = Typography;
const { useToken } = theme;

const DashboardLayout: React.FC = () => {
    const { token } = useToken();

    return (
        <div style={{ background: token.colorBgLayout }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <Title level={3} style={{ margin: 0 }}>Client & Process Insights</Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>Last Update: 2024-11-28 09:00 AM</Text>
                        </div>

                        <Space wrap>
                            <Select
                                defaultValue="q4"
                                style={{ width: 220 }}
                                size="small"
                                options={DATE_RANGE_OPTIONS}
                            />
                            <Select
                                defaultValue="all"
                                style={{ width: 140 }}
                                size="small"
                                options={BRAND_OPTIONS}
                            />
                            <Select
                                defaultValue="all"
                                style={{ width: 140 }}
                                size="small"
                                options={LINE_OPTIONS}
                            />
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                size="small"
                                style={{
                                    fontWeight: 'bold'
                                }}
                            >
                                Refresh Data
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>

            {/* Part 1: Internal Exception Radar */}
            <InternalExceptionRadar />

            {/* Part 2: Lead Time Deep Dive */}
            <LeadTimeDeepDive />

            {/* Part 3: Client & Capacity Radar */}
            <ClientCapacityRadar />
        </div>
    );
};

export default DashboardLayout;
