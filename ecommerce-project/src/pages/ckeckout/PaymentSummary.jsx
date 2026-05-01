import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formateMoney } from "../../utils/money";

// ✅ backend URL
const BASE_URL = "https://scatch-sd9g.onrender.com";

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();

  const createOrder = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/orders`,
        {},
        {
          withCredentials: true
        }
      );

      await loadCart();
      navigate("/orders");

    } catch (err) {
      console.error("Order error:", err);
    }
  };

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">
        Payment Summary
      </div>

      {paymentSummary && (
        <>
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

          <button
            className="place-order-button button-primary"
            onClick={createOrder}
          >
            Place your order
          </button>
        </>
      )}
    </div>
  );
}
