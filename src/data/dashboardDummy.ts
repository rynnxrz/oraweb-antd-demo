
export const DUMMY_DASHBOARD_DATA = {
    // Top KPIs
    kpis: [
        {
            id: 'lead-time',
            title: 'Lead Time Breach',
            subtitle: '整体周期超出内部目标',
            value: 18,
            total: 142,
            unit: '',
            trend: '+5 vs last week',
            trendType: 'bad', // bad = red, good = green
            icon: 'clock',
            color: '#E76F51', // red-ish
            bg: '#FEF2F2',
            detail: 'Stage SLA > 目标'
        },
        {
            id: 'payment',
            title: 'Payment Blocked',
            subtitle: '收款环节有阻塞',
            value: 8,
            total: 0, // 0 means just show value + suffix
            unit: 'Contracts',
            trend: 'High Priority',
            trendType: 'warning',
            icon: 'dollar',
            color: '#F4A261', // orange
            bg: '#FFF7ED',
            detail: '款项待确认 > 3 天'
        },
        {
            id: 'material',
            title: 'Material Risk',
            subtitle: '物料准备存在风险',
            value: 12,
            total: 0,
            unit: 'Contracts',
            trend: 'Requires Attention',
            trendType: 'warning',
            icon: 'box', // boxes-stacked
            color: '#E9C46A', // yellow
            bg: '#FEFCE8',
            detail: '物料未到+临近排产'
        },
        {
            id: 'data',
            title: 'Data Quality',
            subtitle: '数据记录需补充',
            value: 15,
            total: 0,
            unit: 'Records',
            trend: 'Affects Forecast',
            trendType: 'bad',
            icon: 'database',
            color: '#6B7280', // gray
            bg: '#F3F4F6',
            detail: '字段缺失/异常'
        }
    ],

    // Part 1B: Key Contracts
    keyContracts: [
        {
            id: 'C2411-003',
            client: 'Little Umbrella',
            stage: 'S1 款项',
            delay: 45,
            status: '款项未到',
            time: '45d',
            lastUpdate: '2d ago',
            type: 'blocker', // blocker, delay
            category: 'money' // money, materials, leadtime
        },
        {
            id: 'C2411-008',
            client: 'PowerGums',
            stage: 'S2 物料',
            delay: 20,
            status: '物料未齐',
            time: '20d',
            lastUpdate: '1d ago',
            type: 'blocker',
            category: 'materials'
        },
        {
            id: 'C2410-001',
            client: 'Vitality',
            stage: 'S4 生产',
            delay: 15,
            status: '超出内部目标',
            time: '60d',
            lastUpdate: 'Active',
            type: 'delay',
            category: 'leadtime'
        }
    ],

    // Part 1C: Zombie
    zombieContracts: [ // Inactive > 45d
        { id: 'C2408-002', client: 'Vitality', days: 120, pct: 100 },
        { id: 'C2409-015', client: 'Muscle', days: 95, pct: 80 }
    ],
    zombieInventory: [ // Produced but not shipped
        { id: 'C2410-001', variant: 'Gummies', reason: 'Produced but not shipped (15d)', qty: '5k Units' }
    ],

    // Part 1D: Data Quality
    dataQuality: {
        score: 92,
        chartData: [
            { name: 'Missing', value: 8 },
            { name: 'Good', value: 92 }
        ],
        issueTypes: [
            { name: 'Date Missing', value: 5, color: '#E76F51' },
            { name: 'Qty Mismatch', value: 2, color: '#F4A261' },
            { name: 'Logic Error', value: 1, color: '#264653' }
        ],
        issues: [
            { id: 'C-2024-001', product: 'Gummies', issue: '缺少发货日期', time: '10m ago', user: 'System', icon: 'calendar-times', color: 'red' },
            { id: 'C-2024-005', product: 'Powder', issue: '数量不一致', time: '2h ago', user: 'John', icon: 'scale', color: 'orange' },
            { id: 'C-2024-008', product: 'Liquids', issue: '缺少发货日期', time: '1d ago', user: 'System', icon: 'calendar-times', color: 'red' },
            { id: 'C-2024-012', product: 'Capsules', issue: '付款日期缺失', time: '3d ago', user: 'Finance', icon: 'exclamation', color: 'gray' },
            { id: 'C-2024-015', product: 'Gummies', issue: '时间顺序异常', time: '5m ago', user: 'System', icon: 'clock', color: 'red' }
        ]
    },

    // Part 2: Lead Time
    leadTime: {
        avgDays: 42,
        waterfall: [
            { stage: 'Start', days: 0, fill: '#8884d8' }, // invisible spacer if needed, or just bar
            { stage: 'Order', days: 2, fill: '#2A9D8F' },
            { stage: 'Payment', days: 5, fill: '#2A9D8F' },
            { stage: 'Material', days: 10, fill: '#2A9D8F' },
            { stage: 'Production', days: 15, fill: '#E76F51' }, // bottle neck
            { stage: 'QC', days: 3, fill: '#2A9D8F' },
            { stage: 'Shipping', days: 7, fill: '#E76F51' }  // bottle neck
        ],
        breachData: [
            { stage: 'Material', pct: 68, color: '#DC2626' }, // red
            { stage: 'Production', pct: 45, color: '#F97316' }, // orange
            { stage: 'QC', pct: 12, color: '#10B981' }, // green
            { stage: 'Shipping', pct: 25, color: '#EAB308' } // yellow
        ],
        adherenceData: [
            { x: 'Gummies', y: 95 },
            { x: 'Capsule', y: 92 },
            { x: 'Powder', y: 70 }, // low
            { x: 'Liquid', y: 88 }
        ],
        materialRisk: {
            readyPct: 85,
            risks: [
                { id: 'C2411-05', type: 'Gummies', gap: -2 },
                { id: 'C2411-08', type: 'Powder', gap: -1 }
            ]
        },
        growth: {
            q4Total: '1.2M', // units
            qoq: 15, // %
            avgTime: 42, // days
            vsBaseline: -3 // days
        }
    },

    // Part 3: Client & Radar
    clientRisk: {
        chartData: [
            { name: 'Vitality', q3: 60, q4: 0, status: 'Churned' },
            { name: 'Muscle', q3: 60, q4: 25, status: 'Risk' },
            { name: 'PowerGums', q3: 40, q4: 45, status: 'Stable' }
        ],
        table: [
            { brand: 'Vitality', status: '本季未下单', statusType: 'red', q3: '60k', q4: '0' },
            { brand: 'Muscle', status: '下单明显变少', statusType: 'orange', q3: '60k', q4: '25k' }
        ]
    },
    concentration: {
        // top 3 take 72%
        data: [
            { name: 'Top 3 Clients', value: 72, fill: '#2A9D8F' },
            { name: 'Others', value: 28, fill: '#E9F5F5' }
        ]
    },
    whiteSpace: [
        { brand: 'Little Umbrella', gummies: 'Core', powder: 'Occasional', liquids: 'Never', capsules: 'Never' },
        { brand: 'PowerGums', gummies: 'Strong', powder: 'Gap', liquids: 'Gap', capsules: 'Gap' }
    ]
};
