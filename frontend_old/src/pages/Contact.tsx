import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/utils/api";
import { Mail, Phone, MapPin } from "lucide-react";
import { contactPage, contactChannels, contactForm } from "@/assets/content/contact";
import UserPageShell from "@/motion/UserPageShell";
import { lucideFromMap } from "@/lib/lucideFromMap";

const iconFor = { phone: Phone, email: Mail, address: MapPin };

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const p = contactPage;
  const f = contactForm;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<{ message?: string }>("/contact", formData);
      toast.success(response.data.message ?? "Message sent");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: unknown) {
      const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
      toast.error(typeof detail === "string" ? detail : "Failed to send message");
    }
  };

  return (
    <UserPageShell id="page-contact" className="min-h-screen bg-[#FAFAFA] py-12" data-testid="contact-page">
      <div id="contact-inner" className="max-w-6xl mx-auto px-6">
        <div id="contact-intro" className="text-center mb-12">
          <h1
            id="contact-page-title"
            className="heading-font text-4xl lg:text-5xl font-bold text-[#333] mb-4"
            data-testid="contact-heading"
          >
            {p.title}
          </h1>
          <p className="text-lg text-[#6F6F6F]">{p.subtitle}</p>
        </div>
        <div id="contact-layout" className="grid lg:grid-cols-2 gap-12">
          <div id="contact-channels" className="space-y-8">
            {contactChannels.map((ch) => {
              const Icon = lucideFromMap(iconFor, ch.key);
              if (!Icon) return null;
              return (
                <div key={ch.key} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#1F6559]" />
                  </div>
                  <div>
                    <h3 className="heading-font text-lg font-semibold text-[#333] mb-2">{ch.title}</h3>
                    <p className="text-[#6F6F6F]" data-testid={`contact-${ch.key}`}>
                      {ch.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <Card id="contact-form-card" className="p-8 rounded-2xl border-[#EAEAEA]">
            <form id="contact-message-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="contact-form-name">{f.labels.name}</Label>
                <Input
                  id="contact-form-name"
                  data-testid="contact-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
              <div>
                <Label htmlFor="contact-form-email">{f.labels.email}</Label>
                <Input
                  type="email"
                  id="contact-form-email"
                  data-testid="contact-email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
              <div>
                <Label htmlFor="contact-form-message">{f.labels.message}</Label>
                <Textarea
                  id="contact-form-message"
                  data-testid="contact-message-input"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
              <Button
                id="contact-form-submit"
                type="submit"
                data-testid="contact-submit-button"
                className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#1F6559]/90 py-6 text-lg"
              >
                {f.submit}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </UserPageShell>
  );
};

export default Contact;
