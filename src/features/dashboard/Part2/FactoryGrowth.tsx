import React from 'react';
import { Card, Row, Col, Typography, theme, Tooltip } from 'antd';
import { LineChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';

const { Text } = Typography;
const { useToken } = theme;

const FactoryGrowth: React.FC = () => {
    const { token } = useToken();
    const { q4Total, qoq, avgTime, vsBaseline } = DUMMY_DASHBOARD_DATA.leadTime.growth;

    // Mock growth trend data - simplified for CSS bar chart
    const data = [
        { name: 'Jan', uv: 2000 },
        { name: 'Feb', uv: 3000 },
        { name: 'Mar', uv: 2500 },
        { name: 'Apr', uv: 4000 },
        { name: 'May', uv: 3800 },
        { name: 'Jun', uv: 4500 },
        { name: 'Jul', uv: 5000 },
    ];

    const maxVal = Math.max(...data.map(d => d.uv));

    return (
        <Card
            title={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span><LineChartOutlined style={{ color: '#2A9D8F', marginRight: 8 }} /> G1. Factory Output & Efficiency</span>
                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 'normal' }}>Quarterly Shipping Trend</Text>
                </div>
            }
        >
            <Row gutter={24}>
                <Col xs={24} lg={18}>
                    <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0' }}>
                        {data.map((d, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <Tooltip title={`${d.name}: ${d.uv} Units`}>
                                    <div
                                        style={{
                                            width: '60%',
                                            background: '#2A9D8F',
                                            height: (d.uv / maxVal) * 150,
                                            borderRadius: '4px 4px 0 0',
                                            transition: 'height 0.3s'
                                        }}
                                    />
                                </Tooltip>
                                <span style={{ marginTop: 8, fontSize: 11, color: token.colorTextSecondary }}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </Col>
                <Col xs={24} lg={6}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, border: '1px solid #f0f0f0' }}>
                            <Text type="secondary" style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Total Q4 Output</Text>
                            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{q4Total}</div>
                            <div style={{ fontSize: 11, color: '#16a34a' }}><ArrowUpOutlined /> {qoq}% QoQ</div>
                        </div>
                        <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, border: '1px solid #f0f0f0' }}>
                            <Text type="secondary" style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Avg Lead Time</Text>
                            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{avgTime}d</div>
                            <div style={{ fontSize: 11, color: '#16a34a' }}><ArrowDownOutlined /> {Math.abs(vsBaseline)}d vs Base</div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default FactoryGrowth;
