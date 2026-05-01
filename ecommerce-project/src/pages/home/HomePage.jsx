import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import { getProducts } from "../../services/api"; // ✅ use API service
import "./HomePage.css";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await getProducts(search);

        console.log("API RESPONSE:", response.data);

        // ✅ FIX: ensure array
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error:", err);
        setProducts([]);
      }
    };

    getHomeData();
  }, [search]);

  return (
    <>
      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}
