import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, PackageSearch, Tag } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', unit_price: '', gst_rate: '12.00' });

  const fetchProducts = async () => {
    try {
      const res = await api.get('products/');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('products/', formData);
      setFormData({ name: '', description: '', unit_price: '', gst_rate: '12.00' });
      setIsModalOpen(false);
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert("Error adding product.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <PackageSearch className="w-8 h-8 text-emerald-500" /> Products
          </h1>
          <p className="text-slate-500 mt-1">Manage components, panels, and inverters.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header">Component Name</th>
                <th className="table-header">Description</th>
                <th className="table-header">Unit Price (Rs.)</th>
                <th className="table-header">GST Rate</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="table-row hover:bg-slate-50/50">
                    <td className="table-cell font-medium text-slate-800">{p.name}</td>
                    <td className="table-cell text-slate-500 max-w-xs truncate">{p.description}</td>
                    <td className="table-cell font-mono text-emerald-600 font-semibold">{Number(p.unit_price).toFixed(2)}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        <Tag className="w-3 h-3" /> {Number(p.gst_rate)}%
                      </span>
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
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. 330W Mono Panel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input type="text" className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (Rs.) *</label>
                  <input required type="number" step="0.01" className="input-field" value={formData.unit_price} onChange={e => setFormData({ ...formData, unit_price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GST Rate (%) *</label>
                  <select className="input-field" value={formData.gst_rate} onChange={e => setFormData({ ...formData, gst_rate: e.target.value })}>
                    <option value="0.00">0%</option>
                    <option value="5.00">5%</option>
                    <option value="12.00">12%</option>
                    <option value="18.00">18%</option>
                    <option value="28.00">28%</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
