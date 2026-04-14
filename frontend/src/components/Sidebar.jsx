import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, PackageSearch, Receipt, FileText, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logoutUser } = useContext(AuthContext);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Products', href: '/products', icon: PackageSearch },
    { name: 'Invoices', href: '/invoices', icon: Receipt },
    { name: 'Quotations', href: '/quotations', icon: FileText },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-sm min-h-screen flex flex-col transition-all">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
            Vaikhary Solar
          </span>
        </div>
        <nav className="flex flex-col space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 flex flex-col gap-4">
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
          <p className="text-sm font-medium text-primary-800">Need Help?</p>
          <p className="text-xs text-primary-600 mt-1">Check documentation or contact support.</p>
        </div>
        <button 
          onClick={logoutUser}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
          <span className="group-hover:text-slate-900 transition-colors">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
