import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

// 🔥 PRIVATE CACHE (NOT EXPORTED DIRECTLY)
let cachedUser = undefined;

// 🔥 SAFE SETTER (ONLY THIS IS EXPORTED)
export const setCachedUser = (value) => {
  cachedUser = value;
};

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(cachedUser);
  const [loading, setLoading] = useState(cachedUser === undefined);

  useEffect(() => {
    // already fetched → skip API
    if (cachedUser !== undefined) return;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();

        cachedUser = res.data;
        setUser(res.data);

      } catch {
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
