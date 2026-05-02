import axios from "axios";
import { useState, useEffect } from "react";
import { formateMoney } from "../../utils/money";

const BASE_URL = "https://scatch-sd9g.onrender.com";

export function CartItemDetails({ cartItem, loadCart }) {

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  // 🔥 fetch product
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/${cartItem.productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [cartItem.productId]);

  // 🔥 delete
  const deleteCartItem = async () => {
    await axios.delete(
      `${BASE_URL}/api/cart-items/${cartItem.productId}`,
      { withCredentials: true }
    );
    await loadCart();
  };

  // 🔥 update
  const updateQuantity = async () => {
    if (isUpdatingQuantity) {
      await axios.put(
        `${BASE_URL}/api/cart-items/${cartItem.productId}`,
        { quantity: Number(quantity) },
        { withCredentials: true }
      );
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
        src={`${BASE_URL}/${product.image}`}
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
