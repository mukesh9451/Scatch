import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";
import { cachedUser } from "./ProtectedRoute"; // 🔥 IMPORT

export default function Logout({ setCart }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // 🔥 RESET CACHE
        cachedUser = null;

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
