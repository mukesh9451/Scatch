import axios from "axios";
import { Header } from "../../components/Header";
import "./CheckoutPage.css";
import { useEffect, useState } from "react";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

const BASE_URL = "https://scatch-sd9g.onrender.com";

export function CheckoutPage({ cart, loadCart }) {

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/delivery-options`)
      .then(res => setDeliveryOptions(res.data));
  }, [cart]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/payment-summary`, {
        withCredentials: true
      })
      .then(res => setPaymentSummary(res.data))
      .catch(err => console.error(err));
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
