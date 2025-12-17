import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    BarChartOutlined,
    CalendarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export const MainSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);

    // Highlight active menu item based on path
    const selectedKey = location.pathname.split('/')[1] || 'dashboard';

    return (
        <Sider
            width={240}
            collapsedWidth={80}
            collapsed={collapsed}
            collapsible
            trigger={null}
            theme="light"
            style={{
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'relative'
            }}
        >
            {/* Logo */}
            <div style={{
                height: 64,
                margin: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingLeft: collapsed ? 8 : 12,
                justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: '#2A9D8F',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                }}>
                    O
                </div>
                {!collapsed && <span style={{ fontWeight: 600, fontSize: 16 }}>OraWeb</span>}
            </div>

            {/* Menu */}
            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[selectedKey]}
                style={{ borderRight: 0, flex: 1 }}
                items={[
                    {
                        key: 'dashboard',
                        icon: <DashboardOutlined />,
                        label: 'Dashboard',
                        onClick: () => navigate('/dashboard'),
                    },
                    {
                        key: 'contracts',
                        icon: <FileTextOutlined />,
                        label: 'Contracts',
                        onClick: () => navigate('/contracts'),
                    },
                    {
                        key: 'report',
                        icon: <BarChartOutlined />,
                        label: 'Report',
                        onClick: () => navigate('/report'),
                    },
                    {
                        key: 'calendar',
                        icon: <CalendarOutlined />,
                        label: 'Calendar',
                        onClick: () => navigate('/calendar'),
                    },
                ]}
            />

            {/* Collapse Toggle Button */}
            <div style={{
                padding: 16,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                display: 'flex',
                justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        width: collapsed ? 48 : '100%',
                        justifyContent: collapsed ? 'center' : 'flex-start'
                    }}
                >
                    {!collapsed && 'Collapse'}
                </Button>
            </div>
        </Sider>
    );
};
