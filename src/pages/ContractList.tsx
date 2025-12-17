import React, { useState, useEffect, useRef } from 'react';
import { Table, Space, Segmented, Input, Select, message } from 'antd';
import { PageTableWrapper } from '../components/common/PageTableWrapper';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutlined, DollarOutlined, DropboxOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useContractColumns } from './ContractList/hooks/useContractColumns';
import { useTableScroll, useTableScrollSpy } from './ContractList/hooks/useTableScroll';
import TablePanner from '../components/common/TablePanner'; // Import TablePanner
import { contractsApi } from '../apis';
import type { GetContractResponse } from '../types/schema';
import { ContractStatusEnum } from '../types/schema';
import type { Contract } from '../types';

import './ContractList/ContractList.css';

// -- Adapter: Map API Schema to UI Contract --
export const mapContractToUi = (c: GetContractResponse): Contract => {
    // Assuming single product for now as per old UI
    const product = c.products?.[0];

    // Map Status Enum to UI Status
    // ContractStatusEnum: NEW, PENDING_PREPARATION, PENDING_SCHEDULING, PENDING_PRODUCTION, PENDING_PRODUCTION_COMPLETE, PENDING_SHIPPING, PENDING_SHIPPING_QUANTITY, COMPLETED
    let uiStatus: Contract['status'] = 'Pending';
    if (c.status === ContractStatusEnum.PENDING_PRODUCTION || c.status === ContractStatusEnum.PENDING_PRODUCTION_COMPLETE) {
        uiStatus = 'Production';
    } else if (c.status === ContractStatusEnum.COMPLETED) {
        uiStatus = 'Completed';
    } else if (c.status === ContractStatusEnum.PENDING_SCHEDULING) {
        uiStatus = 'Pending'; // Or separate status if UI supported it
    }

    return {
        id: c.contract_id,
        contractNo: c.contract_number || '-',
        client: c.brand || 'Unknown', // Using Brand as Client equivalent for now
        brand: c.brand || undefined,
        productName: product?.product_name || 'Unknown Product',
        spec: product?.packaging_unit || undefined,
        totalQty: product?.total_quantity || 0,
        scheduledQty: product?.actual_quantity_produced || 0, // Using produced as scheduled proxy or 0
        status: uiStatus,
        startDate: c.signing_date || undefined,
        dueDate: c.estimated_production_completion_date || undefined,

        // Reqs
        gacc_note: product?.gacc_note || undefined,
        coding_format: product?.coding_format || undefined,
        expected_shipping_method: product?.expected_shipping_method || undefined,
        labeling_requirement: product?.labeling_requirement || undefined,

        // Finance
        invoiceNo: c.invoice_number || undefined,
        depositStatus: c.deposit_payment_status === 'received' ? 'Paid' : 'Unpaid',
        balanceStatus: c.final_payment_status === 'received' ? 'Paid' : 'Unpaid', // simplified

        // Pkg
        pkgStatus: 'Ready', // Mock default
        pkg_arrive_date: undefined,

        // Plan
        schedule_notes: product?.production_schedule_notes || undefined,
        stageInfo: { stage: 'Processing', delayDays: 0, status: 'Normal' } // Mock
    };
};

const ContractList: React.FC = () => {
    const navigate = useNavigate();

    // -- State --
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    // Options: 'reqs', 'finance', 'pkg', 'plan'
    const [activeTab, setActiveTab] = useState<string>('reqs');
    const [searchText, setSearchText] = useState('');
    const [filterBrand, setFilterBrand] = useState('All');
    const [filterStatus, setFilterStatus] = useState('Pending');

    // -- Hooks --
    // -- Hooks --
    const { scrollToSection } = useTableScroll();
    const columns = useContractColumns(navigate);

    // Ref for Panner
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const isProgrammaticScroll = useRef(false);

    // Sync Tabs with Scroll
    useTableScrollSpy(tableWrapperRef, ['reqs', 'finance', 'pkg', 'plan'], setActiveTab, isProgrammaticScroll);

    // -- Fetch Data --
    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setLoading(true);
                const apiData = await contractsApi.getContracts({});
                const uiData = apiData.map(mapContractToUi);
                setContracts(uiData);
            } catch (err) {
                console.error(err);
                message.error('Failed to load contracts');
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

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

    // -- Logic --
    const handleTabClick = (value: string) => {
        // Lock scroll spy during programmatic scroll
        isProgrammaticScroll.current = true;
        setActiveTab(value);
        scrollToSection(value);
        // Unlock after smooth scroll animation completes (~800ms)
        setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 800);
    };

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
                <Space>
                    <Segmented
                        options={[
                            { label: 'Reqs', value: 'reqs', icon: <AppstoreOutlined /> },
                            { label: 'Finance', value: 'finance', icon: <DollarOutlined /> },
                            { label: 'Pkg', value: 'pkg', icon: <DropboxOutlined /> },
                            { label: 'Plan', value: 'plan', icon: <ScheduleOutlined /> },
                        ]}
                        value={activeTab}
                        onChange={handleTabClick}
                    />
                    <TablePanner tableRef={tableWrapperRef} />
                </Space>
            }
            table={
                <div ref={tableWrapperRef} style={{ height: '100%', width: '100%' }}>
                    <Table
                        className="contract-list-table"
                        dataSource={filteredContracts}
                        columns={columns as any}
                        rowKey="id"
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        size="middle"
                        loading={loading}
                        // Fix double scrollbar by setting Y scroll and accounting for layout
                        // Assuming roughly 280px for header/filters + some buffer. 
                        // Use CSS variable if available or calc.
                        scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
                        tableLayout="fixed"
                    />
                </div>
            }
        />
    );
};

export default ContractList;
