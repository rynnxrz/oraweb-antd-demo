import type { Contract } from '../types';
import dayjs from 'dayjs';

// Types for Dashboard Data
export interface DashboardKPI {
    id: string;
    title: string;
    subtitle: string;
    value: number;
    total: number;
    unit: string;
    trend: string;
    trendType: 'bad' | 'good' | 'warning' | 'neutral';
    icon: string;
    color: string;
    bg: string;
    detail: string;
}

export interface KeyContractView {
    id: string;
    contractNo: string;
    client: string;
    stage: string;
    delay: number;
    status: string;
    time: string;
    lastUpdate: string;
    type: 'blocker' | 'delay';
    category: 'money' | 'materials' | 'leadtime' | 'silent' | null;
    raw: Contract;
}

export interface DataQualityStat {
    score: number;
    chartData: { name: string; value: number }[];
    issueTypes: { name: string; value: number; color: string }[];
    issues: { id: string; product: string; issue: string; time: string; user: string; icon: string; color: string }[];
}

export const calculateKPIs = (contracts: Contract[]): DashboardKPI[] => {
    const today = dayjs();

    // 1. Lead Time Breach (General lateness across any stage)
    // Helper: Delay calculation (Simplified SLA: 3 days for Payment, Material must be ready 14d before prod)
    const getDelay = (c: Contract) => {
        // 1. Payment Delay
        if (c.depositStatus === 'Unpaid' && c.signingDate) {
            const days = today.diff(dayjs(c.signingDate), 'day');
            if (days > 3) return days - 3; // Grace period 3 days
        }
        // 2. Material Delay (If Missing and within 14 days of Prod Start)
        if (c.materialStatus === 'Missing' && c.productionStartDate) {
            const daysUntilStart = dayjs(c.productionStartDate).diff(today, 'day');
            if (daysUntilStart < 14) return 14 - daysUntilStart; // How "late" we are relative to the 14d buffer
        }
        // 3. Lead Time (General) - Due Date
        if (c.dueDate && today.isAfter(dayjs(c.dueDate))) {
            return today.diff(dayjs(c.dueDate), 'day');
        }
        // 4. Production End
        if (c.status === 'Production' && c.productionEndDate && today.isAfter(dayjs(c.productionEndDate))) {
            return today.diff(dayjs(c.productionEndDate), 'day');
        }
        return 0;
    };

    // 1. Lead Time Breach
    const leadTimeBreaches = contracts.filter(c => c.status !== 'Completed' && getDelay(c) > 0);

    // 2. Payment Blocked (Prioritize this count)
    const paymentBlocked = contracts.filter(c =>
        (c.depositStatus === 'Unpaid' || c.preProdPaymentStatus === 'Unpaid') && c.status !== 'Completed' && c.signingDate && today.diff(dayjs(c.signingDate), 'day') > 3
    );

    // 3. Material Risk
    const materialRisk = contracts.filter(c => {
        if (c.materialStatus === 'Ready' || c.status === 'Completed') return false;
        if (!c.productionStartDate) return false;
        const diffDays = dayjs(c.productionStartDate).diff(today, 'day');
        return diffDays <= 14;
    });

    // 4. Data Quality
    const dataIssues = contracts.filter(c => {
        if (c.startDate && c.dueDate && dayjs(c.startDate).isAfter(dayjs(c.dueDate))) return true;
        if (c.status === 'Completed' && !c.shippingDate) return true;
        if (c.status === 'Production' && c.productionEndDate && c.productionStartDate && dayjs(c.productionEndDate).isBefore(dayjs(c.productionStartDate))) return true;
        return false;
    });

    return [
        {
            id: 'lead-time',
            title: 'Lead Time Breach',
            subtitle: '整体周期超出内部目标',
            value: leadTimeBreaches.length,
            total: contracts.length,
            unit: '',
            trend: '+2 vs last week',
            trendType: 'bad',
            icon: 'clock',
            color: '#E76F51',
            bg: '#FEF2F2',
            detail: 'Stage SLA > 目标'
        },
        {
            id: 'payment',
            title: 'Payment Blocked',
            subtitle: '收款环节有阻塞',
            value: paymentBlocked.length,
            total: 0,
            unit: 'Contracts',
            trend: 'High Priority',
            trendType: 'warning',
            icon: 'dollar',
            color: '#F4A261',
            bg: '#FFF7ED',
            detail: '款项待确认 > 3 天'
        },
        {
            id: 'material',
            title: 'Material Risk',
            subtitle: '物料准备存在风险',
            value: materialRisk.length,
            total: 0,
            unit: 'Contracts',
            trend: 'Requires Attention',
            trendType: 'warning',
            icon: 'box',
            color: '#E9C46A',
            bg: '#FEFCE8',
            detail: '物料未到+临近排产'
        },
        {
            id: 'data',
            title: 'Data Quality',
            subtitle: '数据记录需补充',
            value: dataIssues.length,
            total: 0,
            unit: 'Records',
            trend: 'Affects Forecast',
            trendType: 'bad',
            icon: 'database',
            color: '#6B7280',
            bg: '#F3F4F6',
            detail: '字段缺失/异常'
        }
    ];
};

