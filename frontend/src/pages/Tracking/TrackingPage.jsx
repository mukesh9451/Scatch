import "./TrackingPage.css";
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

        const foundOrder = orders.find(o => o._id === orderId);
        if (!foundOrder) return;

        setOrder(foundOrder);

        const foundProduct = foundOrder.products.find(
          (p) => p.productId === productId
        );

        if (!foundProduct) return;

        setProduct(foundProduct);

      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [orderId, productId]);

  if (!order || !product) {
    return <p style={{ padding: "20px" }}>Loading tracking...</p>;
  }

  const deliveryDate = dayjs(product.estimatedDeliveryTimeMs)
    .format("dddd, MMMM D");

  return (
    <>
      <Header cart={cart} />

      <div className="tracking-page">
        <div className="tracking-title">Tracking your order</div>

        <div className="tracking-card">

          {/* IMAGE (optional if you fetch product later) */}
          <img
            src={`https://scatch-sd9g.onrender.com/images/products/placeholder.png`}
            alt="product"
            className="tracking-image"
          />

          <div className="tracking-info">
            <p>
              <span className="tracking-label">Order ID:</span> {order._id}
            </p>

            <p>
              <span className="tracking-label">Product ID:</span> {product.productId}
            </p>

            <p>
              <span className="tracking-label">Estimated Delivery:</span> {deliveryDate}
            </p>

            <p className="tracking-status">
              Status: In Transit 🚚
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
