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
    const fetchData = async () => {
      try {
        const res = await getProducts(search);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchData();
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
