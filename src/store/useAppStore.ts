import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Contract, Machine, Schedule } from '../types';

interface AppState {
    contracts: Contract[];
    machines: Machine[];
    schedules: Schedule[];
    dashboardData: any; // Using any for simplicity now, or define interface

    // Actions
    addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
    deleteSchedule: (scheduleId: string) => void;
    updateContractStatus: (contractId: string, status: Contract['status']) => void;
    resetStore: () => void;
}

// Mock Data
const MOCK_CONTRACTS: Contract[] = [
    {
        id: '1', contractNo: 'C2411-003', client: 'Little Umbrella', brand: 'Little Umbrella', productName: 'Kids Vitamin C', spec: '60ct Bottle', totalQty: 50000, scheduledQty: 0, status: 'Pending', startDate: '2024-11-01',
        gacc_note: 'Registered: GACC-2024-998', coding_format: 'LOT: YYYYMMDD / EXP: 2YR', expected_shipping_method: 'Sea', labeling_requirement: 'Standard FDA v2.1',
        invoiceNo: 'INV-2411-003', depositStatus: 'Paid', balanceStatus: 'Unpaid', pkgStatus: 'Ready', pkg_arrive_date: '2024-10-25',
        stageInfo: { stage: 'S1 Payment', delayDays: 45, status: 'Blocker' },
        schedule_notes: 'Urgent for Nov Promo'
    },
    {
        id: '2', contractNo: 'C2411-008', client: 'PowerGums', brand: 'PowerGums', productName: 'Energy Chews', spec: '10pk Box', totalQty: 120000, scheduledQty: 0, status: 'Pending', startDate: '2024-11-05',
        gacc_note: 'Missing Registration', coding_format: 'Custom: MM/DD/YY', expected_shipping_method: 'Air', labeling_requirement: 'Pending Artwork',
        depositStatus: 'Unpaid', pkgStatus: 'Missing',
        stageInfo: { stage: 'S2 Material', delayDays: 20, status: 'Blocker' },
        schedule_notes: 'Wait for artwork'
    },
    {
        id: '3', contractNo: 'C2410-001', client: 'Vitality', brand: 'Vitality', productName: 'Hair & Nail', spec: '90ct Jar', totalQty: 30000, scheduledQty: 30000, status: 'Production', startDate: '2024-10-15', dueDate: '2024-12-20',
        gacc_note: 'Verified (Ref: 8871)', coding_format: 'Std', expected_shipping_method: 'Sea', labeling_requirement: 'Compliant',
        depositStatus: 'Paid', pkgStatus: 'Ready', pkg_arrive_date: '2024-10-10',
        schedule_notes: 'Running on Line 2'
    },
    {
        id: '4', contractNo: 'C2409-015', client: 'Muscle', brand: 'MuscleStats', productName: 'Whey Protein', spec: '2kg Tub', totalQty: 10000, scheduledQty: 0, status: 'Pending', startDate: '2024-09-20',
        gacc_note: 'Pending Renewal', coding_format: 'Review Needed',
        depositStatus: 'Paid', pkgStatus: 'Partial',
        schedule_notes: 'Check inventory'
    },
    {
        id: '5', contractNo: 'C2412-002', client: 'NatureBest', brand: 'NatureBest', productName: 'Multivitamin', spec: '30ct Sachet', totalQty: 75000, scheduledQty: 0, status: 'Pending', startDate: '2024-12-01',
        gacc_note: 'OK', coding_format: 'Standard',
        depositStatus: 'Unpaid', pkgStatus: 'Ready', pkg_arrive_date: '2024-11-20',
        schedule_notes: 'Normal production'
    },
];

const MOCK_MACHINES: Machine[] = [
    { id: 'm1', name: '25mm Sachet LS01 L', room: 'Square Sachet Room' },
    { id: 'm2', name: '25mm Sachet LS01 R', room: 'Square Sachet Room' },
    { id: 'm3', name: 'Liquid Sachet L01', room: 'Liquid Sachet Room' },
    { id: 'm4', name: 'Liquid Sachet L02', room: 'Liquid Sachet Room' },
    { id: 'm5', name: 'Stick Pack SP-A', room: 'Powder Room' },
];

