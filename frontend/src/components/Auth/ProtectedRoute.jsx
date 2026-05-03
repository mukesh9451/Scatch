import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(undefined); // undefined = loading
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();

        if (mounted) {
          setUser(res.data); // backend returns user directly
        }

      } catch (err) {
        if (mounted) {
          setUser(null);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  // ⏳ wait until auth check finishes
  if (user === undefined) {
    return <div style={{ padding: "20px" }}>Checking authentication...</div>;
  }

  // ❌ not logged in
  if (!user) {
    // 🔥 IMPORTANT: avoid redirect loop
    if (location.pathname === "/login") {
      return children;
    }
    return <Navigate to="/login" replace />;
  }

  // ❌ role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ allowed
  return children;
};

export default ProtectedRoute;
