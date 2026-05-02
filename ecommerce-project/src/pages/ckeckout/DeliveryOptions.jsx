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

        let priceString = "FREE - Shipping";
        if (option.priceCents > 0) {
          priceString = `${formateMoney(option.priceCents)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          await api.put(`/cart-items/${cartItem.productId}`, {
            deliveryOptionId: option._id
          });
          await loadCart();
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
                {dayjs(option.estimatedDeliveryTimeMs)
                  .format("dddd, MMMM, D")}
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
