import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, User, MapPin } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', gstin: '', address: '', state: '' });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('customers/');
      setCustomers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('customers/', formData);
      setFormData({ name: '', gstin: '', address: '', state: '' });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (e) {
      console.error(e);
      alert("Error adding customer.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <User className="w-8 h-8 text-primary-500" /> Customers
          </h1>
          <p className="text-slate-500 mt-1">Manage your clients and their GST details.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header">Name</th>
                <th className="table-header">GSTIN</th>
                <th className="table-header">State</th>
                <th className="table-header">Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">No customers found.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell font-medium text-slate-800">{c.name}</td>
                    <td className="table-cell font-mono text-xs">{c.gstin}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <MapPin className="w-3 h-3" /> {c.state}
                      </span>
                    </td>
                    <td className="table-cell break-words whitespace-normal max-w-xs">{c.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md p-6 animate-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company/Name *</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vaikhary Solar Pvt Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN *</label>
                <input required type="text" className="input-field font-mono" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value.toUpperCase()})} placeholder="29ABCDE1234F1Z5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <input required type="text" className="input-field" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="Kerala" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                <textarea required className="input-field" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
