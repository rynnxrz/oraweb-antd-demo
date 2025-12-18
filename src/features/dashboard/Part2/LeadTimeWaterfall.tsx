import React from 'react';
import { Card, Typography, theme, Tooltip } from 'antd';
import { BuildOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';

const { Text } = Typography;
const { useToken } = theme;

const LeadTimeWaterfall: React.FC = () => {
    const { token } = useToken();
    const data = DUMMY_DASHBOARD_DATA.leadTime.waterfall;
    const avgDays = DUMMY_DASHBOARD_DATA.leadTime.avgDays;

    // Filter out 'Start' filler for better visualization if needed, or keep it.
    // Assuming 'Start' is 0, let's just render the bars.
    // Calculate max value for scaling
    const maxDay = Math.max(...data.map(d => d.days)) || 20;

    return (
        <Card
            title={
                <span><BuildOutlined style={{ color: '#2A9D8F', marginRight: 8 }} /> 3B. Process Efficiency</span>
            }
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Avg Days</Text>}
            style={{ height: '100%' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: 220, justifyContent: 'space-around', padding: '10px 0' }}>
                {data.filter(d => d.stage !== 'Start').map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ width: 80, fontSize: 11, textAlign: 'right', marginRight: 8, color: token.colorTextSecondary }}>
                            {item.stage}
                        </div>
                        <Tooltip title={`${item.days} days`}>
                            <div
                                style={{
                                    height: 20,
                                    background: item.fill,
                                    width: `${(item.days / maxDay) * 80}%`, // simple scaling, max extends to 80% width
                                    borderRadius: '0 4px 4px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 8,
                                    fontSize: 10,
                                    color: '#fff',
                                    minWidth: 20, // ensure visible text
                                    transition: 'width 0.5s ease-in-out'
                                }}
                            >
                                {item.days}d
                            </div>
                        </Tooltip>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <Text strong>Median Cycle: {avgDays} days</Text>
                <Text type="secondary">Based on finished contracts</Text>
            </div>
        </Card>
    );
};

export default LeadTimeWaterfall;
