import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';

interface SchedulingSidebarProps {
    selectedRoom: string;
    onSelectRoom: (room: string) => void;
}

export const SchedulingSidebar: React.FC<SchedulingSidebarProps> = ({ selectedRoom, onSelectRoom }) => {
    const machines = useAppStore(state => state.machines);
    // Get unique rooms
    const rooms = Array.from(new Set(machines.map(m => m.room))).sort();

    // Select first room by default if none selected
    useEffect(() => {
        if (!selectedRoom && rooms.length > 0) {
            onSelectRoom(rooms[0]);
        }
    }, [rooms, selectedRoom, onSelectRoom]);

    const items = rooms.map(room => ({
        key: room,
        icon: <AppstoreOutlined />,
        label: room,
    }));

    return (
        <div style={{ background: '#fff', height: '100%', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
            <div style={{ padding: '16px 24px', fontWeight: 'bold', color: '#666' }}>Production Lines</div>
            <Menu
                mode="inline"
                selectedKeys={[selectedRoom]}
                style={{ height: '100%', borderRight: 0 }}
                items={items}
                onClick={({ key }) => onSelectRoom(key)}
            />
        </div>
    );
};
