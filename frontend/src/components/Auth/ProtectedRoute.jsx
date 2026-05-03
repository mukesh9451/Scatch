import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

// 🔥 GLOBAL CACHE
export let cachedUser = undefined;

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

  if (loading) {
    return <div style={{ padding: "20px" }}>Checking auth...</div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
