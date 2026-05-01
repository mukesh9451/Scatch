import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (retry = false) => {
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
      setLoading(false);
    } catch (err) {
      // 🔁 retry once (handles cookie delay)
      if (!retry) {
        setTimeout(() => fetchUser(true), 300);
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  // ❌ not logged in
  if (!user) return <Navigate to="/login" />;

  // ❌ role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
