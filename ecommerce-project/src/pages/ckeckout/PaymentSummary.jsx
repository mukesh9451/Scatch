import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formateMoney } from "../../utils/money";

const BASE_URL = "https://scatch-sd9g.onrender.com";

export function PaymentSummary({ paymentSummary, loadCart }) {

  const navigate = useNavigate();

  const createOrder = async () => {
    await axios.post(
      `${BASE_URL}/api/orders`,
      {},
      { withCredentials: true }
    );

    await loadCart();
    navigate("/orders");
  };

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>

      {paymentSummary && (
        <>
          <div>Items: {paymentSummary.totalItems}</div>
          <div>{formateMoney(paymentSummary.totalCostCents)}</div>

          <button onClick={createOrder}>
            Place your order
          </button>
        </>
      )}
    </div>
  );
}
