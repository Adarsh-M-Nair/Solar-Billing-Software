import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Receipt, FileDown, Plus } from 'lucide-react';

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('invoices/');
      setInvoices(res.data);
    } catch (e) {
      console.error("Failed to fetch invoices", e);
    }
  };

  const downloadPdf = async (id, invoiceNumber) => {
    try {
      const response = await api.get(`invoices/${id}/download_pdf/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to download PDF", e);
      alert("Error downloading PDF");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Receipt className="w-8 h-8 text-primary-500" /> Invoices
          </h1>
          <p className="text-slate-500 mt-1">View and manage all generated invoices.</p>
        </div>
        <Link to="/invoices/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </Link>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header">Invoice No.</th>
                <th className="table-header">Date</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Total (Rs.)</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No invoices generated yet.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="table-row hover:bg-slate-50/50">
                    <td className="table-cell font-mono font-medium text-slate-800">{inv.invoice_number}</td>
                    <td className="table-cell text-slate-500">{new Date(inv.date_issued).toLocaleDateString()}</td>
                    <td className="table-cell">{inv.customer_details?.name || `Customer ID ${inv.customer}`}</td>
                    <td className="table-cell font-semibold text-slate-800">{Number(inv.grand_total).toFixed(2)}</td>
                    <td className="table-cell">
                      <button onClick={() => downloadPdf(inv.id, inv.invoice_number)} className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 hover:border-primary-200 transition-colors">
                        <FileDown className="w-4 h-4" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesList;
