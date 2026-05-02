import api from "../../services/api";
import { formateMoney } from "../../utils/money";
import dayjs from "dayjs";

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart }) {
  return (
    <div className="delivery-options">
      {deliveryOptions.map(option => {

        const updateDeliveryOption = async () => {
          await api.put(`/cart-items/${cartItem.productId}`, {
            deliveryOptionId: option._id
          });
          await loadCart();
        };

        return (
          <div key={option._id} onClick={updateDeliveryOption}>
            <input
              type="radio"
              checked={option._id === cartItem.deliveryOptionId}
              readOnly
            />

            <div>
              {dayjs(option.estimatedDeliveryTimeMs).format("dddd, MMMM, D")}
              <br />
              {option.priceCents === 0
                ? "FREE"
                : formateMoney(option.priceCents)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
