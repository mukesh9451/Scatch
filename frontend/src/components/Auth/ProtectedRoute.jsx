import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

let cachedUser = undefined; // 🔥 global cache

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(cachedUser);
  const [loading, setLoading] = useState(cachedUser === undefined);

  useEffect(() => {
    // 🔥 already fetched → don't call again
    if (cachedUser !== undefined) return;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();

        cachedUser = res.data; // 🔥 store globally
        setUser(res.data);

      } catch (err) {
        cachedUser = null;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ⏳ loading only first time
  if (loading) {
    return <div style={{ padding: "20px" }}>Checking auth...</div>;
  }

  // ❌ not logged in
  if (user === null) {
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