export const getKeyContracts = (contracts: Contract[], filterBy?: string): KeyContractView[] => {
    const today = dayjs();

    let filtered = contracts.filter(c => c.status !== 'Completed');

    // Helper: Analyze Contract for PRD fields
    const analyze = (c: Contract) => {
        let isBlocker = false;
        let blockReason: KeyContractView['category'] = null; // 'money' | 'materials' | 'silent'
        let worstStage = 'S1 Start';
        let worstDelay = 0;
        let statusText = 'Normal';
        let type: KeyContractView['type'] = 'delay';

        // 1. Silent Blocker (> 30 days no update)
        if (c.lastUpdated && today.diff(dayjs(c.lastUpdated), 'day') > 30) {
            isBlocker = true;
            blockReason = 'silent';
            worstStage = 'S0 Update';
            worstDelay = today.diff(dayjs(c.lastUpdated), 'day') - 30;
            statusText = '长时间未更新';
            type = 'blocker';
        }

        // 2. Money Blocker (Unpaid > 3 days)
        if (c.depositStatus === 'Unpaid' && c.signingDate) {
            const diff = today.diff(dayjs(c.signingDate), 'day');
            if (diff > 3) {
                isBlocker = true;
                blockReason = 'money';
                worstStage = 'S1 Payment';
                worstDelay = diff - 3;
                statusText = '款项未到';
                type = 'blocker';
            }
        }

        // 3. Materials Blocker (Missing & Start Date < 14 days or passed)
        if (c.materialStatus === 'Missing' && c.productionStartDate) {
            const daysToStart = dayjs(c.productionStartDate).diff(today, 'day');
            if (daysToStart <= 14) {
                isBlocker = true;
                blockReason = 'materials';
                worstStage = 'S2 Materials';
                worstDelay = 14 - daysToStart;
                statusText = '物料未齐';
                type = 'blocker';
            }
        }

        // 4. Production/Shipping Delay
        // Only if not a blocker yet (Business rule: Blocker > Delay)
        if (!isBlocker) {
            if (c.status === 'Production' && c.productionEndDate && today.isAfter(dayjs(c.productionEndDate))) {
                worstStage = 'S4 Production';
                worstDelay = today.diff(dayjs(c.productionEndDate), 'day');
                statusText = '生产超时';
                blockReason = 'leadtime';
            } else if (c.dueDate && today.isAfter(dayjs(c.dueDate))) {
                worstStage = 'S5 Shipping';
                worstDelay = today.diff(dayjs(c.dueDate), 'day');
                statusText = '超出内部目标';
                blockReason = 'leadtime';
            }
        }

        // Ensure worstDelay is non-negative for display
        worstDelay = Math.max(0, worstDelay);

        return { isBlocker, blockReason, worstStage, worstDelay, statusText, type };
    };

    // Filter Logic
    // 1. Strict Rule: Only show "Key Contracts" (Problems)
    // Filter out healthy contracts (No blocker, No delay)
    filtered = filtered.filter(c => {
        const stats = analyze(c);
        // If specific filter applied, respect it
        if (filterBy) {
            if (filterBy === 'lead-time') return stats.worstDelay > 0;
            if (filterBy === 'payment') return stats.blockReason === 'money';
            if (filterBy === 'material') return stats.blockReason === 'materials';
            if (filterBy === 'data') return false;
            return false;
        }
        // Default: Show only problems
        return stats.isBlocker || stats.worstDelay > 0;
    });

    // Map & Sort
    return filtered.map(c => {
        const stats = analyze(c);
        const daysSinceSigning = c.signingDate ? today.diff(dayjs(c.signingDate), 'day') : 0;
        const daysSinceUpdate = c.lastUpdated ? today.diff(dayjs(c.lastUpdated), 'day') : 0;

        return {
            id: c.id,
            contractNo: c.contractNo,
            client: c.client,
            stage: stats.worstStage,
            delay: stats.worstDelay,
            status: stats.statusText,
            time: `${daysSinceSigning}d`,
            lastUpdate: `${daysSinceUpdate}d ago`,
            type: stats.type,
            category: stats.blockReason,
            raw: c
        };
    }).sort((a, b) => b.delay - a.delay) // User Request: Sort strictly by delay time
        .slice(0, 20);
};

export const getDataQualityStats = (contracts: Contract[]): DataQualityStat => {
    // Mocking logic for now as detailed rules are complex
    const total = contracts.length;
    const issues = contracts.filter(c => c.startDate && c.dueDate && dayjs(c.startDate).isAfter(dayjs(c.dueDate)));
    const score = Math.round(((total - issues.length) / total) * 100);

    return {
        score,
        chartData: [
            { name: 'Missing', value: issues.length },
            { name: 'Good', value: total - issues.length }
        ],
        issueTypes: [
            { name: 'Logic Error', value: issues.length, color: '#E76F51' },
            // Add other mock types if we had logic for them
        ],
        issues: issues.map(c => ({
            id: c.id,
            product: c.productName,
            issue: 'Start > Due Date',
            time: '2h ago',
            user: 'System',
            icon: 'calendar-times',
            color: 'red'
        }))
    };
};

export interface ZombieItem {
    id: string;
    name: string;
    sku: string;
    amount: number; // Value
    days: number; // Days unchanged
}

export interface ZombieStats {
    totalValue: number;
    count: number;
    items: ZombieItem[];
}

export const getZombieInventory = (contracts: Contract[]): ZombieStats => {
    const today = dayjs();
    const thresholdDays = 30; // Define "Zombie" as no update for 30 days

    const zombies = contracts.filter(c => {
        if (c.status === 'Completed') return false;
        if (!c.lastUpdated) return false;
        const diff = today.diff(dayjs(c.lastUpdated), 'day');
        return diff > thresholdDays;
    });

    const items: ZombieItem[] = zombies.map(c => ({
        id: c.id,
        name: c.productName,
        sku: c.contractNo,
        amount: Math.floor(Math.random() * 5000) + 1000, // Mock value, as Contract doesn't have financial value yet
        days: dayjs(today).diff(dayjs(c.lastUpdated), 'day')
    })).sort((a, b) => b.days - a.days);

    const totalValue = items.reduce((sum, item) => sum + item.amount, 0);

    return {
        totalValue,
        count: items.length,
        items: items.slice(0, 5) // Top 5
    };
};
