import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import "./TrackingPage.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import dayjs from "dayjs";

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    fetchTrackingData();
  }, [orderId]);

  if (!order) {
    return <p style={{ padding: "20px" }}>Loading tracking...</p>;
  }

  // 🔥 Find correct product
  const orderProduct = order.products.find((p) => {
    return p.productId?.toString() === productId;
  });

  if (!orderProduct) {
    return <p style={{ padding: "20px" }}>Product not found</p>;
  }

  // 🔥 SAFE CALCULATION
  const totalDeliveryTimeMs =
    orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;

  const timePassedMs = Date.now() - order.orderTimeMs;

  let deliveryPercent = 0;

  if (totalDeliveryTimeMs > 0) {
    deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  }

  if (deliveryPercent < 0) deliveryPercent = 0;
  if (deliveryPercent > 100) deliveryPercent = 100;

  const isPreparing = deliveryPercent < 33;
  const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
  const isDelivered = deliveryPercent === 100;

  // 🔥 FIX IMAGE PATH
  const imageUrl = orderProduct.product?.image
    ? `https://scatch-sd9g.onrender.com/${orderProduct.product.image}`
    : "https://via.placeholder.com/150";

  const productName = orderProduct.product?.name || "Product";

  return (
    <>
      <Header cart={cart} />

      <div className="tracking-page">

        <Link className="back-to-orders-link" to="/orders">
          ← View all orders
        </Link>

        <div className="tracking-card">

          <img
            className="product-image"
            src={imageUrl}
            alt={productName}
          />

          <div className="tracking-info">

            <div className="delivery-date">
              {deliveryPercent === 100 ? "Delivered on" : "Arriving on"}{" "}
              {dayjs(orderProduct.estimatedDeliveryTimeMs).format(
                "dddd, MMMM D"
              )}
            </div>

            <div className="product-info">{productName}</div>

            <div className="product-info">
              Quantity: {orderProduct.quantity}
            </div>

            {/* STATUS LABELS */}
            <div className="progress-labels-container">
              <div className={isPreparing ? "current-status" : ""}>
                Preparing
              </div>

              <div className={isShipped ? "current-status" : ""}>
                Shipped
              </div>

              <div className={isDelivered ? "current-status" : ""}>
                Delivered
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${deliveryPercent}%` }}
              ></div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
