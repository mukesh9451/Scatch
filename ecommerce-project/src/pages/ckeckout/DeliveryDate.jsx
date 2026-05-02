import dayjs from "dayjs";

export function DeliveryDate({ cartItem, deliveryOptions }) {
  const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
    return deliveryOption._id === cartItem.deliveryOptionId;
  });

  // Removed loadCart() completely - this was causing the loop

  if (!selectedDeliveryOption) {
    return <div className="delivery-date">Loading delivery date...</div>;
  }

  return (
    <div className="delivery-date">
      Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format("dddd, MMMM, D")}
    </div>
  );
}
