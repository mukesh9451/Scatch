import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        setUser(res.data.user);   // ✅ store user
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  // ❌ not logged in
  if (!user) return <Navigate to="/login" />;

  // ❌ role mismatch (admin check)
  if (role && user.role !== role) {
    return <Navigate to="/home" />;
  }

  // ✅ allowed
  return children;
};

export default ProtectedRoute;