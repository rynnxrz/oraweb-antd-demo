import React from 'react';
import { Card, Typography, List, Progress } from 'antd';
import { DropboxOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';

const { Text } = Typography;

const MaterialsPreparation: React.FC = () => {
    const { readyPct, risks } = DUMMY_DASHBOARD_DATA.leadTime.materialRisk;

    return (
        <Card
            title={
                <span><DropboxOutlined style={{ color: '#E9C46A', marginRight: 8 }} /> P4. Material Readiness</span>
            }
            style={{ height: '100%' }}
        >
            <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Progress
                    type="dashboard"
                    percent={readyPct}
                    strokeColor="#E9C46A"
                    gapDegree={120}
                    format={(percent) => (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</span>
                            <span style={{ fontSize: 10, color: '#999' }}>Ready</span>
                        </div>
                    )}
                />
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                <Text strong style={{ fontSize: 12 }}>Risk Batches</Text>
                <List
                    size="small"
                    dataSource={risks}
                    renderItem={item => (
                        <List.Item style={{ padding: '4px 0', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 11 }}>
                                <Text>{item.id} ({item.type})</Text>
                                <Text type="danger" strong>{item.gap}d</Text>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </Card>
    );
};

export default MaterialsPreparation;
