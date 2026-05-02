export function OrderGrid({ orders, loadCart }) {
  return (
    <div className="orders-grid">

      {Array.isArray(orders) && orders.map((order) => (
        <div key={order._id} className="order-container">

          <OrderHeader order={order} />

          <OrderDetailsGrid
            order={order}
            loadCart={loadCart}
          />

        </div>
      ))}

    </div>
  );
}
