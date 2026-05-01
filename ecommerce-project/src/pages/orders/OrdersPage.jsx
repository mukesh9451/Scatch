import axios from "axios"
import { useState,useEffect} from "react"
import { Header } from "../../components/Header"
import "./OrdersPage.css"
import { OrderGrid } from "./OrderGrid"
export function OrdersPage({cart,loadCart}) {
    const[orders,setOrders]=useState([])

    useEffect(() => {
  const fetchOrdersData = async () => {
    try {
      let response = await axios.get("/api/orders?expand=products");
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setOrders([]); // fallback
    }
  };

  fetchOrdersData();
}, []);

    return (
        <>
            <title>Orders</title>
            <link rel="icon" type="image/svg+xml" href="orders-favicon.png" />
            <Header cart={cart} />

            <div className="orders-page">
                <div className="page-title">Your Orders</div>
            
                <OrderGrid orders={orders} loadCart={loadCart} />
            </div>
        </>
    )
}