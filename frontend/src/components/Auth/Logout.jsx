import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";
import { setCachedUser } from "./ProtectedRoute"; // ✅ use setter

export default function Logout({ setCart }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // 🔥 CLEAR AUTH CACHE
        setCachedUser(null);

        // 🔥 CLEAR CART
        if (setCart) {
          setCart([]);
        }

        navigate("/login", { replace: true });
      }
    };

    handleLogout();
  }, [navigate, setCart]);

  return null;
}
