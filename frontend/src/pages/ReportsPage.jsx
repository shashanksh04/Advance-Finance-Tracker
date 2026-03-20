import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatDate, formatCurrency } from '../utils/formatters';

const ReportsPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboardSummary', 'all_time'], // Fetch all data for reports
        queryFn: () => getDashboardSummary('all_time'),
    });

    const categoryExpenses = data?.category_expenses ? 
        Object.entries(data.category_expenses)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0)
        : [];
        
    const monthlyExpenses = data?.monthly_expenses ?
        data.monthly_expenses.map(item => ({
            ...item,
            month: formatDate(item.month)
        })) : [];

    if (isLoading) {
        return <div>Loading reports...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Current Month — Expenses by Category</h2>
                    {categoryExpenses.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={categoryExpenses}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="value" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No category expense data available for the current month.</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Monthly Expenses — Past 12 Months</h2>
                    {monthlyExpenses.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={monthlyExpenses}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="total" name="Total Expenses" stroke="#3b82f6" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No monthly expense data available for the past year.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
