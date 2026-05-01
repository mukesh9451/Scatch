import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import { getProducts } from "../../services/api";
import "./HomePage.css";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(search);

        console.log("API RESPONSE:", response.data);

        // ✅ Correct data handling
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
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
