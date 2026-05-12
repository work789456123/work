"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Briefcase, Users, Heart } from "lucide-react";
import api from "@/utils/api";
import { careersPage } from "@/assets/content/careers";
import UserPageShell from "@/motion/UserPageShell";
import { lucideFromMap } from "@/lib/lucideFromMap";

const valueIcons = { heart: Heart, users: Users, briefcase: Briefcase };

const Careers = () => {
  const p = careersPage;
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    resume: File | null;
  }>({
    name: "",
    phone: "",
    email: "",
    resume: null,
  });
  const [resumeFileName, setResumeFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const f = p.form;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF or DOC/DOCX file only");
        return;
      }
      setFormData({ ...formData, resume: file });
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.resume) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const raw = reader.result;
          if (typeof raw !== "string") {
            setIsSubmitting(false);
            return;
          }
          const base64Resume = raw.split(",")[1];
          await api.post("/career", {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            resume_base64: base64Resume,
            resume_filename: resumeFileName,
          });
          toast.success("Application submitted successfully! We will contact you soon.");
          setFormData({ name: "", phone: "", email: "", resume: null });
          setResumeFileName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: unknown) {
          const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
          toast.error(typeof detail === "string" ? detail : "Failed to submit application");
        } finally {
          setIsSubmitting(false);
        }
      };
      reader.readAsDataURL(formData.resume);
    } catch (error: unknown) {
      const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
      toast.error(typeof detail === "string" ? detail : "Failed to submit application");
      setIsSubmitting(false);
    }
  };

  return (
    <UserPageShell id="page-careers" className="min-h-screen bg-[#FAFAFA] py-12" data-testid="careers-page">
      <div id="careers-inner" className="max-w-6xl mx-auto px-6">
        <div id="careers-hero" className="text-center mb-16 space-y-4">
          <h1
            id="careers-page-title"
            className="heading-font text-4xl lg:text-5xl font-bold text-[#333]"
            data-testid="careers-heading"
          >
            {p.hero.title}
          </h1>
          <p className="text-lg text-[#6F6F6F] max-w-2xl mx-auto">{p.hero.subtitle}</p>
        </div>

        <div id="careers-values" className="grid md:grid-cols-3 gap-8 mb-16">
          {p.valueCards.map((card) => {
            const Icon = lucideFromMap(valueIcons, card.icon);
            if (!Icon) return null;
            return (
              <Card key={card.key} className="p-8 rounded-2xl border-[#EAEAEA] text-center space-y-4">
                <div className="w-16 h-16 bg-[#1F6559]/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon className="w-8 h-8 text-[#1F6559]" />
                </div>
                <h3 className="heading-font text-xl font-semibold text-[#333]">{card.title}</h3>
                <p className="text-[#6F6F6F]">{card.description}</p>
              </Card>
            );
          })}
        </div>

        <Card id="careers-application-card" className="max-w-2xl mx-auto p-8 rounded-2xl border-[#EAEAEA]">
          <h2 id="careers-form-title" className="heading-font text-2xl font-bold text-[#333] text-center mb-2">
            {f.title}
          </h2>
          <p id="careers-form-subtitle" className="text-[#6F6F6F] text-center mb-8">
            {f.subtitle}
          </p>

          <form id="careers-application-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="careers-form-name">{f.labels.name}</Label>
              <Input
                id="careers-form-name"
                data-testid="career-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder={f.placeholders.name}
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="careers-form-phone">{f.labels.phone}</Label>
              <Input
                id="careers-form-phone"
                type="tel"
                data-testid="career-phone-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder={f.placeholders.phone}
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="careers-form-email">{f.labels.email}</Label>
              <Input
                id="careers-form-email"
                type="email"
                data-testid="career-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder={f.placeholders.email}
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="careers-form-resume">{f.labels.resume}</Label>
              <div className="mt-2">
                <input
                  id="careers-form-resume"
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="career-resume-input"
                />
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-8 text-center cursor-pointer hover:border-[#1F6559] transition-colors"
                >
                  <Upload className="w-10 h-10 text-[#6F6F6F] mx-auto mb-3" />
                  {resumeFileName ? (
                    <p className="text-[#1F6559] font-medium">{resumeFileName}</p>
                  ) : (
                    <>
                      <p className="text-[#6F6F6F]">{f.uploadPrompt}</p>
                      <p className="text-sm text-[#9F9F9F] mt-1">{f.uploadHint}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              id="careers-form-submit"
              type="submit"
              disabled={isSubmitting}
              data-testid="career-submit-button"
              className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] py-6 text-lg"
            >
              {isSubmitting ? f.submitting : f.submit}
            </Button>
          </form>
        </Card>
      </div>
    </UserPageShell>
  );
};

export default Careers;
