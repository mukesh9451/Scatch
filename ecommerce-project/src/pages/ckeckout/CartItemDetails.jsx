import { useState, useEffect } from "react";
import api from "../../services/api";
import { formateMoney } from "../../utils/money";

export function CartItemDetails({ cartItem, loadCart }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

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
    <>
      <img
        className="product-image"
        src={`https://scatch-sd9g.onrender.com/${product.image}`}
        alt={product.name}
      />

      <div className="cart-item-details">
        <div className="product-name">{product.name}</div>
        <div className="product-price">
          {formateMoney(product.priceCents)}
        </div>

        <div className="product-quantity">
          Quantity:
          {isUpdatingQuantity ? (
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          ) : (
            <span>{cartItem.quantity}</span>
          )}

          <span onClick={updateQuantity}>Update</span>
          <span onClick={deleteCartItem}>Delete</span>
        </div>
      </div>
    </>
  );
}
