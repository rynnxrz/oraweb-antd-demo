import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Button, Space, DatePicker, Typography } from 'antd';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { SchedulingSidebar } from '../layouts/SchedulingSidebar';
import { ScheduleMatrix } from '../features/scheduling/components/ScheduleMatrix';
import { AddScheduleModal } from '../features/scheduling/components/AddScheduleModal';
import { useAppStore } from '../store/useAppStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const Scheduling: React.FC = () => {
    const { contractId } = useParams<{ contractId: string }>();
    const contracts = useAppStore(state => state.contracts);
    const contract = contracts.find(c => c.id === contractId);

    // Default room based on history or first available? For now hardcode or use Sidebar default
    const [selectedRoom, setSelectedRoom] = useState<string>(''); // Sidebar will set default
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewDate, setViewDate] = useState(dayjs());

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#fff' }}>
            <Sider width={250} theme="light">
                <SchedulingSidebar selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} />
            </Sider>
            <Content style={{ padding: 24, overflowY: 'auto' }}>
                {/* Top Bar */}
                <div style={{ paddingBottom: 24, borderBottom: '1px solid #f0f0f0', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <Space align="center" style={{ marginBottom: 8 }}>
                                <Button icon={<LeftOutlined />} href="#/contracts" type="text" />
                                <Title level={4} style={{ margin: 0 }}>
                                    {contract ? `${contract.contractNo} - ${contract.client}` : 'Production Schedule'}
                                </Title>
                            </Space>
                            {contract && (
                                <Space size="large" style={{ marginLeft: 40 }}>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>PRODUCT</Text>
                                        <div style={{ fontWeight: 500 }}>{contract.productName}</div>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>PROGRESS</Text>
                                        <div style={{ fontWeight: 500, color: contract.scheduledQty >= contract.totalQty ? '#52c41a' : '#2A9D8F' }}>
                                            {contract.scheduledQty.toLocaleString()} / {contract.totalQty.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>STATUS</Text>
                                        <div>{contract.status}</div>
                                    </div>
                                </Space>
                            )}
                        </div>
                        <Space>
                            <DatePicker picker="week" defaultValue={viewDate} onChange={(d) => d && setViewDate(d)} />
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} disabled={!contract || !selectedRoom}>
                                Add Schedule
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* Matrix */}
                <div style={{ marginBottom: 16 }}>
                    <Text strong>{selectedRoom || 'Select a Room'}</Text>
                </div>
                {selectedRoom && (
                    <ScheduleMatrix room={selectedRoom} startDate={viewDate.startOf('isoWeek').format('YYYY-MM-DD')} />
                )}

                {/* Modal */}
                <AddScheduleModal
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    contractId={contractId}
                    defaultRoom={selectedRoom}
                />
            </Content>
        </Layout>
    );
};

export default Scheduling;
