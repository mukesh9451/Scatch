import { Link } from "react-router-dom";
import api from "../../services/api"; // ✅ FIX
import BuyAgainIcon from "../../assets/images/icons/buy-again.png";
import dayjs from "dayjs";
import { Fragment } from "react";

export function OrderDetailsGrid({ order, loadCart }) {

  return (
    <div className="order-details-grid">

      {Array.isArray(order.products) && order.products.map((orderProduct) => {

        if (!orderProduct.product) return null;

        const addToCart = async () => {
          try {
            await api.post("/cart-items", {   // ✅ FIX
              productId: orderProduct.productId,
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
              <img
                src={`https://scatch-sd9g.onrender.com/${orderProduct.product.image}`} // ✅ FIX
                alt=""
              />
            </div>

            <div className="product-details">
              <div className="product-name">
                {orderProduct.product.name}
              </div>

              <div className="product-delivery-date">
                Arriving on{" "}
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
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
  <Link
  to={`/tracking/${order._id}/${
    orderProduct._doc?.productId ||
    orderProduct.productId ||
    orderProduct.product?._id
  }`}
>
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
