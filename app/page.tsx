"use client";
import { authAPI } from "@/lib/api";
import { auth } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login: updateAuthContext } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authAPI.login(email, password);
      if (result.success) {
        auth.setToken(result.token);
        auth.setUser(result.user);
        await updateAuthContext(email, result.user.username);
        router.push("/home");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await authAPI.register(email, username, password);
      console.log("Registration response:", result);

      if (result.success) {
        setSuccess(
          "Registrazione completata! Accedi ora con le tue credenziali.",
        );
        setEmail("");
        setPassword("");
        setUsername("");
        setTimeout(() => {
          setIsRegister(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e5ddd5]">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Messaggero</h1>
          <p className="text-gray-500 text-sm mt-2">
            {isRegister ? "Crea un nuovo account" : "Accedi per continuare"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="flex flex-col gap-4"
        >
          {isRegister && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50"
          >
            {isLoading
              ? "Caricamento..."
              : isRegister
                ? "Registrati"
                : "Accedi"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">oppure</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-center text-sm text-gray-600">
          {isRegister ? "Hai già un account? " : "Non hai un account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-green-600 font-medium hover:underline"
          >
            {isRegister ? "Accedi" : "Registrati"}
          </button>
        </p>
      </div>
    </div>
  );
}
