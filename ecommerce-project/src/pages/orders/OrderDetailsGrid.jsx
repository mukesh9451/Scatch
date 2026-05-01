import { Link } from "react-router-dom";
import axios from "axios";
import BuyAgainIcon from "../../assets/images/icons/buy-again.png";
import dayjs from "dayjs";
import { Fragment } from "react";

export function OrderDetailsGrid({ order, loadCart }) {
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        
        // 🔥 SAFETY: skip if product missing
        if (!orderProduct.product) return null;

        const addToCart = async () => {
          try {
            await axios.post("/api/cart-items", {
              productId: orderProduct.productId, // ✅ FIXED
              quantity: 1
            });

            await loadCart();
          } catch (err) {
            console.error(err);
          }
        };

        return (
          <Fragment key={orderProduct.productId}>
            
            <div className="product-image-container">
              <img src={orderProduct.product?.image} />
            </div>

            <div className="product-details">
              <div className="product-name">
                {orderProduct.product?.name}
              </div>

              <div className="product-delivery-date">
                Arriving on:{" "}
                {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>

              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>

              <button
                className="buy-again-button button-primary"
                onClick={addToCart}
              >
                <img className="buy-again-icon" src={BuyAgainIcon} />
                <span className="buy-again-message">Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
              
              {/* 🔥 MAIN FIX HERE */}
              <Link to={`/tracking/${order._id}/${orderProduct.productId || orderProduct.product?._id}`}>
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>

            </div>

          </Fragment>
        );
      })}
    </div>
  );
}