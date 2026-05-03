import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { formateMoney } from "../../utils/money";

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const createOrder = async () => {
    try {
      setIsPlacingOrder(true);
      setError("");

      await api.post("/orders"); // ✅ correct route

      await loadCart(); // 🔥 clear cart after order

      navigate("/orders");

    } catch (err) {
      console.error("Order failed:", err);
      setError("Failed to place order. Try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!paymentSummary) {
    return <p>Loading payment...</p>;
  }

  return (
    <div className="payment-summary">

      <div className="payment-summary-title">
        Payment Summary
      </div>

      <div className="payment-summary-row">
        <div>Items ({paymentSummary.totalItems}):</div>
        <div className="payment-summary-money">
          {formateMoney(paymentSummary.productCostCents)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Shipping & handling:</div>
        <div className="payment-summary-money">
          {formateMoney(paymentSummary.shippingCostCents)}
        </div>
      </div>

      <div className="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div className="payment-summary-money">
          {formateMoney(paymentSummary.totalCostBeforeTaxCents)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div className="payment-summary-money">
          {formateMoney(paymentSummary.taxCents)}
        </div>
      </div>

      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div className="payment-summary-money">
          {formateMoney(paymentSummary.totalCostCents)}
        </div>
      </div>

      {/* 🔥 ERROR MESSAGE */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <button
        className="place-order-button button-primary"
        onClick={createOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? "Placing Order..." : "Place your order"}
      </button>

    </div>
  );
}
