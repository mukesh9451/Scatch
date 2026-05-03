import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import "./OrdersPage.css";
import { OrderGrid } from "./OrderGrid";
import api from "../../services/api"; // ✅ USE THIS

export function OrdersPage({ cart, loadCart }) {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const res = await api.get("/orders?expand=products");

        console.log("ORDERS:", res.data);

        // ✅ SAFETY CHECK
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error("ORDER ERROR:", error);
        setOrders([]);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <OrderGrid orders={orders} loadCart={loadCart} />
      </div>
    </>
  );
}
