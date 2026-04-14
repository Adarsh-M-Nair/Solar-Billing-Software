import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import InvoicesList from './pages/InvoicesList';
import InvoiceForm from './pages/InvoiceForm';
import QuotationsList from './pages/QuotationsList';
import QuotationForm from './pages/QuotationForm';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<Products />} />
              <Route path="invoices" element={<InvoicesList />} />
              <Route path="invoices/new" element={<InvoiceForm />} />
              <Route path="quotations" element={<QuotationsList />} />
              <Route path="quotations/new" element={<QuotationForm />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
