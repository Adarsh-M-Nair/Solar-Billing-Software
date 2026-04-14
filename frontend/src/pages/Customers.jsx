import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, User, MapPin, Pencil } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone_number: '', address: '', state: '' });

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
      if (formData.id) {
        await api.put(`customers/${formData.id}/`, formData);
      } else {
        await api.post('customers/', formData);
      }
      setFormData({ name: '', phone_number: '', address: '', state: '' });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (e) {
      console.error(e);
      alert("Error saving customer.");
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <User className="w-8 h-8 text-primary-500" /> Customers
          </h1>
          <p className="text-slate-500 mt-1">Manage your clients and their contact details.</p>
        </div>
        <button onClick={() => { setFormData({ name: '', phone_number: '', address: '', state: '' }); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header">Name</th>
                <th className="table-header">Phone Number</th>
                <th className="table-header">State</th>
                <th className="table-header">Address</th>
                <th className="table-header text-right">Actions</th>
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
                    <td className="table-cell font-mono text-xs">{c.phone_number || '-'}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <MapPin className="w-3 h-3" /> {c.state}
                      </span>
                    </td>
                    <td className="table-cell break-words whitespace-normal max-w-xs">{c.address}</td>
                    <td className="table-cell text-right">
                      <button onClick={() => handleEdit(c)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
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
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{formData.id ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company/Name *</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vaikhary Solar Pvt Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="text" className="input-field font-mono" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} placeholder="+91 9876543210" />
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
