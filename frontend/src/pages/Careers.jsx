import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Briefcase, Users, Heart } from "lucide-react";
import api from "@/utils/api";

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    resume: null
  });
  const [resumeFileName, setResumeFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF or DOC/DOCX file only");
        return;
      }
      setFormData({ ...formData, resume: file });
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Resume = reader.result.split(',')[1];
        
        await api.post("/career/", {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          resume_base64: base64Resume,
          resume_filename: resumeFileName
        });

        toast.success("Application submitted successfully! We will contact you soon.");
        setFormData({ name: "", phone: "", email: "", resume: null });
        setResumeFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(formData.resume);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="careers-page">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#333]" data-testid="careers-heading">
            Join the PashuVaani Family
          </h1>
          <p className="text-lg text-[#6F6F6F] max-w-2xl mx-auto">
            Be part of our mission to revolutionize animal healthcare in India. We're looking for passionate individuals who believe that "Pashu Bhi Pariwar Hai".
          </p>
        </div>

        {/* Why Join Us */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 rounded-2xl border-[#EAEAEA] text-center space-y-4">
            <div className="w-16 h-16 bg-[#1F6559]/10 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-[#1F6559]" />
            </div>
            <h3 className="heading-font text-xl font-semibold text-[#333]">Meaningful Work</h3>
            <p className="text-[#6F6F6F]">Make a real difference in the lives of animals and their families across India.</p>
          </Card>
          <Card className="p-8 rounded-2xl border-[#EAEAEA] text-center space-y-4">
            <div className="w-16 h-16 bg-[#1F6559]/10 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-[#1F6559]" />
            </div>
            <h3 className="heading-font text-xl font-semibold text-[#333]">Amazing Team</h3>
            <p className="text-[#6F6F6F]">Work with passionate veterinarians, technologists, and animal lovers.</p>
          </Card>
          <Card className="p-8 rounded-2xl border-[#EAEAEA] text-center space-y-4">
            <div className="w-16 h-16 bg-[#1F6559]/10 rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-[#1F6559]" />
            </div>
            <h3 className="heading-font text-xl font-semibold text-[#333]">Growth Opportunities</h3>
            <p className="text-[#6F6F6F]">Learn, grow, and advance your career in a fast-growing startup.</p>
          </Card>
        </div>

        {/* Application Form */}
        <Card className="max-w-2xl mx-auto p-8 rounded-2xl border-[#EAEAEA]">
          <h2 className="heading-font text-2xl font-bold text-[#333] text-center mb-2">Apply Now</h2>
          <p className="text-[#6F6F6F] text-center mb-8">Send us your details and we'll get back to you</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                data-testid="career-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your full name"
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                data-testid="career-phone-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="Enter your phone number"
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                data-testid="career-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter your email address"
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>

            <div>
              <Label htmlFor="resume">Resume Upload *</Label>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="career-resume-input"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-8 text-center cursor-pointer hover:border-[#1F6559] transition-colors"
                >
                  <Upload className="w-10 h-10 text-[#6F6F6F] mx-auto mb-3" />
                  {resumeFileName ? (
                    <p className="text-[#1F6559] font-medium">{resumeFileName}</p>
                  ) : (
                    <>
                      <p className="text-[#6F6F6F]">Click to upload your resume</p>
                      <p className="text-sm text-[#9F9F9F] mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="career-submit-button"
              className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] py-6 text-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Careers;
