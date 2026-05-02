import { Header } from "../../components/Header";
import "./CheckoutPage.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    api.get("/delivery-options")
      .then(res => setDeliveryOptions(res.data))
      .catch(console.error);
  }, [cart]);

  useEffect(() => {
    api.get("/payment-summary")
      .then(res => setPaymentSummary(res.data))
      .catch(console.error);
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
