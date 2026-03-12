"use client";
import { confermaLogin } from "@/lib/login";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  // const [ConfirmLogin, setConfirmLogin] = useState("");
  const [ConfirmLogin, setConfirmLogin] = useState(async () => {
    return await confermaLogin();
  });
  const [password, setPassword] = useState("");
  //redirect("/home");
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-[#e5ddd5]">
        {/* Login Card */}
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600">ChatApp</h1>
            <p className="text-gray-500 text-sm mt-2">Accedi per continuare</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Password</label>
              <input
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type="password"
                placeholder="••••••••"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-green-500" />
                Ricordami
              </label>

              <button type="button" className="text-green-600 hover:underline">
                Password dimenticata?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="mt-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Accedi
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-gray-400 text-sm">oppure</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-600">
            Non hai un account?{" "}
            <button className="text-green-600 font-medium hover:underline">
              Registrati
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
