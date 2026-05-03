import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(undefined); // 🔥 IMPORTANT
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();

        console.log("USER:", res.data); // debug

        setUser(res.data); // backend returns user directly
      } catch (err) {
        console.log("AUTH ERROR:", err.response?.status);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔥 WAIT until user is fetched
  if (loading) {
    return <div style={{ padding: "20px" }}>Checking auth...</div>;
  }

  // 🔥 NOT LOGGED IN
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 ROLE CHECK
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ ALLOWED
  return children;
};

export default ProtectedRoute;
