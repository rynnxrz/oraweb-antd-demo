import React from 'react';
import { Card, Progress, theme } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';

const { useToken } = theme;

const PlanAdherence: React.FC = () => {
    const { token } = useToken();
    const data = DUMMY_DASHBOARD_DATA.leadTime.adherenceData;

    return (
        <Card
            title={
                <span><ScheduleOutlined style={{ color: '#16a34a', marginRight: 8 }} /> P3. Schedule Adherence</span>
            }
            style={{ height: '100%' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: 220, justifyContent: 'center', gap: 12, paddingRight: 24 }}>
                {data.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 80, fontSize: 11, color: token.colorTextSecondary }}>{item.x}</div>
                        <div style={{ flex: 1 }}>
                            <Progress
                                percent={item.y}
                                strokeColor="#2A9D8F"
                                size="small"
                                format={(percent) => <span style={{ fontSize: 10, color: token.colorTextSecondary }}>{percent}%</span>}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ padding: '0 8px', fontSize: 12, color: '#666' }}>
                Gummies and Capsules are stable; Powder shows delay.
            </div>
        </Card>
    );
};

export default PlanAdherence;
