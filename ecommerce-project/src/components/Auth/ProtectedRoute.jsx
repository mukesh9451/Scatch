import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();

        if (isMounted) {
          // ✅ FIX: backend returns user directly
          setUser(res.data);
        }

      } catch (err) {
        if (isMounted) {
          setUser(null);
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // ⏳ loading state
  if (loading) {
    return <div style={{ padding: "20px" }}>Checking authentication...</div>;
  }

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ authorized
  return children;
};

export default ProtectedRoute;
