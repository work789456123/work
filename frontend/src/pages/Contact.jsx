import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/utils/api";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/contact", formData);
      toast.success(response.data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="contact-page">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111] mb-4" data-testid="contact-heading">Contact Us</h1>
          <p className="text-lg text-[#6F6F6F]">We'd love to hear from you</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#1F6559]" />
              </div>
              <div>
                <h3 className="heading-font text-lg font-semibold text-[#111111] mb-2">Phone</h3>
                <p className="text-[#6F6F6F]" data-testid="contact-phone">7357123673</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#1F6559]" />
              </div>
              <div>
                <h3 className="heading-font text-lg font-semibold text-[#111111] mb-2">Email</h3>
                <p className="text-[#6F6F6F]" data-testid="contact-email">contact@pashuvaani.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#1F6559]" />
              </div>
              <div>
                <h3 className="heading-font text-lg font-semibold text-[#111111] mb-2">Address</h3>
                <p className="text-[#6F6F6F]" data-testid="contact-address">India Remote</p>
              </div>
            </div>
          </div>

          <Card className="p-8 rounded-2xl border-[#EAEAEA]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" data-testid="contact-name-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" data-testid="contact-email-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" data-testid="contact-message-input" rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <Button type="submit" data-testid="contact-submit-button" className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#1F6559]/90 py-6 text-lg">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;