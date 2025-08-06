import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import SalesDashboard from './pages/dashboards/SalesDashboard';
import SellerPortal from './pages/seller/SellerPortal';
import SellerLogin from './pages/seller/SellerLogin';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Role } from './types';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-neutral-50 font-poppins">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/sales" element={
                <ProtectedRoute allowedRoles={[Role.SALES]}>
                  <SalesDashboard />
                </ProtectedRoute>
              } />
              
              {/* Seller Portal */}
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/*" element={
                <ProtectedRoute allowedRoles={[Role.SELLER]}>
                  <SellerPortal />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;