import { Header } from "../../components/Header";
import "./CheckoutPage.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  /* ================= DELIVERY OPTIONS (LOAD ONCE) ================= */
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const res = await api.get("/delivery-options");
        setDeliveryOptions(res.data);
      } catch (err) {
        console.error("Delivery options error:", err);
      }
    };

    fetchDeliveryOptions();
  }, []); // ✅ FIXED (no cart dependency)

  /* ================= PAYMENT SUMMARY ================= */
  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        setLoadingPayment(true);

        const res = await api.get("/payment-summary");

        setPaymentSummary(res.data);

      } catch (err) {
        console.error("Payment error:", err);
        setPaymentSummary(null);
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPaymentSummary();
  }, [cart]); // ✅ correct dependency

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

          {loadingPayment ? (
            <div className="payment-summary">
              <p>Loading payment...</p>
            </div>
          ) : (
            <PaymentSummary
              paymentSummary={paymentSummary}
              loadCart={loadCart}
            />
          )}

        </div>
      </div>
    </>
  );
}
