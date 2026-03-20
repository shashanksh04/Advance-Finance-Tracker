import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '../api/transactionApi';
import { formatDate, formatCurrency, formatTimestamp } from '../utils/formatters';

const categoryColors = {
    "Salary": "bg-green-100 text-green-800",
    "Freelance": "bg-green-100 text-green-800",
    "Investment": "bg-blue-100 text-blue-800",
    "Bonus": "bg-yellow-100 text-yellow-800",
    "Other Income": "bg-indigo-100 text-indigo-800",
    "Rent": "bg-red-100 text-red-800",
    "Groceries": "bg-red-100 text-red-800",
    "Utilities": "bg-red-100 text-red-800",
    "Transport": "bg-purple-100 text-purple-800",
    "Dining Out": "bg-pink-100 text-pink-800",
    "Entertainment": "bg-pink-100 text-pink-800",
    "Shopping": "bg-pink-100 text-pink-800",
    "Health": "bg-orange-100 text-orange-800",
    "Education": "bg-blue-100 text-blue-800",
    "Travel": "bg-teal-100 text-teal-800",
    "Subscription": "bg-gray-100 text-gray-800",
    "Loan": "bg-red-100 text-red-800",
    "Tax": "bg-red-100 text-red-800",
    "Other Expense": "bg-gray-100 text-gray-800"
};

const TransactionTable = ({ transactions, isLoading, onEdit, onDeleteSuccess }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const rowsPerPage = 20;

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            toast.success('Transaction deleted successfully!');
            queryClient.invalidateQueries(['transactions']);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete transaction.');
        }
    });

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this transaction?')) {
            deleteMutation.mutate(id);
        }
    }

  const filteredTransactions = transactions.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded w-full mb-2"></div>
                ))}
            </div>
        </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
            <input 
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
        </div>
        {filteredTransactions.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-gray-500">No transactions found</p>
            </div>
        ) : (
            <>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(transaction.transaction_date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.note}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[transaction.category] || 'bg-gray-100 text-gray-800'}`}>
                                    {transaction.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => onEdit(transaction)} className="text-blue-600 hover:text-blue-900 mr-4"><Pencil size={18}/></button>
                                <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                 <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(filteredTransactions.length / rowsPerPage)}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTransactions.length / rowsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredTransactions.length / rowsPerPage)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </>
        )}
    </div>
  );
};

export default TransactionTable;
