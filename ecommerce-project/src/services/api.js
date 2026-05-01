import axios from "axios";

const api = axios.create({
  baseURL: "https://scatch-sd9g.onrender.com/api",
  withCredentials: true
});

// PRODUCTS
export const getProducts = (search) =>
  api.get(search ? `/products?search=${search}` : "/products");

// AUTH
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const getCurrentUser = () =>
  api.get("/auth/profile");

export const logoutUser = () =>
  api.post("/auth/logout");

export default api;
