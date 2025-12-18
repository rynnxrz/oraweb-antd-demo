import React from 'react';
import { Card, Progress } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';

const CapacityConcentration: React.FC = () => {
    // Only taking top 3 value for the progress circle to represent concentration
    const top3Value = DUMMY_DASHBOARD_DATA.concentration.data.find(d => d.name === 'Top 3 Clients')?.value || 0;

    return (
        <Card
            title={
                <span><PieChartOutlined style={{ color: '#6c757d', marginRight: 8 }} /> 3C. Capacity Concentration</span>
            }
            style={{ height: '100%' }}
        >
            <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Progress
                    type="circle"
                    percent={top3Value}
                    strokeColor="#2A9D8F"
                    format={(percent) => (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</span>
                            <span style={{ fontSize: 10, color: '#999' }}>Top 3 Focus</span>
                        </div>
                    )}
                />
            </div>
            <div style={{ marginTop: 16, borderLeft: '2px solid #E76F51', paddingLeft: 8, fontSize: 12 }}>
                <span style={{ color: '#E76F51', fontWeight: 'bold' }}>High Risk:</span> Top 3 clients occupy {top3Value}% of capacity.
            </div>
        </Card>
    );
};

export default CapacityConcentration;
