import axios from "axios";
import { useState } from "react";
import { formateMoney } from "../../utils/money";

export function CartItemDetails({ cartItem, loadCart }) {

  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  // 🟢 DELETE ITEM
  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  // 🟢 UPDATE QUANTITY
  const updateQuantity = async () => {
    if (isUpdatingQuantity) {
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity),
      });
      await loadCart();
      setIsUpdatingQuantity(false);
    } else {
      setIsUpdatingQuantity(true);
    }
  };

  // 🟢 INPUT CHANGE
  const updateQuantityInput = (event) => {
    setQuantity(event.target.value);
  };

  // 🟢 KEY HANDLER
  const handleQuantityKeyDown = (event) => {
    const keyPressed = event.key;

    if (keyPressed === "Enter") {
      updateQuantity();
    } else if (keyPressed === "Escape") {
      setQuantity(cartItem.quantity);
      setIsUpdatingQuantity(false);
    }
  };

  // 🔴 SAFETY CHECK (MOST IMPORTANT FIX)
  if (!cartItem.product) {
    return (
      <div className="cart-item-details">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <>
      <img
        className="product-image"
        src={cartItem.product.image || "/placeholder.png"}
        alt={cartItem.product.name}
      />

      <div className="cart-item-details">

        <div className="product-name">
          {cartItem.product.name}
        </div>

        <div className="product-price">
          {formateMoney(cartItem.product.priceCents)}
        </div>

        <div className="product-quantity">
          <span>
            Quantity:
            {isUpdatingQuantity ? (
              <input
                type="text"
                className="quantity-textbox"
                value={quantity}
                onChange={updateQuantityInput}
                onKeyDown={handleQuantityKeyDown}
              />
            ) : (
              <span className="quantity-label">
                {cartItem.quantity}
              </span>
            )}
          </span>

          <span
            className="update-quantity-link link-primary"
            onClick={updateQuantity}
          >
            Update
          </span>

          <span
            className="delete-quantity-link link-primary"
            onClick={deleteCartItem}
          >
            Delete
          </span>
        </div>

      </div>
    </>
  );
}