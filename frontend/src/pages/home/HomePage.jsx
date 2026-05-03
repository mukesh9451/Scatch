import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import { getProducts } from "../../services/api"; // ✅ use API file
import "./HomePage.css";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await getProducts(search);

        console.log("API DATA:", response.data);

        // ✅ IMPORTANT FIX
        setProducts(response.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
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
