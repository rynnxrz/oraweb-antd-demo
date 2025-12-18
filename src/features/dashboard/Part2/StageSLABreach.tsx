import React from 'react';
import { Card, Progress } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';


const StageSLABreach: React.FC = () => {
    // const { token } = useToken();
    const data = DUMMY_DASHBOARD_DATA.leadTime.breachData;

    return (
        <Card
            title={
                <span><BarChartOutlined style={{ color: '#ef4444', marginRight: 8 }} /> P2. SLA Breach Rate</span>
            }
            style={{ height: '100%' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: 180, justifyContent: 'center', gap: 16 }}>
                {data.map((item, index) => (
                    <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                            <span>{item.stage}</span>
                            <span style={{ color: item.color, fontWeight: 'bold' }}>{item.pct}%</span>
                        </div>
                        <Progress
                            percent={item.pct}
                            strokeColor={item.color}
                            showInfo={false}
                            size="small"
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 8, fontSize: 11 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Top Bottlenecks:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>1. Material</span> <span style={{ color: '#DC2626', fontWeight: 'bold' }}>68% Breach</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>2. Production</span> <span style={{ color: '#F97316', fontWeight: 'bold' }}>45% Breach</span>
                </div>
            </div>
        </Card>
    );
};

export default StageSLABreach;
