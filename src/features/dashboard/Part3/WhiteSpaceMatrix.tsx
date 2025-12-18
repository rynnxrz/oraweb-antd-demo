import React from 'react';
import { Card } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { DUMMY_DASHBOARD_DATA } from '../../../data/dashboardDummy';

const WhiteSpaceMatrix: React.FC = () => {
    const data = DUMMY_DASHBOARD_DATA.whiteSpace;

    const renderCell = (status: string) => {
        if (status === 'Core' || status === 'Strong') {
            return <div style={{ background: '#2A9D8F', color: 'white', padding: '8px', borderRadius: 4, textAlign: 'center', fontSize: 11 }}>Core Business</div>;
        }
        if (status === 'Occasional') {
            return <div style={{ background: '#ccfbf1', color: '#115e59', padding: '8px', borderRadius: 4, textAlign: 'center', fontSize: 11 }}>Occasional</div>;
        }
        return <div style={{ border: '1px dashed #ccc', color: '#ccc', padding: '8px', borderRadius: 4, textAlign: 'center', fontSize: 11 }}>Never</div>;
    };

    return (
        <Card
            title={
                <span><AppstoreOutlined style={{ color: '#0d9488', marginRight: 8 }} /> P3-D. White Space</span>
            }
            extra={
                <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#2A9D8F', borderRadius: 2 }}></span> Core</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#ccfbf1', borderRadius: 2 }}></span> Occasional</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, border: '1px dashed #ccc', borderRadius: 2 }}></span> Never</span>
                </div>
            }
        >
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', color: '#6b7280' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Brand / Format</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Gummies</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Powder</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Liquids</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Capsules</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.brand} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{row.brand}</td>
                                <td style={{ padding: '4px' }}>{renderCell(row.gummies)}</td>
                                <td style={{ padding: '4px' }}>{renderCell(row.powder)}</td>
                                <td style={{ padding: '4px' }}>{renderCell(row.liquids)}</td>
                                <td style={{ padding: '4px' }}>{renderCell(row.capsules)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default WhiteSpaceMatrix;
