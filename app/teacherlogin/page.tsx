"use client"; // Required for useState and useRouter

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://backend-sdev-255-project.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token and the role returned from your API
        localStorage.setItem("token", data.token);
        localStorage.setItem("role","teacher"); 
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teacher Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-xs">
        <div>
          <label htmlFor="loginName">User Name: </label>
          <input
            id="loginName"
            type="text"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="border p-1 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Enter Password: </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-1 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      
      <div className="mt-4">
        <p>
          If you are not registered click{" "}
          <Link href="/teacherregistration" className="text-blue-500 underline">
            Here
          </Link>
        </p>
      </div>
    </main>
  );
}