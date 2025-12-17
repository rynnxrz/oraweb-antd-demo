import React from 'react';
import { Typography, Flex, theme, Card } from 'antd';

const { Title } = Typography;

export interface PageTableWrapperProps {
    title?: string;
    leftFilters?: React.ReactNode;
    rightTabs?: React.ReactNode;
    table: React.ReactNode;
    className?: string;
}

export const PageTableWrapper: React.FC<PageTableWrapperProps> = ({
    title,
    leftFilters,
    rightTabs,
    table,
    className,
}) => {
    const { token } = theme.useToken();

    return (
        <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: token.margin }}>
            {/* 1. Page Title */}
            {title && (
                <Title level={3} style={{ margin: 0 }}>
                    {title}
                </Title>
            )}

            {/* 2. Toolbar (Filters + Tabs) */}
            <Flex
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={token.margin}
                style={{ marginBottom: token.marginXS }}
            >
                {/* Left: Filters */}
                <Flex align="center" gap={token.margin} wrap="wrap">
                    {leftFilters}
                </Flex>

                {/* Right: Tabs/Actions */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {rightTabs}
                </div>
            </Flex>

            {/* 3. Table Card */}
            <Card
                variant="borderless"
                styles={{ body: { padding: 0 } }}
                className="shadow-sm"
                style={{
                    borderRadius: token.borderRadiusLG,
                    overflow: 'hidden',
                    background: token.colorBgContainer
                }}
            >
                {table}
            </Card>
        </div>
    );
};