// Mock Dashboard Data
const MOCK_DASHBOARD_DATA = {
    topKpis: [
        { title: 'Lead Time Breach', value: 18, total: 142, unit: 'contracts', color: '#ff4d4f', icon: 'clock', subtitle: 'Global Cycle > Target' },
        { title: 'Payment Blocked', value: 8, total: 45, unit: 'active', color: '#fa8c16', icon: 'dollar', subtitle: 'Collection Issues' },
        { title: 'Material Risk', value: 12, total: 45, unit: 'active', color: '#fadb14', icon: 'box', subtitle: 'Supply At Risk' },
        { title: 'Data Quality', value: 15, total: 142, unit: 'records', color: '#8c8c8c', icon: 'database', subtitle: 'Missing Fields' }
    ],
    leadTimeData: [
        { stage: 'S1 Payment', days: 12, target: 7 },
        { stage: 'S2 Material', days: 25, target: 14 },
        { stage: 'S3 Waiting', days: 5, target: 2 },
        { stage: 'S4 Production', days: 8, target: 5 },
        { stage: 'S5 Shipping', days: 10, target: 3 },
    ],
    zombieData: [
        { name: 'C2408-002', days: 120, status: 'Inactive' },
        { name: 'C2409-015', days: 95, status: 'Inactive' },
        { name: 'C2410-003', days: 45, status: 'Inactive' },
        { name: 'C2411-001', days: 30, status: 'Active' },
    ],
    qualityData: [
        { name: 'Missing Dates', value: 45 },
        { name: 'Logic Error', value: 20 },
        { name: 'Incomplete', value: 15 },
        { name: 'Other', value: 12 },
    ]
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            contracts: MOCK_CONTRACTS,
            machines: MOCK_MACHINES,
            schedules: [],
            dashboardData: MOCK_DASHBOARD_DATA,

            addSchedule: (newSchedule) => {
                const id = Math.random().toString(36).substr(2, 9);
                set((state) => {
                    // Calculate total scheduled for this contract
                    const addedTotal = newSchedule.totalScheduled;

                    const newState: Partial<AppState> = {
                        schedules: [...state.schedules, { ...newSchedule, id }],
                    };

                    // Update contract scheduledQty
                    const contractIndex = state.contracts.findIndex(c => c.id === newSchedule.contractId);
                    if (contractIndex > -1) {
                        const updatedContracts = [...state.contracts];
                        updatedContracts[contractIndex] = {
                            ...updatedContracts[contractIndex],
                            scheduledQty: updatedContracts[contractIndex].scheduledQty + addedTotal,
                            status: 'Production' // Auto update status on schedule
                        };
                        newState.contracts = updatedContracts;
                    }

                    return newState;
                });
            },

            deleteSchedule: (scheduleId) => {
                set((state) => {
                    const schedule = state.schedules.find(s => s.id === scheduleId);
                    if (!schedule) return state;

                    const newState: Partial<AppState> = {
                        schedules: state.schedules.filter(s => s.id !== scheduleId)
                    };

                    // Deduct from contract
                    const contractIndex = state.contracts.findIndex(c => c.id === schedule.contractId);
                    if (contractIndex > -1) {
                        const updatedContracts = [...state.contracts];
                        const newQty = Math.max(0, updatedContracts[contractIndex].scheduledQty - schedule.totalScheduled);
                        updatedContracts[contractIndex] = {
                            ...updatedContracts[contractIndex],
                            scheduledQty: newQty,
                            status: newQty > 0 ? 'Production' : 'Pending'
                        };
                        newState.contracts = updatedContracts;
                    }

                    return newState;
                });
            },

            updateContractStatus: (contractId, status) => {
                set((state) => ({
                    contracts: state.contracts.map((c) =>
                        c.id === contractId ? { ...c, status } : c
                    ),
                }));
            },

            resetStore: () => {
                set({ contracts: MOCK_CONTRACTS, machines: MOCK_MACHINES, schedules: [] });
            }
        }),
        {
            name: 'ora-dashboard-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
