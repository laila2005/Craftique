import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/user/Profile';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerLogin from './pages/seller/Login';
import SellerRegister from './pages/seller/Register';
import SellerDashboard from './pages/seller/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="success" element={<OrderSuccess />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Seller Auth Routes */}
        <Route path="seller/login" element={<SellerLogin />} />
        <Route path="seller/register" element={<SellerRegister />} />
        <Route path="seller/dashboard" element={
          <PrivateRoute requireSeller={true}>
            <SellerDashboard />
          </PrivateRoute>
        } />
      </Route>

      {/* Admin Panel Routes */}
      <Route path="/admin" element={
        <PrivateRoute requireAdmin={true}>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
