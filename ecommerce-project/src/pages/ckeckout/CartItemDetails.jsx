import axios from "axios";
import { useState, useEffect } from "react";
import { formateMoney } from "../../utils/money";

const BASE_URL = "https://scatch-sd9g.onrender.com";

export function CartItemDetails({ cartItem, loadCart }) {

  const [product, setProduct] = useState(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  // ✅ FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/${cartItem.productId}`
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };

    fetchProduct();
  }, [cartItem.productId]);

  // 🟢 DELETE
  const deleteCartItem = async () => {
    await axios.delete(
      `${BASE_URL}/api/cart-items/${cartItem.productId}`,
      { withCredentials: true }
    );
    await loadCart();
  };

  // 🟢 UPDATE
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

  const updateQuantityInput = (e) => {
    setQuantity(e.target.value);
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === "Enter") updateQuantity();
    if (e.key === "Escape") {
      setQuantity(cartItem.quantity);
      setIsUpdatingQuantity(false);
    }
  };

  // ⏳ LOADING
  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <>
      <img
        className="product-image"
        src={`${BASE_URL}/${product.image}`}
        alt={product.name}
      />

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

          <span className="link-primary" onClick={updateQuantity}>
            Update
          </span>

          <span className="link-primary" onClick={deleteCartItem}>
            Delete
          </span>
        </div>

      </div>
    </>
  );
}
