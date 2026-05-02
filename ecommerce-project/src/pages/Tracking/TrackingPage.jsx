import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import dayjs from "dayjs";
import { Header } from "../../components/Header";

export function TrackingPage({ cart }) {

  const { orderId, productId } = useParams();

  const [order, setOrder] = useState(null);
  const [orderProduct, setOrderProduct] = useState(null);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        const res = await api.get(`/orders/${orderId}?expand=products`);

        console.log("TRACKING API:", res.data);

        const orderData = res.data;

        setOrder(orderData);

        // 🔥 SAFE FIND (THIS FIXES YOUR ERROR)
        if (orderData && Array.isArray(orderData.products)) {

          const found = orderData.products.find((p) =>
            p.productId === productId ||
            p.product?._id === productId
          );

          setOrderProduct(found || null);

        } else {
          setOrderProduct(null);
        }

      } catch (err) {
        console.error("TRACKING ERROR:", err);
        setOrder(null);
        setOrderProduct(null);
      }
    };

    loadTracking();
  }, [orderId, productId]);

  // 🔥 SAFE RENDER (NO CRASH)
  if (!order || !orderProduct || !orderProduct.product) {
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

        <h2>Tracking Details</h2>

        <div className="tracking-container">

          <img
            src={`https://scatch-sd9g.onrender.com/${orderProduct.product.image}`}
            alt={orderProduct.product.name}
            style={{ width: "150px" }}
          />

          <div>
            <p><strong>Product:</strong> {orderProduct.product.name}</p>

            <p>
              <strong>Delivery Date:</strong>{" "}
              {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
            </p>

            <p><strong>Status:</strong> In Transit 🚚</p>
          </div>

        </div>

      </div>
    </>
  );
}
