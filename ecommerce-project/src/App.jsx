import axios from 'axios'
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { HomePage } from './pages/home/HomePage'
import { CheckoutPage } from './pages/ckeckout/CheckoutPage'
import { OrdersPage } from './pages/orders/OrdersPage'
import { TrackingPage } from './pages/Tracking/TrackingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AddProductPage } from "./pages/home/AddProductPage"

import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Logout from './components/Auth/Logout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

import api from './services/api'; // ✅ USE THIS

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart-items"); // ✅ FIXED

      console.log("CART API:", res.data);

      setCart(res.data || []); // ❌ REMOVE FILTER
    } catch (err) {
      console.error("Cart load error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return ( ... );
}

  return (
    <Routes>

      <Route index element={<Navigate to="/home" />} />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* ADMIN ONLY */}
      <Route
        path="addProduct"
        element={
          <ProtectedRoute role="admin">
            <AddProductPage cart={cart} />
          </ProtectedRoute>
        }
      />

      {/* USER */}
      <Route path="home" element={
        <ProtectedRoute>
          <HomePage cart={cart} loadCart={loadCart} />
        </ProtectedRoute>
      } />

      <Route path="checkout" element={
        <ProtectedRoute>
          <CheckoutPage cart={cart} loadCart={loadCart} />
        </ProtectedRoute>
      } />

      <Route path="orders" element={
        <ProtectedRoute>
          <OrdersPage cart={cart} loadCart={loadCart} />
        </ProtectedRoute>
      } />

      <Route path="tracking/:orderId/:productId" element={
        <ProtectedRoute>
          <TrackingPage cart={cart} />
        </ProtectedRoute>
      } />

      <Route path="logout" element={<Logout />} />
      <Route path="*" element={<NotFoundPage cart={cart} />} />

    </Routes>
  );
}

export default App;
