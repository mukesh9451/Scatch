import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser(); // ✅ clears the httpOnly cookie on the backend
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        navigate("/login", { replace: true }); // ✅ always redirect
      }
    };

    handleLogout();
  }, [navigate]);

  return null;
}