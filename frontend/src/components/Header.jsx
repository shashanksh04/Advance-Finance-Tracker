import React from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onAddTransaction }) => {
  const { logout, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center justify-between px-6">
      <div className="text-2xl font-bold text-blue-600">Finance Tracker</div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onAddTransaction}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Plus size={20} className="mr-2" />
          Add Transaction
        </button>
        <span className="text-sm text-gray-600">Hi, {user?.username}</span>
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
