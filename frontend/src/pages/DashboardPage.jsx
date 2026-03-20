import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardSummary } from '../api/dashboardApi';
import { getTransactions } from '../api/transactionApi';

import SummaryCards from '../components/SummaryCards';
import TransactionTable from '../components/TransactionTable';
import AddTransactionModal from '../components/AddTransactionModal';

import { getGreeting } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const dateRanges = [
    { label: 'Current Month', value: 'current_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'Last 6 Months', value: 'last_6_months' },
    { label: 'Last 1 Year', value: 'last_1_year' },
    { label: 'Last 2 Years', value: 'last_2_years' },
    { label: 'Last 5 Years', value: 'last_5_years' },
];

const DashboardPage = () => {
    const [selectedRange, setSelectedRange] = useState('current_month');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const { user } = useAuth();

    const queryClient = useQueryClient();

    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['dashboardSummary', selectedRange],
        queryFn: () => getDashboardSummary(selectedRange),
    });

    const { data: transactionsData, isLoading: areTransactionsLoading } = useQuery({
        queryKey: ['transactions', selectedRange],
        queryFn: () => getTransactions(selectedRange),
    });
    
    const handleEdit = (transaction) => {
        setEditData(transaction);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditData(null);
        setModalOpen(false);
    }
    
    const handleSuccess = () => {
        queryClient.invalidateQueries(['dashboardSummary', selectedRange]);
        queryClient.invalidateQueries(['transactions', selectedRange]);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{getGreeting()}, {user?.username}!</h1>
            <SummaryCards 
                total_income={summaryData?.total_income || 0}
                total_expenses={summaryData?.total_expenses || 0}
                net_balance={summaryData?.net_balance || 0}
                isLoading={isSummaryLoading}
            />

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-wrap gap-2">
                    {dateRanges.map(range => (
                        <button 
                            key={range.value}
                            onClick={() => setSelectedRange(range.value)}
                            className={`px-4 py-2 text-sm font-medium rounded-md
                                ${selectedRange === range.value 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                                }`
                            }
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <TransactionTable
                transactions={transactionsData || []}
                isLoading={areTransactionsLoading}
                onEdit={handleEdit}
                onDeleteSuccess={handleSuccess}
            />
            
            {isModalOpen && (
                 <AddTransactionModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                    editData={editData}
                />
            )}
        </div>
    );
};

export default DashboardPage;
