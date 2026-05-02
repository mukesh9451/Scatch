import { CartItemDetails } from "./CartItemDetails";
import { DeliveryOptions } from "./DeliveryOptions";
import { DeliveryDate } from "./DeliveryDate";

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  return (
    <div>
      {deliveryOptions.length > 0 &&
        cart.map(item => (
          <div key={item.productId}>
            <DeliveryDate cartItem={item} deliveryOptions={deliveryOptions} />
            <CartItemDetails cartItem={item} loadCart={loadCart} />
            <DeliveryOptions
              cartItem={item}
              deliveryOptions={deliveryOptions}
              loadCart={loadCart}
            />
          </div>
        ))}
    </div>
  );
}
