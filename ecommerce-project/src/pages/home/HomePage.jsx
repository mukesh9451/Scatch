import axios from "axios";
import { useState } from "react";
import CheckmarkIcon from "../../assets/images/icons/checkmark.png";
import { formateMoney } from "../../utils/money";

// 🔥 your backend URL
const BASE_URL = "https://scatch-sd9g.onrender.com";

export function Product({ product, loadCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const addToCart = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/cart-items`,
        {
          productId: product._id,
          quantity
        },
        {
          withCredentials: true
        }
      );

      await loadCart();

      setShowAddedMessage(true);
      setTimeout(() => {
        setShowAddedMessage(false);
      }, 1000);

    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const selectQuantity = (e) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <div className="product-container" data-testid="product-container">

      {/* ✅ PRODUCT IMAGE */}
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={`${BASE_URL}/${product.image}`}   // 🔥 FIXED
          alt={product.name}
        />
      </div>

      {/* ✅ NAME */}
      <div className="product-name limit-text-to-2-lines">
        {product.name}
      </div>

      {/* ✅ RATING */}
      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`${BASE_URL}/images/ratings/rating-${product.rating.stars * 10}.png`} // 🔥 FIXED
          alt="rating"
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      {/* ✅ PRICE */}
      <div className="product-price">
        {formateMoney(product.priceCents)}
      </div>

      {/* ✅ QUANTITY */}
      <div className="product-quantity-container">
        <select value={quantity} onChange={selectQuantity}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="product-spacer"></div>

      {/* ✅ ADDED MESSAGE */}
      <div
        className="added-to-cart"
        style={{ opacity: showAddedMessage ? 1 : 0 }}
      >
        <img src={CheckmarkIcon} alt="check" />
        Added
      </div>

      {/* ✅ BUTTON */}
      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
