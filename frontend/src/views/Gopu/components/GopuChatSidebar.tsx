import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Clock, MessageSquare, X, AlertTriangle, Loader2 } from "lucide-react";
import { gopuChat } from "@/assets/content/gopu";
import type { GopuChatSidebarProps } from "@/types/gopu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function GopuChatSidebar({
  sessions,
  sessionId,
  onNewChat,
  onSelectSession,
  isMobileOpen,
  onRequestCloseMobile,
}: GopuChatSidebarProps) {
  const c = gopuChat.sidebar;
  const hc = gopuChat.header;

  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [complaintPhone, setComplaintPhone] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintPhone.length !== 10 || !/^\d+$/.test(complaintPhone)) {
      setSubmitError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!complaintDesc.trim()) {
      setSubmitError("Description is required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/medical-emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          mobile_number: complaintPhone,
          description: complaintDesc,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit complaint.");
      }

      setSubmitSuccess(true);






    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "An error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div
      id="gopu-chat-sidebar"
      role="navigation"
      aria-label={c.recentHistory}
      className={cn(
        "flex fixed top-0 left-0 h-[calc(100vh-80px)] w-80 max-w-[85vw] mt-20 bg-teal-50 border-r border-[#EAEAEA] flex-col p-6 space-y-6 z-40",
        "transition-transform duration-200 ease-out",
        "lg:translate-x-0 lg:pointer-events-auto",
        isMobileOpen
          ? "max-lg:translate-x-0 max-lg:pointer-events-auto"
          : "max-lg:-translate-x-full max-lg:pointer-events-none",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden absolute top-4 right-4 z-10 text-[#6F6F6F] hover:text-[#333]"
        onClick={onRequestCloseMobile}
        aria-label={hc.closeSidebarAria}
      >
        <X className="w-5 h-5" />
      </Button>
      <Button
        onClick={onNewChat}
        className={cn(
          "w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] flex items-center justify-center gap-2 py-6",
          "max-lg:pr-12",
        )}
      >
        <Plus className="w-5 h-5" />
        {c.newChat}
      </Button>
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center gap-2 text-[#6F6F6F] px-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">{c.recentHistory}</span>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-[#9F9F9F] text-sm">{c.emptyHistory}</div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${sessionId === session.id
                  ? "bg-[#1F6559]/5 border border-[#1F6559]/20 text-[#1F6559]"
                  : "hover:bg-gray-50 text-[#6F6F6F]"
                  }`}
              >
                <MessageSquare
                  className={`w-4 h-4 mt-1 ${sessionId === session.id ? "text-[#1F6559]" : "text-[#9F9F9F]"}`}
                />
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">
                    {session.title ?? c.sessionLabel}
                  </p>
                  <p className="text-[10px] opacity-60">
                    {new Date(session.created_at ?? session.updatedAt ?? 0).toLocaleDateString()} at{" "}
                    {new Date(session.created_at ?? session.updatedAt ?? 0).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#EAEAEA]">
        <Button
          onClick={() => setIsComplaintOpen(true)}
          className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Raise a Medical Complaint
        </Button>
      </div>

      <Dialog open={isComplaintOpen} onOpenChange={(open) => {
        setIsComplaintOpen(open);
        if (!open) {
          setSubmitSuccess(false);
          setComplaintPhone("");
          setComplaintDesc("");
          setSubmitError("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Raise Medical Complaint
            </DialogTitle>
            <DialogDescription>
              Please provide your mobile number and a short description of the medical emergency. A veterinarian will contact you.
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-6 text-center text-green-600 font-medium">
              Complaint submitted successfully! We will contact you shortly.
            </div>
          ) : (
            <form onSubmit={handleComplaintSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mobile Number (10 digits) *</label>
                <Input
                  required
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={complaintPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setComplaintPhone(val);
                  }}
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Short Description *</label>
                <Textarea
                  required
                  placeholder="Describe the medical issue..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  rows={4}
                />
              </div>
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsComplaintOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Submit
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
