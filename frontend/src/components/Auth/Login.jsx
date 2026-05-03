import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/api";
import { setCachedUser } from "./ProtectedRoute"; // ✅ use setter
import "./Login.css";

export default function Login({ loadCart }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await loginUser(email, password);

      // 🔥 RESET CACHE PROPERLY
      setCachedUser(undefined);

      // small delay (helps cookie sync)
      await new Promise((res) => setTimeout(res, 50));

      await loadCart();

      navigate("/home", { replace: true });

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
        />

        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button
          type="submit"
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {message && <p className="login-error">{message}</p>}

      <p className="login-link">
        Don't have an account?{" "}
        <Link to="/register">Create one here</Link>
      </p>
    </div>
  );
}
