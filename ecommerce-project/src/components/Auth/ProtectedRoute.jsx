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
          setUser(res.data.user);
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
      isMounted = false; // prevent memory leak
    };
  }, []);

  // ⏳ still checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ role mismatch (e.g., admin route)
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ authorized
  return children;
};

export default ProtectedRoute;
