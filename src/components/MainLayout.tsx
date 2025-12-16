import React from 'react';
import { Layout, Menu, Avatar, theme } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    BarChartOutlined,
    CalendarOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Highlight active menu item based on path
    const selectedKey = location.pathname.split('/')[1] || 'dashboard';

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={80} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: 64, margin: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Logo Placeholder */}
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#2A9D8F', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>Ora</div>
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
            <Layout>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 500 }}>John Doe</span>
                        <Avatar style={{ backgroundColor: '#2A9D8F', color: 'white' }} icon={<UserOutlined />} />
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
