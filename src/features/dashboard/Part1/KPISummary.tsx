import React from 'react';
import { Col, Row, Typography, theme } from 'antd';
import { ClockCircleOutlined, DollarOutlined, DropboxOutlined, DatabaseOutlined, ArrowUpOutlined } from '@ant-design/icons';
import type { DashboardKPI } from '../../../utils/dashboardAnalytics';
import StatusDot from '../../../components/common/StatusDot';

const { Text } = Typography;
const { useToken } = theme;

const ICON_MAP: any = {
    clock: <ClockCircleOutlined />,
    dollar: <DollarOutlined />,
    box: <DropboxOutlined />,
    database: <DatabaseOutlined />,
};

interface KPISummaryProps {
    kpis: DashboardKPI[];
    selectedFilter: string | null;
    onFilterSelect: (id: string) => void;
}

const KPISummary: React.FC<KPISummaryProps> = ({ kpis, selectedFilter, onFilterSelect }) => {
    const { token } = useToken();

    const getStatusColor = (type: string) => {
        switch (type) {
            case 'bad': return token.colorError;
            case 'warning': return token.colorWarning;
            case 'good': return token.colorSuccess;
            default: return token.colorTextSecondary;
        }
    };

    const getStatusDotStatus = (type: string): 'error' | 'warning' | 'success' | 'default' => {
        switch (type) {
            case 'bad': return 'error';
            case 'warning': return 'warning';
            case 'good': return 'success';
            default: return 'default';
        }
    };

    const getStatusBg = (type: string) => {
        switch (type) {
            case 'bad': return token.colorErrorBg;
            case 'warning': return token.colorWarningBg;
            case 'good': return token.colorSuccessBg;
            default: return token.colorFillTertiary;
        }
    };

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {kpis.map((kpi) => {
                const color = getStatusColor(kpi.trendType);
                const bg = getStatusBg(kpi.trendType);
                const isActive = selectedFilter === kpi.id;

                return (
                    <Col xs={24} sm={12} md={6} key={kpi.id}>
                        <div
                            onClick={() => onFilterSelect(kpi.id)}
                            style={{
                                backgroundColor: token.colorFillQuaternary,
                                borderRadius: token.borderRadiusLG,
                                padding: 16,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: isActive ? `1px solid ${token.colorPrimary}` : `1px solid transparent`,
                                height: '100%',
                            }}
                            className="kpi-card-hover"
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = token.colorFillTertiary}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = token.colorFillQuaternary}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <StatusDot status={getStatusDotStatus(kpi.trendType)} />
                                        <Text strong style={{ fontSize: 13, display: 'block' }}>{kpi.title}</Text>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: 14 }}>
                                        {kpi.subtitle}
                                    </Text>
                                    <div style={{ fontSize: 22, fontWeight: 'bold', color: color, marginTop: 6, paddingLeft: 14 }}>
                                        {kpi.value} <span style={{ fontSize: 13, color: token.colorTextQuaternary, fontWeight: 'normal' }}>
                                            {kpi.total > 0 ? `/ ${kpi.total}` : kpi.unit}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: bg,
                                    color: color,
                                    padding: 6,
                                    borderRadius: '50%',
                                    fontSize: 18,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 32,
                                    height: 32
                                }}>
                                    {ICON_MAP[kpi.icon]}
                                </div>
                            </div>

                            <div style={{ marginTop: 8, fontSize: 12, paddingLeft: 14 }}>
                                {kpi.trend.includes('vs last') ? (
                                    <Text type={kpi.trendType === 'bad' ? 'danger' : 'success'} strong>
                                        <ArrowUpOutlined rotate={kpi.trendType === 'good' ? 0 : 180} /> {kpi.trend}
                                    </Text>
                                ) : (
                                    <Text style={{ color: kpi.trendType === 'warning' ? token.colorWarning : token.colorTextSecondary }}>
                                        {kpi.trend}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </Col>
                );
            })}
        </Row>
    );
};

export default KPISummary;
