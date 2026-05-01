// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://scatch-sd9g.onrender.com/api",
  withCredentials: true // 🔥 required for cookies
});

export const registerUser = async (name, email, password, role) => {
  return api.post("/register", {
    name,
    email,
    password,
    role // ✅ ADD THIS
  });
};

// Login
export const loginUser = async (email, password) => {
  return api.post("/login", { email, password });
};

// Get current user
export const getCurrentUser = async () => {
  return api.get("/profile");
};

// Logout
export const logoutUser = async () => {
  return api.post("/logout");
};

export default api;
