import React from 'react';
import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, LayoutDashboard, Receipt, BarChart2, User, Wallet } from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/transactions', icon: <Receipt size={20} />, text: 'Transactions' },
    { to: '/reports', icon: <BarChart2 size={20} />, text: 'Reports' },
    { to: '/profile', icon: <User size={20} />, text: 'Profile' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-sidebar text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {isCollapsed ? (
            <Wallet size={24} />
        ) : (
            <h1 className="text-xl font-bold">Finance Tracker</h1>
        )}
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-full">
          {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-slate-800 ${isActive ? 'bg-primary' : ''}`
                }
              >
                <div className="flex items-center justify-center w-8">{item.icon}</div>
                {!isCollapsed && <span className="ml-4">{item.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
