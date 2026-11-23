
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Dumbbell } from "lucide-react";
import { apiRequest } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("/api/auth/login", "POST", {
        email: formData.email,
        password: formData.password,
      });

      if (!response?.token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      localStorage.setItem("token", response.token);

      navigate("/", { replace: true });
    } catch (error) {
      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md bg-black border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-bold text-white">
              RepLog
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-neutral-400 text-sm mt-2 text-center">
            Sign in to continue your fitness journey
          </p>
        </div>

        {successMessage && (
          <p className="text-sm text-emerald-400 mb-4 text-center">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-semibold rounded-xl py-3 transition-colors cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-7">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-emerald-400 font-semibold hover:text-emerald-300"
          >
            Sign up
          </Link>
        </p>

      </section>
    </main>
  );
}
