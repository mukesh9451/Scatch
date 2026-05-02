import api from "../../services/api";
import { useEffect, useState } from "react";
import { formateMoney } from "../../utils/money";

export function CartItemDetails({ cartItem, loadCart }) {
  const [product, setProduct] = useState(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  useEffect(() => {
    api.get(`/products/${cartItem.productId}`)
      .then(res => setProduct(res.data))
      .catch(console.error);
  }, [cartItem.productId]);

  const deleteCartItem = async () => {
    await api.delete(`/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  const updateQuantity = async () => {
    if (isUpdatingQuantity) {
      await api.put(`/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity)
      });
      await loadCart();
      setIsUpdatingQuantity(false);
    } else {
      setIsUpdatingQuantity(true);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="cart-item-left">

      {/* IMAGE */}
      <img
        className="product-image"
        src={`https://scatch-sd9g.onrender.com/${product.image}`}
        alt={product.name}
      />

      {/* DETAILS */}
      <div className="cart-item-details">

        <div className="product-name">
          {product.name}
        </div>

        <div className="product-price">
          {formateMoney(product.priceCents)}
        </div>

        <div className="product-quantity">
          <span>
            Quantity:
            {isUpdatingQuantity ? (
              <input
                className="quantity-textbox"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
    </div>
  );
}
