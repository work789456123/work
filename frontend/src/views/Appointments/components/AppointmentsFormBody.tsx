import type { ComponentProps } from "react";
import { appointmentsPage, appointmentTimeSlots } from "@/assets/content/appointments";
import type { AppointmentsFormBodyProps } from "@/types/appointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

const selectTriggerClass = cn(
  "h-11 border-[#E2E8E5] bg-[#FAFAFA]/80 focus:ring-[#1F6559]/35 focus:ring-2 focus:ring-offset-0"
);

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export default function AppointmentsFormBody({ form, onFieldChange, onSubmit }: AppointmentsFormBodyProps) {
  const c = appointmentsPage;

  return (
    <Card
      id="appointments-booking-form-card"
      className="overflow-hidden border-[#C7D3CC]/70 bg-white/95 shadow-xl shadow-[#1F6559]/5 backdrop-blur-sm"
    >
      <CardHeader className="space-y-2 border-b border-[#E8EEEB] bg-gradient-to-br from-[#1FA7A6]/[0.06] via-transparent to-[#78D65C]/[0.06] pb-6">
        <CardTitle id="appointments-form-title" className="heading-font text-2xl text-[#333] md:text-[1.65rem]">
          {c.formTitle}
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed text-[#6F6F6F]">{c.formDescription}</CardDescription>
      </CardHeader>

      <CardContent className="pt-8">
        <form id="appointments-booking-form" onSubmit={onSubmit} className="space-y-10">
          <div className="space-y-5">
            <h3 className="heading-font text-sm font-semibold uppercase tracking-wider text-[#1F6559]">
              {c.sections.pet}
            </h3>
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup>
                <Label htmlFor="appointments-field-pet_name">{c.placeholders.petName}</Label>
                <Input
                  id="appointments-field-pet_name"
                  placeholder={c.placeholders.petName}
                  className="h-11 border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                  value={form.pet_name}
                  onChange={(e) => onFieldChange("pet_name", e.target.value)}
                  required
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="appointments-field-pet_type">{c.placeholders.petType}</Label>
                <Input
                  id="appointments-field-pet_type"
                  placeholder={c.placeholders.petType}
                  className="h-11 border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                  value={form.pet_type}
                  onChange={(e) => onFieldChange("pet_type", e.target.value)}
                  required
                />
              </FieldGroup>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <FieldGroup>
                <Label htmlFor="appointments-field-gender">{c.placeholders.gender}</Label>
                <input
                  readOnly
                  required
                  value={form.gender}
                  aria-hidden
                  tabIndex={-1}
                  className="sr-only pointer-events-none absolute m-0 h-px w-px overflow-hidden border-0 p-0 opacity-0"
                />
                <Select value={form.gender || undefined} onValueChange={(value) => onFieldChange("gender", value)}>
                  <SelectTrigger id="appointments-field-gender" className={selectTriggerClass}>
                    <SelectValue placeholder={c.placeholders.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    {c.genderOptions
                      .filter((o) => o.value !== "")
                      .map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="appointments-field-age">{c.placeholders.age}</Label>
                <Input
                  id="appointments-field-age"
                  placeholder={c.placeholders.age}
                  className="h-11 border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                  value={form.age}
                  onChange={(e) => onFieldChange("age", e.target.value)}
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="appointments-field-weight">{c.placeholders.weight}</Label>
                <div className="flex gap-2">
                  <Input
                    id="appointments-field-weight"
                    placeholder={c.placeholders.weight}
                    className="h-11 flex-1 border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                    value={form.weight}
                    onChange={(e) => onFieldChange("weight", e.target.value)}
                  />
                  <Select
                    value={form.weight_unit}
                    onValueChange={(value) => onFieldChange("weight_unit", value)}
                  >
                    <SelectTrigger
                      id="appointments-field-weight_unit"
                      className={cn(selectTriggerClass, "w-[5.5rem] shrink-0")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {c.weightUnits.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FieldGroup>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="heading-font text-sm font-semibold uppercase tracking-wider text-[#1F6559]">
              {c.sections.owner}
            </h3>
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup>
                <Label htmlFor="appointments-field-owner_name">{c.placeholders.ownerName}</Label>
                <Input
                  id="appointments-field-owner_name"
                  placeholder={c.placeholders.ownerName}
                  className="h-11 border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                  value={form.owner_name}
                  onChange={(e) => onFieldChange("owner_name", e.target.value)}
                  required
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="appointments-field-owner_number">{c.placeholders.ownerPhone}</Label>
                <Input
                  id="appointments-field-owner_number"
                  type="tel"
                  placeholder={c.placeholders.ownerPhone}
                  className="h-11 border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                  value={form.owner_number}
                  onChange={(e) => onFieldChange("owner_number", e.target.value)}
                  required
                />
              </FieldGroup>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="heading-font text-sm font-semibold uppercase tracking-wider text-[#1F6559]">
              {c.sections.visit}
            </h3>
            <FieldGroup>
              <Label htmlFor="appointments-field-time_slot">{c.placeholders.timeSlot}</Label>
              <input
                readOnly
                required
                value={form.time_slot}
                aria-hidden
                tabIndex={-1}
                className="sr-only pointer-events-none absolute m-0 h-px w-px overflow-hidden border-0 p-0 opacity-0"
              />
              <Select value={form.time_slot || undefined} onValueChange={(value) => onFieldChange("time_slot", value)}>
                <SelectTrigger id="appointments-field-time_slot" className={selectTriggerClass}>
                  <SelectValue placeholder={c.placeholders.timeSlot} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {appointmentTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>

            <div
              id="appointments-checkboxes"
              className="rounded-xl border border-[#E2E8E5] bg-[#FAFAFA]/60 p-5 space-y-4"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="appointments-field-vaccination_status"
                  checked={form.vaccination_status}
                  onCheckedChange={(v) => onFieldChange("vaccination_status", v === true)}
                  className="mt-0.5 border-[#1F6559]/40 data-[state=checked]:bg-[#1F6559] data-[state=checked]:border-[#1F6559]"
                />
                <Label
                  htmlFor="appointments-field-vaccination_status"
                  className="cursor-pointer font-normal leading-snug text-[#333]"
                >
                  {c.labels.vaccinated}
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="appointments-field-medical_history_available"
                  checked={form.medical_history_available}
                  onCheckedChange={(v) => onFieldChange("medical_history_available", v === true)}
                  className="mt-0.5 border-[#1F6559]/40 data-[state=checked]:bg-[#1F6559] data-[state=checked]:border-[#1F6559]"
                />
                <Label
                  htmlFor="appointments-field-medical_history_available"
                  className="cursor-pointer font-normal leading-snug text-[#333]"
                >
                  {c.labels.medicalHistoryAvailable}
                </Label>
              </div>
            </div>

            {form.medical_history_available && (
              <div id="appointments-medical-history-block" className="space-y-3">
                <div
                  className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 text-sm text-amber-950"
                  role="status"
                >
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                  <p className="leading-relaxed">{c.labels.medicalHistoryWarning}</p>
                </div>
                <FieldGroup>
                  <Label htmlFor="appointments-field-medical_history">{c.labels.medicalHistoryNotes}</Label>
                  <Textarea
                    id="appointments-field-medical_history"
                    placeholder={c.placeholders.medicalNote}
                    rows={4}
                    className="min-h-[120px] resize-y border-[#E2E8E5] bg-[#FAFAFA]/80 focus-visible:ring-[#1F6559]/35"
                    value={form.medical_history}
                    onChange={(e) => onFieldChange("medical_history", e.target.value)}
                  />
                </FieldGroup>
              </div>
            )}
          </div>

          <Button
            id="appointments-submit"
            type="submit"
            size="lg"
            className="heading-font h-12 w-full rounded-xl bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#1F6559] text-base font-semibold text-white shadow-lg shadow-[#1F6559]/20 transition hover:opacity-[0.97] hover:shadow-xl"
          >
            {c.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
