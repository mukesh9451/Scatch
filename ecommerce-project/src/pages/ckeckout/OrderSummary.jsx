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

            <div className="cart-item-details-grid">

              {/* LEFT */}
              <div>
                <CartItemDetails
                  cartItem={cartItem}
                  loadCart={loadCart}
                />
              </div>

              {/* RIGHT */}
              <div>
                <DeliveryOptions
                  cartItem={cartItem}
                  deliveryOptions={deliveryOptions}
                  loadCart={loadCart}
                />
              </div>

            </div>
          </div>
        ))}
    </div>
  );
}
