import { theme, Typography, Tag, Badge, Button } from 'antd';
import type { Contract } from '../../../types';
import StatusDot from '../../../components/common/StatusDot';
import StatusTag from '../../../components/common/StatusTag';
import dayjs from 'dayjs';

const { Text } = Typography;

export const useContractColumns = (navigate: (path: string) => void) => {
    const { token } = theme.useToken();

    // -- Renderers using Tokens --
    const renderDate = (d: string) => (
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
            {dayjs(d).format('MM/DD')}
        </Text>
    );

    const renderContractInfo = (text: string, record: Contract) => (
        <div>
            <div style={{ fontWeight: token.fontWeightStrong, color: token.colorText }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.client}</Text>
        </div>
    );

    const renderProductInfo = (text: string, record: Contract) => (
        <div>
            <div style={{ color: token.colorText }}>{text}</div>
            {record.spec && (
                <Tag style={{
                    fontSize: 10,
                    lineHeight: '18px',
                    padding: '0 4px',
                    marginTop: 2,
                    borderColor: token.colorBorderSecondary,
                    color: token.colorTextSecondary
                }}>
                    {record.spec}
                </Tag>
            )}
        </div>
    );

    const renderQty = (val: number) => (
        <strong style={{ color: token.colorText }}>{val.toLocaleString()}</strong>
    );

    // -- Columns --

    // 1. Base Columns
    const baseColumns: any[] = [
        {
            title: 'Date',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 90, // Reduced
            fixed: 'left',
            sorter: (a: Contract, b: Contract) => {
                const dateA = a.startDate ? dayjs(a.startDate).valueOf() : 0;
                const dateB = b.startDate ? dayjs(b.startDate).valueOf() : 0;
                return dateA - dateB;
            },
            render: renderDate
        },
        {
            title: 'Contract No',
            dataIndex: 'contractNo',
            key: 'contractNo',
            width: 140, // Reduced
            fixed: 'left',
            render: renderContractInfo
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
            width: 160, // Reduced
            fixed: 'left',
            ellipsis: true,
            render: renderProductInfo
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            width: 90, // Reduced
            fixed: 'left',
            render: (v: string) => <Text style={{ color: token.colorText, fontSize: 13 }}>{v}</Text> // Slightly smaller font for compactness
        },
        {
            title: 'Qty',
            dataIndex: 'totalQty',
            key: 'totalQty',
            width: 80, // Reduced
            fixed: 'left',
            render: renderQty
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100, // Reduced
            fixed: 'left',
            render: (status: string) => <StatusTag status={status} />
        },
    ];

    // 2. Dynamic Columns
    const reqsColumns = [
        {
            title: 'GACC',
            dataIndex: 'gacc_note',
            key: 'gacc_note',
            width: 100,
            className: 'col-anchor-reqs', // Scroll Anchor
            ellipsis: true,
            render: (t: string) => <Text style={{ color: token.colorText, fontSize: 12 }} title={t}>{t || '-'}</Text>
        },
        { title: <>Coding<br />Format</>, dataIndex: 'coding_format', key: 'coding_format', width: 100, ellipsis: true, render: (t: string) => <Text style={{ color: token.colorText, fontSize: 12 }} title={t}>{t || '-'}</Text> },
        { title: <>Exp. Ship<br />Method</>, dataIndex: 'expected_shipping_method', key: 'expected_shipping_method', width: 100, render: (v: string) => <Tag variant="filled" style={{ color: token.colorText }}>{v || '-'}</Tag> },
        { title: <>Labeling<br />Req.</>, dataIndex: 'labeling_requirement', key: 'labeling_requirement', width: 100, ellipsis: true, render: (t: string) => <Text style={{ color: token.colorText, fontSize: 12 }} title={t}>{t || '-'}</Text> },
        { title: <>Add.<br />Notes</>, key: 'addNotes', width: 90, ellipsis: true, render: () => <span style={{ color: token.colorTextSecondary, fontSize: 12 }}>-</span> },
    ];

    const financeColumns = [
        {
            title: <>Invoice<br />#</>,
            dataIndex: 'invoiceNo',
            key: 'invoiceNo',
            width: 100,
            className: 'col-anchor-finance', // Scroll Anchor
            ellipsis: true,
            render: (v: string) => <Text style={{ color: token.colorText }} ellipsis>{v}</Text>
        },
        { title: 'Deposit', dataIndex: 'depositStatus', key: 'depositStatus', align: 'center', width: 90, render: (s: string) => <StatusDot status={s} /> },
    ];

    const pkgColumns = [
        {
            title: <>Arrive Date<br />/ Check</>,
            dataIndex: 'pkg_arrive_date',
            key: 'pkg_arrive_date',
            width: 110,
            className: 'col-anchor-pkg', // Scroll Anchor
            render: (d: string) => <Text style={{ color: token.colorText, fontSize: 12 }}>{d ? dayjs(d).format('DD/MM/YYYY') : '-'}</Text>
        },
        { title: <>Package<br />Name</>, dataIndex: 'spec', key: 'pkgName', width: 120, ellipsis: true, render: (v: string) => <Text style={{ fontSize: 12, color: token.colorText }} ellipsis={{ tooltip: v }}>{v || 'Standard'}</Text> },
        {
            title: 'Status', dataIndex: 'pkgStatus', key: 'pkgStatus', width: 90, render: (s: string) => {
                const color = s === 'Ready' ? 'success' : s === 'Missing' ? 'error' : 'warning';
                return <Badge status={color as any} text={<span style={{ color: token.colorText }}>{s}</span>} />;
            }
        },
    ];

    const planColumns = [
        {
            title: <>Schedule<br />Notes</>,
            dataIndex: 'schedule_notes',
            key: 'scheduleNotes',
            width: 120,
            className: 'col-anchor-plan', // Scroll Anchor
            ellipsis: true,
            render: (t: string) => <Text style={{ color: token.colorText, fontSize: 12 }} title={t}>{t || '-'}</Text>
        },
        { title: <>Prod.<br />Machine</>, key: 'prodMachine', width: 110, render: (_: any, r: Contract) => <Text style={{ fontSize: 12, color: token.colorText }}>{r.status === 'Production' ? 'Assigned' : '-'}</Text> },
        { title: <>Start<br />Date</>, dataIndex: 'startDate', key: 'planStart', width: 90, render: (d: string) => <Text style={{ fontSize: 12, color: token.colorText }}>{d ? dayjs(d).format('MM/DD') : '-'}</Text> },
        { title: <>End<br />Date</>, dataIndex: 'dueDate', key: 'planEnd', width: 90, render: (d: string) => <Text style={{ fontSize: 12, color: token.colorText }}>{d ? dayjs(d).format('MM/DD') : '-'}</Text> },
    ];

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

    // Combined all columns
    return [
        ...baseColumns,
        ...reqsColumns,
        ...financeColumns,
        ...pkgColumns,
        ...planColumns,
        actionColumn
    ];
};
