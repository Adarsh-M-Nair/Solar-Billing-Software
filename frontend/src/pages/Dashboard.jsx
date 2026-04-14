import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Receipt, TrendingUp, Plus } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    invoices: 0,
    products: 0,
  });

  useEffect(() => {
    // Quick fetches for dashboard counts
    const fetchStats = async () => {
      try {
        const [cRes, iRes, pRes] = await Promise.all([
          api.get('customers/'),
          api.get('invoices/'),
          api.get('products/')
        ]);
        setStats({
          customers: cRes.data.length,
          invoices: iRes.data.length,
          products: pRes.data.length
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Customers', value: stats.customers, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Total Invoices', value: stats.invoices, icon: Receipt, color: 'from-primary-500 to-primary-600' },
    { title: 'Products/Packages', value: stats.products, icon: FileText, color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back to Vaikhary Solar Management.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/invoices/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel p-6 flex items-center gap-4 group cursor-pointer hover:border-primary-200 transition-all">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Invoices</h2>
            <Link to="/invoices" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Receipt className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500">Navigate to invoices tab to view list.</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Link to="/customers" className="p-4 border border-slate-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/50 transition-all flex flex-col items-center text-center gap-2 group">
                <Users className="w-6 h-6 text-slate-400 group-hover:text-primary-500" />
                <span className="text-sm font-medium text-slate-600">Manage Customers</span>
             </Link>
             <Link to="/products" className="p-4 border border-slate-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/50 transition-all flex flex-col items-center text-center gap-2 group">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary-500" />
                <span className="text-sm font-medium text-slate-600">Manage Products</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
