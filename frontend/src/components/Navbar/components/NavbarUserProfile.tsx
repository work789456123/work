"use client";

import { useState, useEffect } from "react";
import { User, Loader2, LogOut, Calendar, Clock, Activity, PawPrint, Phone, Mail, User as UserIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";

type UserData = {
  full_name: string;
  phone_or_email: string;
  credits: number;
  has_subscription: boolean;
};

type PetData = {
  id: string;
  name: string;
  pet_type: string;
  age: string;
  gender: string;
  weight: string;
};

type ApptData = {
  id: string;
  pet_name: string;
  pet_type: string;
  time_slot: string;
  status: string;
  created_at: string;
};

export default function NavbarUserProfile({ onLogout, trigger }: { onLogout: () => void, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pets, setPets] = useState<PetData[]>([]);
  const [appointments, setAppointments] = useState<ApptData[]>([]);

  useEffect(() => {
    if (open) {
      fetchProfileData();
    }
  }, [open]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [userRes, petsRes, apptRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/pets"),
        api.get("/appointments"),
      ]);
      setUserData(userRes.data);
      setPets(petsRes.data);
      setAppointments(apptRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ? trigger : (
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
          title="User Profile"
        >
          <User className="h-5 w-5" />
        </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-slate-50 border-l-0 shadow-2xl relative">
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none transition-opacity" 
          style={{ backgroundImage: "url('/images/bg_paws.png')", backgroundSize: '200px', backgroundRepeat: 'repeat' }}
        ></div>
        
        <div className="bg-[#1F6559] text-white p-6 pb-8 z-10 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/images/bg_paws.png')", backgroundSize: '150px', backgroundRepeat: 'repeat' }}></div>
          <SheetHeader className="relative z-10">
            <SheetTitle className="heading-font text-2xl font-bold text-white flex items-center gap-2">
              <UserIcon className="h-6 w-6" /> My Profile
            </SheetTitle>
            <SheetDescription className="text-white/80 font-medium">
              Manage your personal details, pets, and appointments.
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <ScrollArea className="flex-1 -mt-4 px-6 pb-6 z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#1F6559]">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="heading-font font-medium animate-pulse">Loading profile data...</p>
            </div>
          ) : (
            <div className="space-y-8 pt-4">
              {/* User Details */}
              {userData && (
                <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="heading-font font-bold text-lg text-[#1F6559] flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#1F6559]" /> Account Details
                  </h3>
                  <Card className="border border-[#1F6559]/20 shadow-sm overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl">
                    <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center gap-3">
                          <div className="bg-[#1F6559]/10 p-2.5 rounded-xl text-[#1F6559]">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Full Name</p>
                            <p className="font-semibold text-slate-900 heading-font">{userData.full_name}</p>
                          </div>
                        </div>
                        <div className="p-4 flex items-center gap-3">
                          <div className="bg-[#1F6559]/10 p-2.5 rounded-xl text-[#1F6559]">
                            {userData.phone_or_email.includes('@') ? (
                              <Mail className="h-4 w-4" />
                            ) : (
                              <Phone className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Contact</p>
                            <p className="font-semibold text-slate-900 heading-font">{userData.phone_or_email}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Pet Details */}
              <section className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both">
                <div className="flex items-center justify-between">
                  <h3 className="heading-font font-bold text-lg text-[#1F6559] flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-[#1F6559]" /> My Pets
                    <Badge variant="outline" className="bg-white border-[#1F6559]/30 text-[#1F6559]">{pets.length}</Badge>
                  </h3>
                  <Button 
                    size="sm" 
                    className="heading-font bg-[#1F6559] hover:bg-[#184F46] text-white shadow-sm transition h-8 rounded-xl px-3"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Pet
                  </Button>
                </div>
                {pets.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center border shadow-sm">
                    <PawPrint className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-500">No pets added yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {pets.map((pet) => (
                      <Card key={pet.id} className="border border-[#E2E8E5] bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group rounded-2xl">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1F6559] opacity-70 group-hover:opacity-100 transition-all"></div>
                        <CardContent className="p-4 pl-5 flex justify-between items-center">
                          <div>
                            <p className="heading-font font-bold text-lg text-[#1F1F1F]">{pet.name}</p>
                            <div className="flex gap-2 mt-1.5 flex-wrap">
                              <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-wider bg-[#1F6559]/10 text-[#1F6559] hover:bg-[#1F6559]/20">
                                {pet.pet_type}
                              </Badge>
                              {pet.age && pet.age !== "NA" && (
                                <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-wider bg-[#1F6559]/10 text-[#1F6559] hover:bg-[#1F6559]/20">
                                  {pet.age} {parseInt(pet.age) ? 'yrs' : ''}
                                </Badge>
                              )}
                              {pet.gender && (
                                <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-wider bg-[#1F6559]/10 text-[#1F6559] hover:bg-[#1F6559]/20">
                                  {pet.gender}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              {/* Appointment Details */}
              <section className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="heading-font font-bold text-lg text-[#1F6559] flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#1F6559]" /> Appointments
                    <Badge variant="outline" className="bg-white border-[#1F6559]/30 text-[#1F6559]">{appointments.length}</Badge>
                  </h3>
                  <Button 
                    size="sm" 
                    className="heading-font bg-[#1F6559] hover:bg-[#184F46] text-white shadow-sm transition h-8 rounded-xl px-3"
                    onClick={() => {
                      window.location.href = '/appointments';
                      setOpen(false);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Book
                  </Button>
                </div>
                {appointments.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center border shadow-sm">
                    <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-500">No appointments booked.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {appointments.map((appt) => (
                      <Card key={appt.id} className="border border-[#E2E8E5] bg-white/95 backdrop-blur-sm shadow-sm rounded-2xl">
                        <CardContent className="p-4 relative">
                          <Badge 
                            variant="outline" 
                            className={`absolute top-4 right-4 capitalize ${getStatusColor(appt.status)} border px-2.5 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider`}
                          >
                            {appt.status}
                          </Badge>
                          <div className="pr-24 mb-3">
                            <p className="heading-font font-bold text-[#1F1F1F]">{appt.pet_name} <span className="font-medium text-slate-500 text-sm">({appt.pet_type})</span></p>
                          </div>
                          <div className="bg-slate-50/80 rounded-xl p-3 flex flex-col gap-2 border border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Clock className="h-4 w-4 text-[#1F6559]" /> 
                              <span className="font-semibold">{appt.time_slot}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <Calendar className="h-3.5 w-3.5" /> 
                              Booked on {new Date(appt.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

            </div>
          )}
        </ScrollArea>
        <div className="p-6 bg-white border-t border-slate-100 mt-auto z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative">
          <Button 
            variant="destructive" 
            className="heading-font w-full flex items-center gap-2 text-md h-12 shadow-sm rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-0"
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
          >
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}