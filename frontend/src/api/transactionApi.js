import axiosInstance from './axiosInstance';

export const getTransactions = async (range = 'current_month') => {
  const response = await axiosInstance.get(`/transactions/?range=${range}`);
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await axiosInstance.post('/transactions/', data);
  return response.data;
};

export const updateTransaction = async ({id, ...data}) => {
  const response = await axiosInstance.put(`/transactions/${id}/`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await axiosInstance.delete(`/transactions/${id}/`);
  return response.data;
};
