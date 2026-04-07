"use client";

import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row min-h-[550px]">
        
        {/* Banner Section */}
        <div className={`flex w-full flex-col justify-center bg-[#1F6559] p-8 text-white transition-all duration-500 md:w-1/2 ${isLogin ? "md:order-1" : "md:order-2"}`}>
          <div className="mx-auto max-w-xs text-center">
            <h2 className="text-3xl font-bold">{isLogin ? "Welcome Back!" : "Hello, Friend!"}</h2>
            <p className="my-6 text-sm opacity-80">{isLogin ? "Stay connected with us by logging in." : "Start your journey with Pashuvaani today."}</p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="rounded-full border-2 border-white px-8 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:bg-white hover:text-[#1F6559] active:scale-95"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className={`flex w-full flex-col justify-center p-8 md:w-1/2 ${isLogin ? "md:order-2" : "md:order-1"}`}>
          <div className="mx-auto w-full max-w-sm">
            <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">{isLogin ? "Sign In" : "Create Account"}</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <input type="text" placeholder="Full Name" className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]" />
              )}
              <input type="email" placeholder="Email Address" className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]" />
              <input type="password" placeholder="Password" className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]" />
              
              <button className="mt-4 w-full rounded-xl bg-[#1F6559] py-4 font-bold text-white shadow-lg shadow-[#1F6559]/20 transition-all active:scale-[0.98]">
                {isLogin ? "SIGN IN" : "SIGN UP"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}