import React from 'react';
import { Alert, Button, Typography, Space } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ContractEntryLatency: React.FC = () => {
    return (
        <Alert
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Space size={16}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#FFF7ED',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#EA580C'
                        }}>
                            <FieldTimeOutlined />
                        </div>
                        <div>
                            <Text strong style={{ display: 'block' }}>Contract Entry Latency</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>Approx. 15% of contracts are entered 3 days after signing.</Text>
                        </div>
                    </Space>
                    <Button size="small">View Details</Button>
                </div>
            }
            type="warning"
            showIcon={false}
            style={{ marginBottom: 24, border: '1px solid #fed7aa', background: '#fff7ed' }}
        />
    );
};

export default ContractEntryLatency;
