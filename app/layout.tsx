'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export function Header() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
  const checkAuth = () => {
    setRole(localStorage.getItem("role"));
  };

  checkAuth(); // Check on mount

  // Listen for the manual event we'll trigger
  window.addEventListener("auth-change", checkAuth);
  return () => window.removeEventListener("auth-change", checkAuth);
}, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    router.push('/')
    window.location.reload();
  };
  return (
  <header className="flex items-center p-10 bg-slate-500">
    <h1 className="text-3xl font-bold text-white">Course Management System</h1>
      <div className='mx-auto'>
      <Link 
      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      href="/">
        Home
        </Link>
    </div>
    
    <div className ='mx-auto'>
     
        {role === 'teacher' && 
        <Link
         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-blue-700 transition-colors"
         href="/classadd">
          Create Course</Link>}
    </div>

    <div className='mx-auto'>
      {role === 'student' && 
      <Link 
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        href="/studentcourse">
        Your Courses
      </Link>}
    </div>

    <div className='mx-auto'>
      {role === 'student' && 
      <Link 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        href="/classcart">
        Your Cart
      </Link>}
    </div>

     <div className="ml-auto">
        {/* Toggle Login and Logout buttons */}
        {role ? (
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <Link 
            href="/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>

  </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />{children}</body>
    </html>
  );
}
