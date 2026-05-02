import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import dayjs from "dayjs";
import { Header } from "../../components/Header";

export function TrackingPage({ cart }) {

  const { orderId, productId } = useParams();

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        const res = await api.get(`/orders/${orderId}?expand=products`);

        const orderData = res.data;
        setOrder(orderData);

        // ✅ SAFE FIND (fixes your error)
        const foundProduct = Array.isArray(orderData.products)
          ? orderData.products.find(
              (p) =>
                p.productId === productId ||
                p.product?._id === productId
            )
          : null;

        setProduct(foundProduct);

      } catch (err) {
        console.error("TRACKING ERROR:", err);
      }
    };

    loadTracking();
  }, [orderId, productId]);

  // ✅ LOADING STATE
  if (!order || !product) {
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
            src={`https://scatch-sd9g.onrender.com/${product.product.image}`}
            alt=""
            style={{ width: "150px" }}
          />

          <div>
            <p><strong>Product:</strong> {product.product.name}</p>

            <p>
              <strong>Delivery Date:</strong>{" "}
              {dayjs(product.estimatedDeliveryTimeMs).format("MMMM D")}
            </p>

            <p><strong>Status:</strong> In Transit 🚚</p>
          </div>

        </div>

      </div>
    </>
  );
}
