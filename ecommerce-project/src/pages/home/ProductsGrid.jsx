import { Product } from "./Product";

export function ProductsGrid({ products, loadCart }) {

  // 🛡️ Safety check
  if (!Array.isArray(products)) {
    return <p>Loading products...</p>;
  }

  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <Product
          key={product._id}
          product={product}
          loadCart={loadCart}
        />
      ))}
    </div>
  );
}
