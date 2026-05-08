"use client";

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
        

        // Log to check values in the browser console
        if (data.firstName) localStorage.setItem('firstName', data.firstName);
        if (data.userID) localStorage.setItem('teacherID', data.userID.toString());
    
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
    <main className= "min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className="text-3xl py-2">Teacher Login</h1>
      <form onSubmit={handleLogin}
            className= "max-w-md mx-auto p-6 bg-gray-500 shadow-md py-4"
            >
        <div  className="flex flex-col space-y-2">
          <label htmlFor="loginName">User Name: </label>
          <input
          className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500"
            id="loginName"
            type="text"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password">Enter Password: </label>
          <input
          className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center py-4">
        <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition-colors"
        type="submit">
          Login
        </button>
        </div>
      </form>
      
      <div className="mt-4">
        <p className="py-4">If you are not registered click {""}
                    <Link 
                    className="mx-auto px-2 py-2 bg-yellow-600 text-white rounded-md hover:bg-blue-700 transition-colors italic" 
                    href="/teacherregistration"> Here</Link>
                    </p>
      </div>
    </main>
  );
}