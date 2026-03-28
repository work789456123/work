import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/utils/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const response = await api.post("/admin/login", { email, password });
      localStorage.setItem('admin_token', response.data.access_token);
      toast.success("Admin login successful");
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    }
  }

  return (

    <div className="flex min-h-screen w-full bg-background-light">

      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center bg-primary/10 p-12">

        <div className="max-w-lg text-center">

          <div className="flex items-center justify-center gap-3 mb-12">

            <div className="size-12 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">pets</span>
            </div>

            <h1 className="text-3xl font-black text-primary">
              PashuVaani
            </h1>

          </div>

          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1BT_oEVLPRqGTKA9ET3NlarRlE8-Ujg28eRzPW4BWWVFXxT7D0abXbudrYqQ9c6Uemuu4seoa27hp-yFTkVsUFb5Szt0LyFujQoyMkSBVLwmGC1-tsx0_nEb1UTStKxJ6sH3JXdV5hddpV-LvefvR4lEkNCfi-9ZfbVKwQ8u8yGSNbLxBFCYQBbVTmbOJjkbDMkMXVDaACZV7gYti6jO7B3AoThrmrbnGnWql03iU4-zAcc6CGU6zT-pnyuoCrMHrr6d8ZlumaKs"
            alt="Gopu AI"
            className="w-64 mx-auto mb-8"
          />

          <h2 className="text-4xl font-black mb-4">
            Welcome back, Admin
          </h2>

          <p className="text-gray-600">
            Manage animal health with Gopu AI and PashuVaani.
          </p>

        </div>

      </div>


      {/* Right Section */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-teal-50">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2">
            Admin Sign In
          </h2>

          <p className="text-gray-500 mb-8">
            Please enter your credentials to access the dashboard.
          </p>


          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email */}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="admin@pashuvaani.ai"
                className="w-full h-14 px-4 rounded-lg border bg-gray-50"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>


            {/* Password */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text":"password"}
                  placeholder="••••••••"
                  className="w-full h-14 px-4 rounded-lg border bg-gray-50"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute right-4 top-4"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  👁
                </button>

              </div>

            </div>


            {/* Remember */}

            <div className="flex items-center gap-2">

              <input type="checkbox"/>

              <span className="text-sm text-gray-600">
                Keep me signed in
              </span>

            </div>


            {/* Button */}

            <button
              type="submit"
              className="w-full h-14 bg-primary text-white font-bold rounded-lg"
            >
              Sign In
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}