import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import api from './services/api';

import { HomePage } from './pages/home/HomePage';
import { CheckoutPage } from './pages/ckeckout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/Tracking/TrackingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AddProductPage } from "./pages/home/AddProductPage";

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Logout from './components/Auth/Logout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {

  const [cart, setCart] = useState([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  /* ================= LOAD CART ================= */
  const loadCart = async () => {
    try {
      const res = await api.get("/cart-items"); // ✅ CORRECT ROUTE
      setCart(res.data || []);
    } catch (err) {
      setCart([]);
    }
  };

  /* ================= CHECK AUTH FIRST ================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/profile");
        await loadCart(); // only load cart if logged in
      } catch {
        setCart([]);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // ⏳ prevent app from rendering too early
  if (!isAuthChecked) {
    return <div style={{ padding: "20px" }}>Loading app...</div>;
  }

  return (
    <Routes>

      <Route index element={<Navigate to="/home" />} />

      {/* PUBLIC */}
      <Route path="login" element={<Login loadCart={loadCart} />} />
      <Route path="register" element={<Register />} />

      {/* ADMIN */}
      <Route
        path="addProduct"
        element={
          <ProtectedRoute role="admin">
            <AddProductPage cart={cart} />
          </ProtectedRoute>
        }
      />

      {/* USER */}
      <Route
        path="home"
        element={
          <ProtectedRoute>
            <HomePage cart={cart} loadCart={loadCart} />
          </ProtectedRoute>
        }
      />

      <Route
        path="checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage cart={cart} loadCart={loadCart} />
          </ProtectedRoute>
        }
      />

      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <OrdersPage cart={cart} loadCart={loadCart} />
          </ProtectedRoute>
        }
      />

      <Route
        path="tracking/:orderId/:productId"
        element={
          <ProtectedRoute>
            <TrackingPage cart={cart} />
          </ProtectedRoute>
        }
      />

      <Route path="logout" element={<Logout setCart={setCart} />} />

      <Route path="*" element={<NotFoundPage cart={cart} />} />

    </Routes>
  );
}

export default App;
