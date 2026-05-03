import axios from "axios";

const api = axios.create({
  baseURL: "https://scatch-sd9g.onrender.com/api",
  withCredentials: true // 🔥 REQUIRED for cookies
});

/* ================= AUTH ================= */

// ✅ REGISTER (NO ROLE)
export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

// LOGIN
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// CURRENT USER
export const getCurrentUser = () =>
  api.get("/auth/profile");

// LOGOUT
export const logoutUser = () =>
  api.post("/auth/logout");


/* ================= PRODUCTS ================= */

export const getProducts = (search) =>
  api.get(search ? `/products?search=${search}` : "/products");


/* ================= CART ================= */

export const getCart = () =>
  api.get("/cart");

export const addToCart = (productId, quantity) =>
  api.post("/cart", { productId, quantity });

export const updateCartItem = (productId, data) =>
  api.put(`/cart/${productId}`, data);

export const deleteCartItem = (productId) =>
  api.delete(`/cart/${productId}`);


/* ================= ORDERS ================= */

export const createOrder = () =>
  api.post("/orders");

export const getOrders = () =>
  api.get("/orders");

export const getOrderById = (orderId) =>
  api.get(`/orders/${orderId}`);


/* ================= OPTIONAL (AUTO LOGOUT) ================= */

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 🔥 token expired / not logged in
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
