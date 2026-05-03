import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data); // backend returns user directly
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  console.log("USER:", user);
  // ⏳ Wait until auth is checked
  if (user === undefined) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
