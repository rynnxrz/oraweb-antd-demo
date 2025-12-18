import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Checkbox, Switch, Space, Divider, Input, Alert, Row, Col, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { useAppStore } from '../../../store/useAppStore';

const { Text } = Typography;

interface AddScheduleModalProps {
    visible: boolean;
    onCancel: () => void;
    contractId: string | undefined;
    defaultRoom?: string;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ visible, onCancel, contractId, defaultRoom }) => {
    const [form] = Form.useForm();
    const contracts = useAppStore(state => state.contracts);
    const machines = useAppStore(state => state.machines);
    const addSchedule = useAppStore(state => state.addSchedule);

    const contract = contracts.find(c => c.id === contractId);

    // Local state for dynamic logic
    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(defaultRoom);
    const [adjustDaily, setAdjustDaily] = useState(false);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [dailyQty, setDailyQty] = useState<number>(0);
    const [dailyOverrides, setDailyOverrides] = useState<Record<string, number>>({});
    const [includeWeekends, setIncludeWeekends] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setSelectedRoom(defaultRoom);
            setAdjustDaily(false);
            setDateRange(null);
            setDailyQty(0);
            setDailyOverrides({});
            setIncludeWeekends(false);

            form.setFieldsValue({
                room: defaultRoom,
            });
        }
    }, [visible, defaultRoom, contract, form]);

    const filteredMachines = machines.filter(m => m.room === selectedRoom);
    const rooms = Array.from(new Set(machines.map(m => m.room))).sort();

    // Helper to generate daily breakdown
    const generateDailyBreakdown = () => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) return [];

        const start = dateRange[0];
        const end = dateRange[1];
        const days = end.diff(start, 'day') + 1;
        const breakdown: { date: string, qty: number, isWeekend: boolean, displayDate: string }[] = [];

        for (let i = 0; i < days; i++) {
            const currentDate = start.add(i, 'day');
            const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;

            if (!includeWeekends && isWeekend) continue;

            const dateStr = currentDate.format('YYYY-MM-DD');
            const display = currentDate.format('MM/DD dd');
            const qty = dailyOverrides[dateStr] !== undefined ? dailyOverrides[dateStr] : dailyQty;

            breakdown.push({
                date: dateStr,
                displayDate: display,
                qty,
                isWeekend
            });
        }
        return breakdown;
    };

    const currentBreakdown = generateDailyBreakdown();
    const totalScheduled = currentBreakdown.reduce((sum, item) => sum + item.qty, 0);

    const handleOverrideChange = (date: string, val: number | null) => {
        setDailyOverrides(prev => ({ ...prev, [date]: val || 0 }));
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (!contractId || !dateRange) return;

            const scheduleData = {
                contractId,
                machineId: values.machine,
                startDate: dateRange[0].format('YYYY-MM-DD'),
                endDate: dateRange[1].format('YYYY-MM-DD'),
                dailyQuantities: currentBreakdown.map(d => ({ date: d.date, quantity: d.qty })),
                totalScheduled,
                notes: values.notes
            };

            addSchedule(scheduleData);
            onCancel();
        });
    };

    return (
        <Modal
            title={
                <Space>
                    <span>Schedule Production</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>{contract?.contractNo}</Text>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}
            width={700}
            okText={`Confirm Schedule (${totalScheduled.toLocaleString()})`}
        >
            <Form form={form} layout="vertical">
                {contract && (
                    <Alert
                        message={`${contract.productName} • Remaining: ${(contract.totalQty - contract.scheduledQty).toLocaleString()}`}
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Room" name="room" rules={[{ required: true }]}>
                            <Select onChange={setSelectedRoom} options={rooms.map(r => ({ label: r, value: r }))} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Machine" name="machine" rules={[{ required: true }]}>
                            <Select options={filteredMachines.map(m => ({ label: m.name, value: m.id }))} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Date Range" name="dateRange" rules={[{ required: true }]}>
                            <DatePicker.RangePicker onChange={(val) => setDateRange(val as [Dayjs, Dayjs])} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Daily Target Qty">
                            <InputNumber
                                style={{ width: '100%' }}
                                value={dailyQty}
                                onChange={(val) => setDailyQty(val || 0)}
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Notes" name="notes">
                    <Input.TextArea rows={2} placeholder="Production notes..." />
                </Form.Item>

                <Divider dashed />

                <Space align="center" style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
                    <Checkbox checked={includeWeekends} onChange={e => setIncludeWeekends(e.target.checked)}>Include Weekends</Checkbox>
                    <Space>
                        <span>Adjust Daily</span>
                        <Switch checked={adjustDaily} onChange={setAdjustDaily} />
                    </Space>
                </Space>

                {adjustDaily && dateRange && (
                    <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
                        {currentBreakdown.map(item => (
                            <div key={item.date} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                                <span style={{ color: item.isWeekend ? '#faad14' : 'inherit' }}>{item.displayDate}</span>
                                <InputNumber
                                    value={item.qty}
                                    onChange={(val) => handleOverrideChange(item.date, val)}
                                    style={{ width: 120 }}
                                />
                            </div>
                        ))}
                        {currentBreakdown.length === 0 && <Text type="secondary">Select date range to adjust daily qty.</Text>}
                    </div>
                )}
            </Form>
        </Modal>
    );
};
