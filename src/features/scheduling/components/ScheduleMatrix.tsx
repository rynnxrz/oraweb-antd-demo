import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

interface ScheduleMatrixProps {
    room: string;
    startDate?: string;
}

export const ScheduleMatrix: React.FC<ScheduleMatrixProps> = ({ room, startDate }) => {
    const machines = useAppStore(state => state.machines).filter(m => m.room === room);
    const schedules = useAppStore(state => state.schedules);
    const contracts = useAppStore(state => state.contracts);

    const start = startDate ? dayjs(startDate) : dayjs();
    const daysToShow = 14;
    const dates = Array.from({ length: daysToShow }).map((_, i) => start.add(i, 'day'));

    const getScheduleForCell = (machineId: string, date: string) => {
        // Find if any schedule covers this date for this machine and has quantity > 0
        return schedules.find(s =>
            s.machineId === machineId &&
            s.dailyQuantities.some(d => d.date === date && d.quantity > 0)
        );
    };

    return (
        <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                    <tr>
                        <th style={{ padding: 8, borderBottom: '2px solid #f0f0f0', textAlign: 'left', minWidth: 150, position: 'sticky', left: 0, background: '#fff', zIndex: 2 }}>Machine</th>
                        {dates.map(d => (
                            <th key={d.toString()} style={{ padding: 8, borderBottom: '2px solid #f0f0f0', minWidth: 50, textAlign: 'center', background: d.day() === 0 || d.day() === 6 ? '#fafafa' : '#fff' }}>
                                <div style={{ color: '#999', fontSize: 10 }}>{d.format('dd')}</div>
                                <div>{d.format('DD')}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {machines.map(m => (
                        <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: 12, fontWeight: 500, position: 'sticky', left: 0, background: '#fff', borderRight: '1px solid #f0f0f0', zIndex: 1 }}>{m.name}</td>
                            {dates.map(d => {
                                const dateStr = d.format('YYYY-MM-DD');
                                const schedule = getScheduleForCell(m.id, dateStr);
                                const contract = schedule ? contracts.find(c => c.id === schedule.contractId) : null;
                                // Get specific daily qty
                                const dailyQty = schedule?.dailyQuantities.find(dq => dq.date === dateStr)?.quantity || 0;

                                return (
                                    <td key={dateStr} style={{ borderRight: '1px solid #f0f0f0', padding: 0, position: 'relative', height: 40, background: d.day() === 0 || d.day() === 6 ? '#fafafa' : undefined }}>
                                        {schedule && dailyQty > 0 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 4, bottom: 4, left: 2, right: 2,
                                                    background: '#E6FFFB',
                                                    border: '1px solid #2A9D8F',
                                                    borderRadius: 4,
                                                    color: '#2A9D8F',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer'
                                                }}
                                                title={`${contract?.contractNo}: ${dailyQty.toLocaleString()}`}
                                            >
                                                <div style={{ fontSize: 10, fontWeight: 'bold' }}>{dailyQty >= 1000 ? `${(dailyQty / 1000).toFixed(1)}k` : dailyQty}</div>
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
