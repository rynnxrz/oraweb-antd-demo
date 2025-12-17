import React from 'react';
import { Card, Row, Col, Typography, Table, Tag } from 'antd';
import { ClockCircleOutlined, DollarOutlined, DropboxOutlined, DatabaseOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppStore } from '../store/useAppStore';

const { Title, Text } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
    const { topKpis, leadTimeData, zombieData, qualityData } = useAppStore(state => state.dashboardData || {});
    const contracts = useAppStore(state => state.contracts);

    // Filter "Problem" contracts for Key Contracts list
    const problemContracts = contracts.filter(c => c.stageInfo?.status === 'Blocker');

    const kpiIcons: any = {
        'clock': <ClockCircleOutlined style={{ fontSize: 24 }} />,
        'dollar': <DollarOutlined style={{ fontSize: 24 }} />,
        'box': <DropboxOutlined style={{ fontSize: 24 }} />,
        'database': <DatabaseOutlined style={{ fontSize: 24 }} />,
    };

    const columns = [
        { title: 'Contract', dataIndex: 'contractNo', key: 'contractNo', render: (t: string, r: any) => <div><b>{t}</b><br /><span style={{ fontSize: 10 }}>{r.client}</span></div> },
        { title: 'Stage', dataIndex: ['stageInfo', 'stage'], key: 'stage', render: (s: string) => <Tag>{s}</Tag> },
        { title: 'Delay', dataIndex: ['stageInfo', 'delayDays'], key: 'delay', render: (d: number) => <span style={{ color: 'red' }}>+{d}d</span> },
        { title: 'Status', key: 'status', render: () => <Tag color="red">Blocker</Tag> },
    ];

    return (
        <div style={{ padding: 0 }}>
            <div style={{ marginBottom: 20 }}>
                <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
                <Text type="secondary">Last Update: {new Date().toLocaleString()}</Text>
            </div>

            {/* Row 1: KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {topKpis?.map((kpi: any, idx: number) => (
                    <Col xs={24} sm={12} md={6} key={idx}>
                        <Card variant="borderless" styles={{ body: { padding: 20 } }} className="shadow-sm">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{kpi.title}</Text>
                                    <div style={{ fontSize: 28, fontWeight: 'bold', color: kpi.color, marginTop: 4 }}>
                                        {kpi.value} <span style={{ fontSize: 14, color: '#bfbfbf', fontWeight: 'normal' }}>/ {kpi.total}</span>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{kpi.subtitle}</Text>
                                </div>
                                <div style={{ color: kpi.color, background: `${kpi.color}20`, padding: 8, borderRadius: '50%' }}>
                                    {kpiIcons[kpi.icon]}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Row 2: Key Contracts & Zombie */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Key Contracts (Blockers)" variant="borderless" className="shadow-sm" style={{ height: '100%' }}>
                        <Table
                            dataSource={problemContracts}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Zombie Inventory" variant="borderless" className="shadow-sm" style={{ height: '100%' }}>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={zombieData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} style={{ fontSize: 11 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="days" fill="#ff4d4f" radius={[0, 4, 4, 0]} barSize={20} name="Inactive Days" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Row 3: Detail Analysis */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Cycle Time Analysis (Avg Days)" variant="borderless" className="shadow-sm">
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leadTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="days" fill="#2A9D8F" name="Actual" />
                                    <Bar dataKey="target" fill="#E9C46A" name="Target" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Data Quality Issues" variant="borderless" className="shadow-sm">
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={qualityData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {qualityData?.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {qualityData?.map((entry: any, index: number) => (
                                <Tag color={COLORS[index % COLORS.length]} key={index}>{entry.name}</Tag>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
