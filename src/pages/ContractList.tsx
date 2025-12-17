import React, { useState } from 'react';
import { Table, Space, Segmented, Input, Select } from 'antd';
import { PageTableWrapper } from '../components/common/PageTableWrapper';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutlined, DollarOutlined, DropboxOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import { useContractColumns } from './ContractList/useContractColumns';


const ContractList: React.FC = () => {
    // const { token } = theme.useToken(); // Unused
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

    // -- Columns --
    const columns = useContractColumns(activeTab, navigate);

    // -- UI --
    // -- UI --
    return (
        <PageTableWrapper
            title="Contract Management"
            leftFilters={
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
                    <Input.Search
                        placeholder="No / Client / Prod"
                        allowClear
                        onSearch={setSearchText}
                        style={{ width: 220 }}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </Space>
            }
            rightTabs={
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
            }
            table={
                <Table
                    dataSource={filteredContracts}
                    columns={columns as any}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    size="middle"
                    scroll={{ x: 'max-content' }}
                    tableLayout="fixed"
                />
            }
        />
    );
};

export default ContractList;
