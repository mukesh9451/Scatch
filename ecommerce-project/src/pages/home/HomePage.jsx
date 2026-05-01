import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import "./HomePage.css";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const urlPath = search
          ? `/api/products?search=${search}`
          : "/api/products";

        const response = await axios.get(urlPath);

        console.log("API RESPONSE:", response.data);

        // ✅ SAFE DATA HANDLING (no crash)
        if (Array.isArray(response.data)) {
          // case: backend returns array directly
          setProducts(response.data);
        } else if (Array.isArray(response.data.products)) {
          // case: backend returns { products: [...] }
          setProducts(response.data.products);
        } else {
          // fallback
          setProducts([]);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
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
