import axios from "axios";

// ✅ use your deployed backend (NOT localhost)
const api = axios.create({
  baseURL: "https://scatch-sd9g.onrender.com/api",
  withCredentials: true
});

// Register
export const registerUser = (name, email, password, role) =>
  api.post("/auth/register", { name, email, password, role });

// Login
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// Get user
export const getCurrentUser = () =>
  api.get("/auth/profile");

// Logout
export const logoutUser = () =>
  api.post("/auth/logout");

// Get products
export const getProducts = (search) =>
  api.get(search ? `/products?search=${search}` : "/products");

export default api;
