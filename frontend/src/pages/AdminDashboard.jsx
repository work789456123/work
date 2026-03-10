import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/utils/api";
import { Users, Heart, Stethoscope, Calendar, AlertTriangle, LogOut, CreditCard, IndianRupee, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [emergencyLogs, setEmergencyLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const adminApi = api;
      adminApi.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
      
      const [statsRes, appsRes, apptsRes, emergRes] = await Promise.all([
        adminApi.get("/admin/dashboard"),
        adminApi.get("/admin/doctor-applications?status=pending"),
        adminApi.get("/admin/appointments"),
        adminApi.get("/admin/emergency-logs")
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
      setAppointments(apptsRes.data);
      setEmergencyLogs(emergRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleApprove = async (appId) => {
    try {
      await api.put(`/admin/doctor-applications/${appId}/approve`);
      toast.success("Doctor application approved");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to approve application");
    }
  };

  const handleReject = async (appId) => {
    try {
      await api.put(`/admin/doctor-applications/${appId}/reject`);
      toast.success("Doctor application rejected");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await api.put(`/admin/appointments/${appointmentId}/confirm`);
      toast.success("Appointment confirmed");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to confirm appointment");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.put(`/admin/appointments/${appointmentId}/cancel`);
      toast.success("Appointment cancelled");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  if (!stats) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="heading-font text-4xl font-bold text-[#111111]" data-testid="dashboard-heading">Admin Dashboard</h1>
            <p className="text-[#6F6F6F]">PashuVaani Management Portal</p>
          </div>
          <Button onClick={handleLogout} variant="outline" data-testid="admin-logout" className="rounded-full border-[#EAEAEA]">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 rounded-2xl border-[#EAEAEA]" data-testid="stat-card-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6F6F6F]">Total Users</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">{stats.total_users}</p>
              </div>
              <Users className="w-12 h-12 text-[#1F6559] opacity-20" />
            </div>
          </Card>
          <Card className="p-6 rounded-2xl border-[#EAEAEA]" data-testid="stat-card-pets">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6F6F6F]">Total Pets</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">{stats.total_pets}</p>
              </div>
              <Heart className="w-12 h-12 text-[#1F6559] opacity-20" />
            </div>
          </Card>
          <Card className="p-6 rounded-2xl border-[#EAEAEA]" data-testid="stat-card-doctors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6F6F6F]">Total Doctors</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">{stats.total_doctors || 4}</p>
              </div>
              <Stethoscope className="w-12 h-12 text-[#1F6559] opacity-20" />
            </div>
          </Card>
          <Card className="p-6 rounded-2xl border-[#EAEAEA]" data-testid="stat-card-appointments">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6F6F6F]">Appointments</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">{stats.total_appointments}</p>
              </div>
              <Calendar className="w-12 h-12 text-[#1F6559] opacity-20" />
            </div>
          </Card>
        </div>

        {/* Credit Analytics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 rounded-2xl border-[#1F6559] bg-[#1F6559]/5" data-testid="stat-card-credits-purchased">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1F6559]">Total Credits Purchased</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">{stats.total_credits_purchased || 0}</p>
              </div>
              <CreditCard className="w-12 h-12 text-[#1F6559] opacity-40" />
            </div>
          </Card>
          <Card className="p-6 rounded-2xl border-yellow-400 bg-yellow-50" data-testid="stat-card-credits-used">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Total Credits Used</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">{stats.total_credits_used || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-600 opacity-40" />
            </div>
          </Card>
          <Card className="p-6 rounded-2xl border-green-400 bg-green-50" data-testid="stat-card-revenue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Revenue from Credits</p>
                <p className="heading-font text-3xl font-bold text-[#111111] mt-2">₹{stats.revenue_from_credits || 0}</p>
              </div>
              <IndianRupee className="w-12 h-12 text-green-600 opacity-40" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white border border-[#EAEAEA] rounded-xl p-1">
            <TabsTrigger value="appointments" data-testid="tab-appointments">Appointments ({stats.total_appointments})</TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-applications">Doctor Applications ({stats.pending_doctor_applications || 0})</TabsTrigger>
            <TabsTrigger value="emergencies" data-testid="tab-emergencies">Emergency Logs ({stats.emergency_alerts_7d})</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            {appointments.slice(0, 10).map((appt) => (
              <Card key={appt.id} className="p-6 rounded-2xl border-[#EAEAEA]" data-testid="appointment-card">
                <div className="flex items-start justify-between">
                  <div className="grid md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <p className="text-sm text-[#6F6F6F]">Pet: <strong className="text-[#111111]">{appt.pet_name}</strong> ({appt.pet_type})</p>
                      <p className="text-sm text-[#6F6F6F]">Owner: <strong className="text-[#111111]">{appt.owner_name}</strong></p>
                      <p className="text-sm text-[#6F6F6F]">Contact: {appt.owner_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6F6F6F]">Time Slot: <strong className="text-[#111111]">{appt.time_slot}</strong></p>
                      <p className="text-sm text-[#6F6F6F]">Status: <span className={`font-semibold ${appt.status === 'pending' ? 'text-[#F59E0B]' : appt.status === 'confirmed' ? 'text-[#1F6559]' : 'text-red-500'}`}>{appt.status}</span></p>
                    </div>
                  </div>
                  {appt.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button onClick={() => handleConfirmAppointment(appt.id)} size="sm" className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]">
                        Confirm
                      </Button>
                      <Button onClick={() => handleCancelAppointment(appt.id)} size="sm" variant="outline" className="rounded-full border-red-300 text-red-600 hover:bg-red-50">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
            {appointments.length === 0 && <p className="text-center text-[#6F6F6F] py-12">No appointments yet</p>}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6 rounded-2xl border-[#EAEAEA]" data-testid="application-card">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="heading-font text-lg font-semibold text-[#111111]">{app.name}</h3>
                    <p className="text-sm text-[#6F6F6F]">{app.qualification} | {app.specialization}</p>
                    <p className="text-sm text-[#6F6F6F]">Experience: {app.experience_years} years | District: {app.district}</p>
                    <p className="text-sm text-[#6F6F6F]">Email: {app.email} | Phone: {app.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleApprove(app.id)} data-testid="approve-button" className="rounded-full bg-[#1F6559] text-white hover:bg-[#1F6559]/90">
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(app.id)} data-testid="reject-button" variant="outline" className="rounded-full border-[#D92D20] text-[#D92D20] hover:bg-[#D92D20]/5">
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {applications.length === 0 && <p className="text-center text-[#6F6F6F] py-12">No pending applications</p>}
          </TabsContent>

          <TabsContent value="emergencies" className="space-y-4">
            {emergencyLogs.map((log) => (
              <Card key={log.id} className="p-6 rounded-2xl border-[#D92D20] bg-[#D92D20]/5" data-testid="emergency-card">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-[#D92D20] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-[#6F6F6F] mb-2">{new Date(log.timestamp).toLocaleString()}</p>
                    <p className="text-[#111111]">{log.message}</p>
                  </div>
                </div>
              </Card>
            ))}
            {emergencyLogs.length === 0 && <p className="text-center text-[#6F6F6F] py-12">No emergency logs</p>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
