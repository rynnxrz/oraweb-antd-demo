import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    BarChartOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export const MainSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();

    // Highlight active menu item based on path
    const selectedKey = location.pathname.split('/')[1] || 'dashboard';

    return (
        <Sider
            width={240}
            theme="light"
            style={{
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{
                height: 64,
                margin: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingLeft: 12 // Adjust for left alignment in wider sidebar
            }}>
                {/* Logo Placeholder */}
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: '#2A9D8F',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold'
                }}>
                    O
                </div>
                <span style={{ fontWeight: 600, fontSize: 16 }}>OraWeb</span>
            </div>
            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[selectedKey]}
                style={{ borderRight: 0 }}
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
                        onClick: () => navigate('/report'), // Placeholder
                    },
                    {
                        key: 'calendar',
                        icon: <CalendarOutlined />,
                        label: 'Calendar',
                        onClick: () => navigate('/calendar'), // Placeholder
                    },
                ]}
            />
        </Sider>
    );
};
