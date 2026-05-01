import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // ✅ NEW
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await registerUser(name, email, password, role); // ✅ pass role
      setMessage(res.data.message || "Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
    } finally {
      setIsLoading(false);
    }
  };

   console.log("FORM DATA:", {
    name,
    email,
    password,
    role
  });


  return (
    <div className="register-container">
      <h2>Create Account</h2>

      <form className="register-form" onSubmit={handleSubmit}>

        <input
          type="text"
          className="register-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />

        <input
          type="email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
        />

        <input
          type="password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 characters)"
          required
        />

        {/* ✅ ROLE SELECT */}
        <select
          className="register-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {message && <p className="register-error">{message}</p>}

      <p className="register-link">
        Already have an account?{" "}
        <Link to="/login">Sign in here</Link>
      </p>
    </div>
  );
}