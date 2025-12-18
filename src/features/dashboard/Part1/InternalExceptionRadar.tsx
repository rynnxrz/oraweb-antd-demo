import React from 'react';
import { Typography, Row, Col, Space, theme, Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import KPISummary from './KPISummary';
import KeyContractsOverview from './KeyContractsOverview';
import ZombieInventory from './ZombieInventory';
import DataQualityMonitor from './DataQualityMonitor';
import { MOCK_CONTRACT_DB } from '../../../data/mockContractDb';
import { calculateKPIs, getKeyContracts, getDataQualityStats, getZombieInventory } from '../../../utils/dashboardAnalytics';

const { Text } = Typography;

const { useToken } = theme;

const InternalExceptionRadar: React.FC = () => {
    const { token } = useToken();
    const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);

    // Filter Logic
    const handleFilterSelect = (id: string) => {
        setSelectedFilter(prev => prev === id ? null : id);
    };

    // Calculate Data derived from MOCK_CONTRACT_DB
    // In a real app, this would be useMemo or inside a query hook
    const kpiData = React.useMemo(() => calculateKPIs(MOCK_CONTRACT_DB), []);
    const keyContractsHook = React.useMemo(() => getKeyContracts(MOCK_CONTRACT_DB, selectedFilter || undefined), [selectedFilter]);
    const dataQualityStats = React.useMemo(() => getDataQualityStats(MOCK_CONTRACT_DB), []);
    const zombieStats = React.useMemo(() => getZombieInventory(MOCK_CONTRACT_DB), []);

    return (
        <Card
            title="PART 1. INTERNAL EXCEPTION RADAR"
            style={{ marginBottom: 32, boxShadow: token.boxShadowTertiary }}
            extra={
                <Space>
                    <InfoCircleOutlined style={{ color: token.colorTextDisabled }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>Click cards to filter details</Text>
                </Space>
            }
            styles={{ body: { padding: 24, backgroundColor: token.colorFillAlter } }}
        >
            <KPISummary
                kpis={kpiData}
                selectedFilter={selectedFilter}
                onFilterSelect={handleFilterSelect}
            />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <KeyContractsOverview contracts={keyContractsHook} />
                </Col>
                <Col xs={24} lg={8}>
                    <ZombieInventory data={zombieStats} />
                </Col>

                {/* Scroll target for Data Quality */}
                <Col xs={24} id="data-quality-monitor">
                    <DataQualityMonitor data={dataQualityStats} />
                </Col>
            </Row>
        </Card>
    );
};

export default InternalExceptionRadar;
