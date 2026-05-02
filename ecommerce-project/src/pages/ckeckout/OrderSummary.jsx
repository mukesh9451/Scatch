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

            {/* ✅ 2 COLUMN GRID */}
            <div className="cart-item-details-grid">

              {/* LEFT SIDE */}
              <CartItemDetails
                cartItem={cartItem}
                loadCart={loadCart}
              />

              {/* RIGHT SIDE */}
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
