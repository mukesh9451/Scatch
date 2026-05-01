import dayjs from "dayjs";
import { formateMoney } from "../../utils/money";
export function OrderHeader({ order }) {
    return (
        <div className="order-header">
            <div className="order-header-left-section">
                <div className="order-date">
                    <div className="order-header-label">Order Placed:</div>
                    <div>{dayjs(order.orderTimeMs).format("dddd, D")}</div>
                </div>
                <div className="order-total">
                    <div className="order-header-label">Total:</div>
                    <div>{formateMoney(order.totalCostCents)}</div>
                </div>
            </div>

            <div className="order-header-right-section">
                <div className="order-header-label">Order ID:</div>
                <div>{order._id}</div>
            </div>
        </div>
    )
}