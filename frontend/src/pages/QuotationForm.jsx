import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Plus, Trash2, ArrowLeft, FileText } from 'lucide-react';

const QuotationForm = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1, unit_price: 0 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('customers/'),
          api.get('products/')
        ]);
        setCustomers(cRes.data);
        setProducts(pRes.data);
      } catch (e) {
        console.error("Failed to load select data", e);
      }
    };
    fetchData();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'product') {
      const prod = products.find(p => p.id.toString() === value);
      newItems[index] = { ...newItems[index], product: value, unit_price: prod ? Number(prod.unit_price) : 0 };
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index) => {
    if(items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, current) => acc + (current.quantity * current.unit_price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
       alert("Please select a customer.");
       return;
    }
    const cleanItems = items.filter(i => i.product !== '');
    if (cleanItems.length === 0) {
       alert("Please add at least one product.");
       return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer: selectedCustomer,
        items: cleanItems
      };
      const res = await api.post('quotations/', payload);
      alert('Quotation created successfully!');
      navigate('/quotations');
    } catch (e) {
      console.error(e);
      alert("Error creating quotation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/quotations')} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            Create Quotation
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b border-slate-100 pb-2">Customer Details</h2>
          <select 
            required 
            className="input-field"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- Select Customer --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
            ))}
          </select>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Line Items</h2>
            <button type="button" onClick={addItem} className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors">
              <Plus className="w-4 h-4"/> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Product</label>
                  <select
                    required
                    className="input-field py-1.5 text-sm"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                  >
                    <option value="">Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - Rs.{Number(p.unit_price).toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="input-field py-1.5 text-sm"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Line Total</label>
                  <div className="py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 px-3 rounded-lg border border-slate-200">
                    Rs.{(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[250px]">
              <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                <span>Subtotal (Before GST):</span>
                <span className="font-semibold text-slate-800">Rs.{calculateSubtotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-200 pt-2 text-center">
                GST is automatically calculated upon submission.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
           <button type="button" onClick={() => navigate('/quotations')} className="btn-secondary">Cancel</button>
           <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
             <FileText className="w-4 h-4"/> {isSubmitting ? 'Saving...' : 'Generate Quotation'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationForm;
