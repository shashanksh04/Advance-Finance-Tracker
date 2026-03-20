import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const SummaryCards = ({ total_income, total_expenses, net_balance, isLoading }) => {
  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(total_income),
      icon: <TrendingUp className="text-green-500" />,
      color: 'text-green-500',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(total_expenses),
      icon: <TrendingDown className="text-red-500" />,
      color: 'text-red-500',
    },
    {
      title: 'Net Balance',
      value: formatCurrency(net_balance),
      icon: <Wallet className="text-blue-500" />,
      color: net_balance >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-500">{card.title}</h3>
            {card.icon}
          </div>
          <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
