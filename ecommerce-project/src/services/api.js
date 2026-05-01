import axios from "axios";

const api = axios.create({
  baseURL: "https://scatch-sd9g.onrender.com/api",
  withCredentials: true
});

// ================= AUTH =================

// Register
export const registerUser = (name, email, password, role) =>
  api.post("/auth/register", { name, email, password, role });

// Login
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// Get current user
export const getCurrentUser = () =>
  api.get("/auth/profile");

// Logout
export const logoutUser = () =>
  api.post("/auth/logout");

export default api;
