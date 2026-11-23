
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Dumbbell } from "lucide-react";

import { apiRequest } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      const response = await apiRequest("/api/auth/signup", "POST", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup successful:", response);
      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      });

      // Navigate to login after successful signup
      // Example: navigate("/login");
    } catch (error) {
      setError(error.message || "Unable to create account.");
    }
  }

  return (
    <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center px-4 py-8">

      <section className="w-full max-w-md bg-[#18181d] border border-white/10 rounded-2xl p-6 sm:p-8">

        {/* Brand and Heading */}
        <div className="flex flex-col items-center mb-7">

          <div className="flex items-center gap-2 mb-5">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-bold text-white">
              RepLog
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white text-center">
            Create your account
          </h1>

          <p className="text-sm text-neutral-400 mt-2 text-center">
            Start tracking your fitness journey today.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Email Address
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-xl py-3 transition-colors cursor-pointer"
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <div className="border-t border-neutral-800 mt-6 pt-5 text-center">
          <p className="text-sm text-neutral-400">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="block w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-xl py-3 transition-colors"
          >
            Sign in instead
          </Link>
        </div>

      </section>
    </main>
  );
}
