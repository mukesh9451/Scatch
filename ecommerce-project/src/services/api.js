import axios from "axios";

const api = axios.create({
  baseURL: "https://scatch-sd9g.onrender.com/api",
  withCredentials: true
});

// ✅ LOGIN
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// ✅ GET CURRENT USER
export const getCurrentUser = () =>
  api.get("/auth/profile");

export default api;
