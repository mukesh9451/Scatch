import axios from "axios";
import { Header } from "../../components/Header";
import "./CheckoutPage.css";
import { useEffect, useState } from "react";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

// ✅ backend URL
const BASE_URL = "https://scatch-sd9g.onrender.com";

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  // ================= DELIVERY OPTIONS =================
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/delivery-options?expand=estimatedDeliveryTime`
        );

        setDeliveryOptions(response.data);
        console.log("Delivery:", response.data);
      } catch (err) {
        console.error("Delivery error:", err);
      }
    };

    fetchCheckoutData();
  }, [cart]);

  // ================= PAYMENT SUMMARY =================
  useEffect(() => {
    const fetchPaymentSummaryData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment-summary`,
          {
            withCredentials: true
          }
        );

        setPaymentSummary(response.data);
        console.log("Payment:", response.data);
      } catch (err) {
        console.error("Payment error:", err);
      }
    };

    fetchPaymentSummaryData();
  }, [cart]);

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
