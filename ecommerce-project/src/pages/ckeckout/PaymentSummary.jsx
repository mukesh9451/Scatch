import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { formateMoney } from "../../utils/money";

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();

  if (!paymentSummary) return <p>Loading payment...</p>;

  const createOrder = async () => {
    await api.post("/orders");
    await loadCart();
    navigate("/orders");
  };

  return (
    <div>
      <h3>Payment Summary</h3>

      <p>Items: {paymentSummary.totalItems}</p>
      <p>Total: {formateMoney(paymentSummary.totalCostCents)}</p>

      <button onClick={createOrder}>
        Place Order
      </button>
    </div>
  );
}
