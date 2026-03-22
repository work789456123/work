import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/utils/api";

const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    qualification: "",
    registration_number: "",
    specialization: "",
    district: "",
    experience_years: "",
    consultation_fee: "",
    availability: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/doctors/apply", {
        ...formData,
        experience_years: parseInt(formData.experience_years),
        consultation_fee: parseFloat(formData.consultation_fee)
      });
      setShowSuccess(true);
      setFormData({
        name: "", phone: "", email: "", qualification: "", registration_number: "",
        specialization: "", district: "", experience_years: "", consultation_fee: "", availability: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit application");
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12" data-testid="success-popup">
        <Card className="max-w-md p-12 rounded-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#1F6559]/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="heading-font text-3xl font-bold text-[#111111]">Thank You!</h2>
          <p className="text-[#6F6F6F]">PashuVaani team will contact you shortly.</p>
          <Button onClick={() => setShowSuccess(false)} className="rounded-full bg-[#1F6559] text-white">
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="doctor-registration-page">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl font-bold text-[#111111] mb-4" data-testid="registration-heading">Doctor Registration</h1>
          <p className="text-[#6F6F6F]">Join the PashuVaani network of verified professionals</p>
        </div>

        <Card className="p-8 rounded-2xl border-[#EAEAEA]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" data-testid="doctor-name-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" data-testid="doctor-phone-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input type="email" id="email" data-testid="doctor-email-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input id="qualification" data-testid="doctor-qualification-input" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="registration_number">Registration Number *</Label>
                <Input id="registration_number" data-testid="doctor-registration-number-input" value={formData.registration_number} onChange={(e) => setFormData({...formData, registration_number: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="specialization">Specialization *</Label>
                <Input id="specialization" data-testid="doctor-specialization-input" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Input id="district" data-testid="doctor-district-input" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="experience_years">Experience (years) *</Label>
                <Input type="number" id="experience_years" data-testid="doctor-experience-input" value={formData.experience_years} onChange={(e) => setFormData({...formData, experience_years: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="consultation_fee">Consultation Fee (₹) *</Label>
                <Input type="number" id="consultation_fee" data-testid="doctor-fee-input" value={formData.consultation_fee} onChange={(e) => setFormData({...formData, consultation_fee: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
            </div>
            <div>
              <Label htmlFor="availability">Availability *</Label>
              <Textarea id="availability" data-testid="doctor-availability-input" placeholder="e.g., Mon-Fri 9AM-6PM" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
            </div>
            <Button type="submit" data-testid="submit-doctor-registration" className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#1F6559]/90 py-6 text-lg">
              Submit Application
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRegistration;