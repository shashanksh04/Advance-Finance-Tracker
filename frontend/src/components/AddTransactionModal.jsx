import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction, updateTransaction } from '../api/transactionApi';

const categories = [
    "Salary", "Freelance", "Investment", "Bonus", "Other Income",
    "Rent", "Groceries", "Utilities", "Transport", "Dining Out",
    "Entertainment", "Shopping", "Health", "Education", "Travel",
    "Subscription", "Loan", "Tax", "Other Expense"
];

const AddTransactionModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction added successfully!');
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add transaction.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      toast.success('Transaction updated successfully!');
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update transaction.');
    },
  });

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (editData) {
      reset({
        ...editData,
        transaction_date: new Date(editData.transaction_date).toISOString().split('T')[0]
      });
    } else {
      reset({
        transaction_date: new Date().toISOString().split('T')[0],
        credit: 0,
        debit: 0
      });
    }
  }, [editData, reset]);

  const onSubmit = (data) => {
    const payload = {
      transaction_date: data.transaction_date,
      title: data.title,
      note: data.note,
      category: data.category,
      credit: parseFloat(data.credit) || 0,
      debit: parseFloat(data.debit) || 0,
    };
    if (editData) {
        updateMutation.mutate({id: editData.id, ...payload});
    } else {
        createMutation.mutate(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{editData ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <input
              type="date"
              id="transaction_date"
              {...register('transaction_date', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
             {errors.transaction_date && <span className="text-red-500 text-sm">Date is required.</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { required: true, maxLength: 255 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
             {errors.title && <span className="text-red-500 text-sm">Title is required.</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note
            </label>
            <textarea
              id="note"
              {...register('note')}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              {...register('category', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="text-red-500 text-sm">Category is required.</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="credit" className="block text-sm font-medium text-gray-700">
                Credit (Income)
              </label>
              <input
                type="number"
                id="credit"
                {...register('credit', { min: 0 })}
                defaultValue="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="debit" className="block text-sm font-medium text-gray-700">
                Debit (Expense)
              </label>
              <input
                type="number"
                id="debit"
                {...register('debit', { min: 0 })}
                defaultValue="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isLoading || updateMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {editData ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
