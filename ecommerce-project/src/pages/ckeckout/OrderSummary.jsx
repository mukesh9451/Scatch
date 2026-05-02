import { CartItemDetails } from "./CartItemDetails";
import { DeliveryOptions } from "./DeliveryOptions";
import { DeliveryDate } from "./DeliveryDate";

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => (
          <div key={cartItem.productId} className="cart-item-container">

            <DeliveryDate
              cartItem={cartItem}
              deliveryOptions={deliveryOptions}
            />

            {/* 🔥 MAIN GRID */}
            <div className="cart-item-details-grid">

              {/* LEFT + CENTER */}
              <CartItemDetails
                cartItem={cartItem}
                loadCart={loadCart}
              />

              {/* RIGHT */}
              <DeliveryOptions
                cartItem={cartItem}
                deliveryOptions={deliveryOptions}
                loadCart={loadCart}
              />

            </div>

          </div>
        ))}
    </div>
  );
}
