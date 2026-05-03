import api from "../../services/api";
import { formateMoney } from "../../utils/money";
import dayjs from "dayjs";
import { useState } from "react";

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart }) {

  const [loading, setLoading] = useState(false);

  const updateDeliveryOption = async (optionId) => {
    if (loading) return;

    try {
      setLoading(true);

      // ✅ CORRECT ROUTE
      await api.put(`/cart-items/${cartItem.productId}`, {
        deliveryOptionId: optionId
      });

      await loadCart(); // refresh cart

    } catch (err) {
      console.error("Delivery update failed:", err);
    } finally {
      setLoading(false);
    }
  };

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

        return (
          <div
            key={option._id}
            className="delivery-option"
            onClick={() => updateDeliveryOption(option._id)}
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
                  .format("dddd, MMMM D")}
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
