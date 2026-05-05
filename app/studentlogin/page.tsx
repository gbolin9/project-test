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
        // Save the token for the x-auth header and the role for UI logic
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "student"); 
        if (data.userID) localStorage.setItem('studentID', data.userID.toString());
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <main className="p-8">
      <h1>Student Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="loginName">User Name: </label>
          <input 
            id="loginName" 
            type="text" 
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="border p-1"
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
            className="border p-1"
            required 
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>
      
      <p className="mt-4">
        If you are not registered click <Link href="/studentregistration">Here</Link>
      </p>
    </main>
  );
}