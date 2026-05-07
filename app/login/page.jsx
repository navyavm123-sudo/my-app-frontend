"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);

        router.push("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully!");

        setIsLogin(true);

        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            {isLogin
              ? "Login to continue shopping"
              : "Register to get started"}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-4"
        >

          {/* NAME */}
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-600">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* LOGIN / REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>

          {/* CONTINUE AS GUEST */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Continue as Guest
          </button>
        </form>

        {/* TOGGLE LOGIN/REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}

          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}