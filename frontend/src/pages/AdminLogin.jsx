import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/utils/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/admin/login", formData);
      localStorage.setItem('admin_token', response.data.token);
      toast.success(response.data.message);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12" data-testid="admin-login-page">
      <Card className="max-w-md w-full p-8 rounded-2xl border-[#EAEAEA]">
        <div className="text-center mb-8">
          <h1 className="heading-font text-3xl font-bold text-[#111111]" data-testid="admin-login-heading">Admin Login</h1>
          <p className="text-sm text-[#6F6F6F] mt-2">PashuVaani Management Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" data-testid="admin-email-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" data-testid="admin-password-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
          </div>
          <Button type="submit" data-testid="admin-login-button" className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#1F6559]/90 py-6 text-lg">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;