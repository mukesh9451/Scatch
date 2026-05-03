import { Header } from "../../components/Header";
import "./CheckoutPage.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage({ cart, loadCart }) {

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  /* ================= DELIVERY OPTIONS (LOAD ONCE) ================= */
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const res = await api.get("/delivery-options");
        setDeliveryOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDeliveryOptions();
  }, []);

  /* ================= PAYMENT SUMMARY (SAFE) ================= */
  useEffect(() => {
    let ignore = false;

    const fetchPayment = async () => {
      try {
        const res = await api.get("/payment-summary");

        if (!ignore) {
          setPaymentSummary(res.data);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchPayment();

    return () => {
      ignore = true;
    };

  }, [cart]); // ✅ only when cart changes

  return (
    <>
      <Header cart={cart} />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">

          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />

          <PaymentSummary
            paymentSummary={paymentSummary}
            loadCart={loadCart}
          />

        </div>
      </div>
    </>
  );
}
