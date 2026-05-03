import { useState } from "react";
import axios from "axios";
import { Header } from "../../components/Header";
import "./AddProductPage.css";

export function AddProductPage({ cart }) {
  const [form, setForm] = useState({
    name: "",
    image: "",
    priceCents: "",
    stars: "",
    count: "",
    keywords: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!form.name || !form.image || !form.priceCents) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    // ✅ convert keywords to array
    const keywordsArray = form.keywords
      ? form.keywords
          .split(",")
          .map(k => k.trim())
          .filter(k => k.length > 0)
      : [];

    try {
      await axios.post("/api/products", {
        name: form.name,
        image: form.image,
        priceCents: Number(form.priceCents),

        rating: {
          stars: Number(form.stars) || 0,
          count: Number(form.count) || 0
        },

        keywords: keywordsArray
      });

      setMessage("✅ Product added successfully");

      // 🔄 reset form
      setForm({
        name: "",
        image: "",
        priceCents: "",
        stars: "",
        count: "",
        keywords: ""
      });

    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      setMessage("❌ Failed to add product");
    }
  };

  return (
    <>
      <Header cart={cart} />

      <div className="add-product-page">
        <h2 className="h1">Add New Product</h2>

        <form className="product-form" onSubmit={handleSubmit}>

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* IMAGE */}
          <input
            type="text"
            name="image"
            placeholder="Image path (images/products/abc.jpg)"
            value={form.image}
            onChange={handleChange}
            required
          />

          {/* PREVIEW */}
          {form.image && (
            <div className="image-preview">
              <img src={form.image} alt="preview" />
            </div>
          )}

          {/* PRICE */}
          <input
            type="number"
            name="priceCents"
            placeholder="Price (in cents)"
            value={form.priceCents}
            onChange={handleChange}
            required
          />

          {/* RATING */}
          <div className="rating-row">
            <input
              type="number"
              step="0.1"
              name="stars"
              placeholder="Stars (0–5)"
              value={form.stars}
              onChange={handleChange}
            />

            <input
              type="number"
              name="count"
              placeholder="Review Count"
              value={form.count}
              onChange={handleChange}
            />
          </div>

          {/* KEYWORDS */}
          <input
            type="text"
            name="keywords"
            placeholder="Keywords (comma separated)"
            value={form.keywords}
            onChange={handleChange}
          />

          <button type="submit">Add Product</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
}