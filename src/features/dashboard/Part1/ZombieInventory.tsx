import React, { useState } from 'react';
import { Card, Segmented, Progress, Typography, theme } from 'antd';
import { WarningOutlined, ShopOutlined } from '@ant-design/icons';
import type { ZombieStats } from '../../../utils/dashboardAnalytics';

const { Text } = Typography;
const { useToken } = theme;

interface ZombieInventoryProps {
    data: ZombieStats;
}

const ZombieInventory: React.FC<ZombieInventoryProps> = ({ data }) => {
    const { token } = useToken();
    const [view, setView] = useState<'contracts' | 'inventory'>('contracts');

    return (
        <Card
            type="inner"
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <WarningOutlined style={{ color: token.colorTextQuaternary }} />
                    <span>P1-C. Zombie Inventory</span>
                </div>
            }
            extra={
                <Segmented
                    size="small"
                    options={[
                        { label: 'Contracts', value: 'contracts', icon: <WarningOutlined /> },
                        { label: 'Inventory', value: 'inventory', icon: <ShopOutlined /> }
                    ]}
                    value={view}
                    onChange={(val) => setView(val as 'contracts' | 'inventory')}
                />
            }
            style={{ height: '100%' }}
        >
            <div style={{ height: 300, overflowY: 'auto' }}>
                {view === 'contracts' ? (
                    <div>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            Inactive &gt; 30 days
                        </Text>
                        {data.items.map(item => (
                            <div key={item.id} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                                    <Text strong>{item.id} ({item.name})</Text>
                                    <Text style={{ color: token.colorError, fontWeight: 'bold' }}>{item.days}d</Text>
                                </div>
                                <Progress
                                    percent={Math.min(100, (item.days / 60) * 100)}
                                    showInfo={false}
                                    strokeColor={item.days > 90 ? token.colorError : token.colorWarning}
                                    railColor={token.colorFillSecondary}
                                    size="small"
                                    style={{ height: 8 }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            Total Stagnant Value: ${data.totalValue.toLocaleString()}
                        </Text>
                        {data.items.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    background: token.colorErrorBg,
                                    border: `1px solid ${token.colorErrorBorder}`,
                                    borderRadius: token.borderRadius,
                                    marginBottom: 8
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 12 }}>{item.sku}</div>
                                    <div style={{ fontSize: 10, color: token.colorError }}>Inactive {item.days}d</div>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: 12 }}>${item.amount.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ZombieInventory;
