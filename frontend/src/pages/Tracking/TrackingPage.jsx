import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import dayjs from "dayjs";
import { Header } from "../../components/Header";
import "./TrackingPage.css"; // ✅ IMPORTANT

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();

  const [orderProduct, setOrderProduct] = useState(null);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        const res = await api.get(`/orders/${orderId}?expand=products`);

        const orderData = res.data;

        const found = Array.isArray(orderData?.products)
          ? orderData.products.find((p) => {
              const id =
                p?._doc?.productId ||
                p?.productId ||
                p?.product?._id;

              return id?.toString() === productId;
            })
          : null;

        setOrderProduct(found || null);

      } catch (err) {
        console.error("TRACKING ERROR:", err);
      }
    };

    loadTracking();
  }, [orderId, productId]);

  // ✅ LOADING STATE
  if (!orderProduct || !orderProduct.product) {
    return (
      <>
        <Header cart={cart} />
        <div className="tracking-page">
          <p>Loading tracking...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header cart={cart} />

      <div className="tracking-page">

        {/* BACK LINK */}
        <Link to="/orders" className="back-to-orders-link">
          ← View all orders
        </Link>

        {/* DELIVERY DATE */}
        <div className="delivery-date">
          Arriving on{" "}
          {dayjs(orderProduct._doc.estimatedDeliveryTimeMs).format("MMMM D")}
        </div>

        {/* PRODUCT INFO */}
        <div className="product-info">
          Product: {orderProduct.product.name}
        </div>

        {/* IMAGE */}
        <img
          className="product-image"
          src={`https://scatch-sd9g.onrender.com/${orderProduct.product.image}`}
          alt={orderProduct.product.name}
        />

        {/* PROGRESS LABELS */}
        <div className="progress-labels-container">
          <div className="progress-label">Preparing</div>
          <div className="progress-label current-status">Shipped</div>
          <div className="progress-label">Delivered</div>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: "60%" }}
          ></div>
        </div>

      </div>
    </>
  );
}
