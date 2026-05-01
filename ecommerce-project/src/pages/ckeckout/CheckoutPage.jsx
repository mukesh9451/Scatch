import axios from "axios"
import { Header } from "../../components/Header"
import "./CheckoutPage.css"
import { useEffect, useState } from "react"
import { OrderSummary } from "./OrderSummary"
import { PaymentSummary } from "./PaymentSummary"



export function CheckoutPage({cart,loadCart}) {

const[deliveryOptions,setDeliveryOptions]=useState([])
const[paymentSummary,setPaymentSummary]=useState(null);

useEffect(()=>{
    const fetchCheckoutData=async()=>{
      let response=await axios.get("/api/delivery-options?expand=estimatedDeliveryTime");
        setDeliveryOptions(response.data);
        console.log(response.data);
    }
    fetchCheckoutData();

},[cart])

useEffect(() => {
  const fetchPaymentSummaryData = async () => {
    try {
      const response = await axios.get("/api/payment-summary", {
        withCredentials: true   // ✅ VERY IMPORTANT
      });

      setPaymentSummary(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("SERVER ERROR:", err.response?.data);
    }
  };

  fetchPaymentSummaryData();
}, [cart]);
    return (
        <>
        <title>Checkout</title>
        <link rel="icon" type="image/svg+xml" href="cart-favicon.png" />
            <Header cart={cart} />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart
                    ={loadCart} />

                    <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
                    
                </div>
            </div>
        </>
    )
}