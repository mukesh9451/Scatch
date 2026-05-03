import api from "../../services/api";
import { useEffect, useState } from "react";
import { formateMoney } from "../../utils/money";

export function CartItemDetails({ cartItem, loadCart }) {
  const [product, setProduct] = useState(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${cartItem.productId}`);

        if (!ignore) {
          setProduct(res.data);
        }
      } catch (err) {
        console.error("Product load error:", err);
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [cartItem.productId]);

  /* ================= DELETE ================= */
  const deleteCartItem = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await api.delete(`/cart-items/${cartItem.productId}`);

      await loadCart(); // refresh cart

    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async () => {
    if (loading) return;

    try {
      if (isUpdatingQuantity) {
        setLoading(true);

        await api.put(`/cart-items/${cartItem.productId}`, {
          quantity: Number(quantity)
        });

        await loadCart();
        setIsUpdatingQuantity(false);

      } else {
        setIsUpdatingQuantity(true);
      }

    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
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

          <span>Quantity:</span>

          {isUpdatingQuantity ? (
            <input
              type="number"
              className="quantity-textbox"
              value={quantity}
              min="1"
              max="10"
              onChange={(e) => setQuantity(e.target.value)}
            />
          ) : (
            <span>{cartItem.quantity}</span>
          )}

          <span
            className="update-quantity-link"
            onClick={updateQuantity}
          >
            {isUpdatingQuantity ? "Save" : "Update"}
          </span>

          <span
            className="delete-quantity-link"
            onClick={deleteCartItem}
          >
            Delete
          </span>

        </div>

      </div>
    </div>
  );
}
