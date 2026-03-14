import { useState } from "react";
import api from "../api.js";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("users/login/", {
        username,
        password,
      });

      const { access, refresh, role } = res.data;

      // Store tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (role === "candidate") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail || 
        "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout variant="auth">
      <div className="flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}