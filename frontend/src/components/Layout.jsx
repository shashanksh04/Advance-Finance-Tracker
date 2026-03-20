import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AddTransactionModal from './AddTransactionModal';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const handleAddTransaction = () => {
      setModalOpen(true);
  }
  
  const handleCloseModal = () => {
      setModalOpen(false);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <Header onAddTransaction={handleAddTransaction} />
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => { /* In a real app, you'd probably refetch data here */ }}
      />
    </div>
  );
};

export default Layout;
