import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Segmented, Input, Select, Tooltip, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, ClockCircleFilled, ExclamationCircleFilled, AppstoreOutlined, DollarOutlined, DropboxOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import type { Contract } from '../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;

const ContractList: React.FC = () => {
    const contracts = useAppStore((state) => state.contracts);
    const navigate = useNavigate();

    // -- State --
    // Options: 'reqs', 'finance', 'pkg', 'plan'
    const [activeTab, setActiveTab] = useState<string>('reqs');
    const [searchText, setSearchText] = useState('');
    const [filterBrand, setFilterBrand] = useState('All');
    const [filterStatus, setFilterStatus] = useState('Pending');

    // -- Derived Data --
    const filteredContracts = contracts.filter(c => {
        const matchesSearch = c.contractNo.toLowerCase().includes(searchText.toLowerCase()) ||
            c.productName.toLowerCase().includes(searchText.toLowerCase()) ||
            c.client.toLowerCase().includes(searchText.toLowerCase());
        const matchesBrand = filterBrand === 'All' || c.brand === filterBrand;
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;

        return matchesSearch && matchesBrand && matchesStatus;
    });

    const uniqueBrands = Array.from(new Set(contracts.map(c => c.brand).filter(Boolean)));

    // -- Status Dot Helper --
    const renderStatusDot = (status?: string) => {
        if (status === 'Done' || status === 'Paid' || status === 'Ready') return <Tooltip title={status}><CheckCircleFilled style={{ color: '#52c41a' }} /></Tooltip>;
        if (status === 'Issue' || status === 'Missing') return <Tooltip title={status}><ExclamationCircleFilled style={{ color: '#ff4d4f' }} /></Tooltip>;
        if (status === 'Pending' || status === 'Unpaid') return <Tooltip title={status}><ClockCircleFilled style={{ color: '#faad14' }} /></Tooltip>;
        return <span style={{ color: '#d9d9d9' }}>-</span>;
    };

    // -- Column Definitions --

    // 1. Base Columns (Fixed Left)
    const baseColumns: any[] = [
        {
            title: 'Date',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 100,
            fixed: 'left',
            render: (d: string) => <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(d).format('MM/DD')}</Text>
        },
        {
            title: 'Contract No',
            dataIndex: 'contractNo',
            key: 'contractNo',
            width: 140,
            fixed: 'left',
            render: (text: string, record: Contract) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{record.client}</Text>
                </div>
            )
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
            width: 160,
            fixed: 'left',
            render: (text: string, record: Contract) => (
                <div>
                    <div>{text}</div>
                    {record.spec && <Tag style={{ fontSize: 10, lineHeight: '18px', padding: '0 4px', marginTop: 2 }}>{record.spec}</Tag>}
                </div>
            )
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            width: 100,
            responsive: ['lg'],
        },
        {
            title: 'Qty',
            dataIndex: 'totalQty',
            key: 'totalQty',
            width: 90,
            render: (val: number) => <strong>{val.toLocaleString()}</strong>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => {
                let color = 'default';
                if (status === 'Pending') color = 'orange';
                if (status === 'Production') color = 'geekblue';
                if (status === 'Completed') color = 'green';
                return <Tag color={color} style={{ margin: 0 }}>{status}</Tag>;
            }
        },
    ];

    // 2. Dynamic Columns
    const reqsColumns = [
        { title: 'GACC', dataIndex: 'gaccStatus', key: 'gaccStatus', align: 'center', width: 70, render: renderStatusDot },
        { title: 'Coding', dataIndex: 'codingStatus', key: 'codingStatus', align: 'center', width: 70, render: renderStatusDot },
        { title: 'Label', dataIndex: 'labelStatus', key: 'labelStatus', align: 'center', width: 70, render: renderStatusDot },
        { title: 'Other', key: 'other', align: 'center', width: 70, render: () => <span style={{ color: '#d9d9d9' }}>-</span> },
        { title: 'Ship Mode', dataIndex: 'shipMode', key: 'shipMode', width: 90, render: (v: string) => <Tag>{v || '-'}</Tag> },
    ];

    const financeColumns = [
        { title: 'Invoice #', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 120 },
        { title: 'Deposit', dataIndex: 'depositStatus', key: 'depositStatus', align: 'center', width: 80, render: renderStatusDot },
        { title: 'Balance', dataIndex: 'balanceStatus', key: 'balanceStatus', align: 'center', width: 80, render: renderStatusDot },
        { title: 'Payment Note', key: 'payNote', width: 150, render: () => <Text type="secondary" style={{ fontSize: 11 }}>No issues</Text> }
    ];

    const pkgColumns = [
        { title: 'Pkg Inv #', key: 'pkgInv', width: 120, render: () => <Text type="secondary">-</Text> },
        { title: 'Pkg Material', key: 'pkgMat', width: 120, render: (_: any, r: any) => <Text style={{ fontSize: 12 }}>{r.spec ? 'Custom Box' : 'Standard'}</Text> },
        {
            title: 'Stock Status', dataIndex: 'pkgStatus', key: 'pkgStatus', render: (s: string) => {
                const color = s === 'Ready' ? 'success' : s === 'Missing' ? 'error' : 'warning';
                return <Badge status={color as any} text={s} />;
            }
        },
    ];

    const planColumns = [
        { title: 'Material ETA', key: 'matEta', width: 110, render: () => <Text style={{ fontSize: 12 }}>In Stock</Text> },
        { title: 'Production Slot', key: 'slot', width: 120, render: (_: any, r: Contract) => <Text style={{ fontSize: 12 }}>{r.startDate ? dayjs(r.startDate).add(1, 'week').format('MM/DD') : 'TBD'}</Text> },
        {
            title: 'Material Status', dataIndex: 'materialStatus', key: 'materialStatus', render: (s: string) => {
                const color = s === 'Ready' ? 'success' : s === 'Missing' ? 'error' : 'warning';
                return <Badge status={color as any} text={s || 'Partial'} />;
            }
        },
    ];

    const columnMap: Record<string, any[]> = {
        'reqs': reqsColumns,
        'finance': financeColumns,
        'pkg': pkgColumns,
        'plan': planColumns
    };

    // 3. Action Column
    const actionColumn = {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (_: any, record: Contract) => (
            record.status === 'Pending' && (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, fontWeight: 600 }}
                    onClick={() => navigate(`/schedule/${record.id}`)}
                >
                    Schedule
                </Button>
            )
        )
    };

    const columns = [...baseColumns, ...(columnMap[activeTab] || []), actionColumn];

    // -- UI --
    return (
        <div style={{ padding: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <Title level={3} style={{ margin: 0 }}>Contract Management</Title>

                    <div style={{ display: 'flex', gap: 8 }}>
                        {/* View Switcher - Segmented Control */}
                        <Segmented
                            options={[
                                { label: 'Reqs', value: 'reqs', icon: <AppstoreOutlined /> },
                                { label: 'Finance', value: 'finance', icon: <DollarOutlined /> },
                                { label: 'Pkg', value: 'pkg', icon: <DropboxOutlined /> },
                                { label: 'Plan', value: 'plan', icon: <ScheduleOutlined /> },
                            ]}
                            value={activeTab}
                            onChange={setActiveTab}
                        />
                    </div>
                </div>

                <Space wrap>
                    <Select
                        defaultValue="All"
                        style={{ width: 140 }}
                        onChange={setFilterBrand}
                        options={[{ label: 'Brand: All', value: 'All' }, ...uniqueBrands.map(b => ({ label: b, value: b as string }))]}
                    />
                    <Select
                        defaultValue="Pending"
                        style={{ width: 140 }}
                        onChange={setFilterStatus}
                        options={[
                            { label: 'Status: All', value: 'All' },
                            { label: 'Status: Pending', value: 'Pending' },
                            { label: 'Status: Production', value: 'Production' },
                            { label: 'Status: Completed', value: 'Completed' },
                        ]}
                    />
                    <Search
                        placeholder="No / Client / Prod"
                        allowClear
                        onSearch={setSearchText}
                        style={{ width: 220 }}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </Space>
            </div>

            {/* Table */}
            <Card bordered={false} bodyStyle={{ padding: 0 }} className="shadow-sm" style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Table
                    dataSource={filteredContracts}
                    columns={columns as any}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    size="middle"
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    );
};

export default ContractList;
