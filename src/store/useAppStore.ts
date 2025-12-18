import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Contract, Machine, Schedule } from '../types';

interface AppState {
    // UI State
    isSidebarCollapsed: boolean;

    // Legacy Data State (To be removed/refactored)
    // Keeping these typings to avoid breaking other components compilation immediately,
    // but they will be empty.
    contracts: Contract[];
    machines: Machine[];
    schedules: Schedule[];
    dashboardData: any;

    // Actions
    toggleSidebar: () => void;

    // Dashboard State
    dashboardFilter: string;
    setDashboardFilter: (filter: string) => void;

    // Legacy Actions (No-ops or simple state mutations for now)
    addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
    deleteSchedule: (scheduleId: string) => void;
    updateContractStatus: (contractId: string, status: Contract['status']) => void;
    resetStore: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isSidebarCollapsed: false,

            contracts: [],
            machines: [],
            schedules: [],
            dashboardData: {
                topKpis: [],
                leadTimeData: [],
                zombieData: [],
                qualityData: []
            },
            dashboardFilter: 'all',

            setDashboardFilter: (filter) => set({ dashboardFilter: filter }),

            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

            addSchedule: (newSchedule) => {
                // Legacy: Just add to local state if needed for demo, or do nothing as we move to API.
                // For now, we keep the signature but do minimum.
                const id = Math.random().toString(36).substr(2, 9);
                set((state) => ({
                    schedules: [...state.schedules, { ...newSchedule, id }]
                }));
            },

            deleteSchedule: (scheduleId) => {
                set((state) => ({
                    schedules: state.schedules.filter(s => s.id !== scheduleId)
                }));
            },

            updateContractStatus: (contractId, status) => {
                set((state) => ({
                    contracts: state.contracts.map((c) =>
                        c.id === contractId ? { ...c, status } : c
                    ),
                }));
            },

            resetStore: () => {
                // No more resets to mock data
                set({ contracts: [], machines: [], schedules: [] });
            }
        }),
        {
            name: 'ora-dashboard-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
