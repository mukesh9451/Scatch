import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";

export default function Logout({ setCart }) { // 🔥 ADD PROP
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser(); // clear cookie
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // 🔥 CLEAR CART STATE
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
