import axios from "axios";
import { formateMoney } from "../../utils/money";
import dayjs from "dayjs";

const BASE_URL = "https://scatch-sd9g.onrender.com";

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart }) {

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">
        Choose a delivery option:
      </div>

      {deliveryOptions.map((deliveryOption) => {

        let priceString = "FREE - Shipping";
        if (deliveryOption.priceCents > 0) {
          priceString = `${formateMoney(deliveryOption.priceCents)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          await axios.put(
            `${BASE_URL}/api/cart-items/${cartItem.productId}`,
            { deliveryOptionId: deliveryOption._id },
            { withCredentials: true }
          );
          await loadCart();
        };

        return (
          <div
            key={deliveryOption._id}
            className="delivery-option"
            onClick={updateDeliveryOption}
          >
            <input
              type="radio"
              checked={deliveryOption._id === cartItem.deliveryOptionId}
              readOnly
            />

            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format("dddd, MMMM, D")}
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
