import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import dayjs from "dayjs";
import { Header } from "../../components/Header";

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get("/orders");
        const orders = res.data;

        const foundOrder = orders.find(
          (o) => o._id === orderId
        );

        if (!foundOrder) return;

        setOrder(foundOrder);

        // 🔥 FIX: safely find product
        const foundProduct = foundOrder.products.find(
          (p) => p.productId === productId
        );

        if (!foundProduct) return;

        setProduct(foundProduct);

      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    fetchOrder();
  }, [orderId, productId]);

  if (!order || !product) {
    return <p style={{ padding: "20px" }}>Loading tracking info...</p>;
  }

  // 🔥 FIX: calculate delivery date
  const deliveryDate = dayjs(product.estimatedDeliveryTimeMs)
    .format("dddd, MMMM D");

  return (
    <>
      <Header cart={cart} />

      <div style={{ padding: "30px" }}>
        <h2>Tracking your order</h2>

        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Product ID:</strong> {product.productId}</p>

        <p>
          <strong>Estimated Delivery:</strong> {deliveryDate}
        </p>
      </div>
    </>
  );
}
