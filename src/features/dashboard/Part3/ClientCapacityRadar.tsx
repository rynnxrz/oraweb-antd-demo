import React from 'react';
import { Typography, Row, Col, Space } from 'antd';
import ClientRisk from './ClientRisk';
import CapacityConcentration from './CapacityConcentration';
import WhiteSpaceMatrix from './WhiteSpaceMatrix';

const { Title, Text } = Typography;

const ClientCapacityRadar: React.FC = () => {
    return (
        <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <Title level={4} style={{ margin: 0, textTransform: 'uppercase', fontSize: 16 }}>
                    Part 3. Client & Capacity Radar
                </Title>
                <Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>Q3 2024 vs Q4 2024</Text>
                </Space>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <ClientRisk />
                </Col>
                <Col xs={24} lg={8}>
                    <CapacityConcentration />
                </Col>
                <Col xs={24}>
                    <WhiteSpaceMatrix />
                </Col>
            </Row>
        </section>
    );
};

export default ClientCapacityRadar;
