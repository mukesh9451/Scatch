import api from "../../services/api";
import { formateMoney } from "../../utils/money";
import dayjs from "dayjs";

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart }) {

  return (
    <div className="delivery-options">

      <div className="delivery-options-title">
        Choose a delivery option:
      </div>

      {deliveryOptions.map((option) => {

        // 🔥 price text
        let priceString = "FREE - Shipping";
        if (option.priceCents > 0) {
          priceString = `${formateMoney(option.priceCents)} - Shipping`;
        }

        // 🔥 FIX: calculate delivery date using deliveryDays
        const deliveryDate = dayjs(
          Date.now() + option.deliveryDays * 86400000
        ).format("dddd, MMMM D");

        const updateDeliveryOption = async () => {
          try {
            await api.put(`/cart-items/${cartItem.productId}`, {
              deliveryOptionId: option._id
            });

            await loadCart();

          } catch (err) {
            console.error("Delivery update error:", err);
          }
        };

        return (
          <div
            key={option._id}
            className="delivery-option"
            onClick={updateDeliveryOption}
          >

            <input
              type="radio"
              className="delivery-option-input"
              checked={option._id === cartItem.deliveryOptionId}
              readOnly
            />

            <div>
              <div className="delivery-option-date">
                {deliveryDate}
              </div>

              <div className="delivery-option-price">
                {priceString}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
