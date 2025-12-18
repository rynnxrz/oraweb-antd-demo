import React from 'react';
import { Typography, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import ContractEntryLatency from './ContractEntryLatency';
import LeadTimeWaterfall from './LeadTimeWaterfall';
import StageSLABreach from './StageSLABreach';
import PlanAdherence from './PlanAdherence';
import MaterialsPreparation from './MaterialsPreparation';
import FactoryGrowth from './FactoryGrowth';

const { Title, Text } = Typography;

const LeadTimeDeepDive: React.FC = () => {
    return (
        <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <Title level={4} style={{ margin: 0, textTransform: 'uppercase', fontSize: 16 }}>
                    Part 2. Lead Time Deep Dive
                </Title>
                <Space>
                    <InfoCircleOutlined style={{ color: '#ccc' }} />
                    <Text type="secondary" italic style={{ fontSize: 12 }}>Process Cycle vs Target</Text>
                </Space>
            </div>

            <ContractEntryLatency />

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <LeadTimeWaterfall />
                </Col>
                <Col xs={24} lg={8}>
                    <StageSLABreach />
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <PlanAdherence />
                </Col>
                <Col xs={24} lg={8}>
                    <MaterialsPreparation />
                </Col>
            </Row>

            <FactoryGrowth />
        </section>
    );
};

export default LeadTimeDeepDive;
