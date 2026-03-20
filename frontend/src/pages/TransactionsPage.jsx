import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions } from '../api/transactionApi';
import TransactionTable from '../components/TransactionTable';
import AddTransactionModal from '../components/AddTransactionModal';

const dateRanges = [
    { label: 'Current Month', value: 'current_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'Last 6 Months', value: 'last_6_months' },
    { label: 'Last 1 Year', value: 'last_1_year' },
    { label: 'Last 2 Years', value: 'last_2_years' },
    { label: 'Last 5 Years', value: 'last_5_years' },
    { label: 'All Time', value: 'all_time'}
];

const TransactionsPage = () => {
    const [selectedRange, setSelectedRange] = useState('current_month');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const queryClient = useQueryClient();

    const { data: transactions, isLoading } = useQuery({
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
    };
    
    const handleSuccess = () => {
        queryClient.invalidateQueries(['transactions', selectedRange]);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">All Transactions</h1>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full">
                    {transactions?.length || 0} total
                </span>
            </div>

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
                transactions={transactions || []}
                isLoading={isLoading}
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

export default TransactionsPage;
