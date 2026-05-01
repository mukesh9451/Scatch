import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import "./TrackingPage.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await axios.get(
          `/api/orders/${orderId}?expand=products`
        );
        setOrder(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrackingData();
  }, [orderId]);

  if (!order) {
    return null;
  }

  // 🔥 FIX: convert to string
 const orderProduct = order.products.find((p) => {
  const id = p.productId || p.product?._id;
  return id?.toString() === productId;
});

  // 🔥 SAFETY CHECK
  if (!orderProduct) {
    return <div>Product not found in this order</div>;
  }

  const totalDeliveryTimeMs =
    orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;

  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;

  let deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;

  if (deliveryPercent > 100) deliveryPercent = 100;

  const isPreparing = deliveryPercent < 33;
  const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
  const isDelivered = deliveryPercent === 100;

  return (
    <>
      <title>Tracking</title>
      <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">

          {/* 🔥 FIX */}
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100 ? "Delivered on" : "Arriving on"}{" "}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format(
              "dddd, MMMM, D"
            )}
          </div>

          <div className="product-info">
            {orderProduct.product?.name}
          </div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img
            className="product-image"
            src={orderProduct.product?.image}
          />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing ? "current-status" : ""}`}>
              Preparing
            </div>
            <div className={`progress-label ${isShipped ? "current-status" : ""}`}>
              Shipped
            </div>
            <div className={`progress-label ${isDelivered ? "current-status" : ""}`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${deliveryPercent}%` }}
            ></div>
          </div>

        </div>
      </div>
    </>
  );
}