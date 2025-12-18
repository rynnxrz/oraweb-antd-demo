import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
    token: {
        colorPrimary: '#297A88', // Teal from design
        colorBgLayout: '#f5f7fa',
        colorSuccess: '#2A9D8F',
        colorWarning: '#E9C46A',
        colorError: '#E76F51',
        borderRadius: 8,
        wireframe: false,
        boxShadowTertiary: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    components: {
        Table: {
            headerBorderRadius: 8,
            // Dashboard Table styling (consistent header)
            // Note: These are global. If specific tables need different styles,
            // use ConfigProvider locally (but prefer global consistency).
            cellPaddingBlockSM: 8,
            cellPaddingInlineSM: 8,
        }
    }
};
