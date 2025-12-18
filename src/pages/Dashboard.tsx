import React from 'react';
import DashboardLayout from '../features/dashboard/DashboardLayout';

const Dashboard: React.FC = () => {
    // In a real app, we would fetch data here and pass it down as props.
    // For now, it simply renders the layout view.
    return <DashboardLayout />;
};

export default Dashboard;
