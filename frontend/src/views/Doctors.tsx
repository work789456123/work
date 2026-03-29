"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/utils/api";
import { doctorsPage } from "@/assets/content/doctors";
import UserPageShell from "@/motion/UserPageShell";
import type { DoctorListItem } from "@/types/doctors";

type DoctorsProps = {
  /** When set, data came from SSR (including empty array). When undefined, fetch on client. */
  initialFromServer?: DoctorListItem[];
};

const Doctors = ({ initialFromServer }: DoctorsProps) => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<DoctorListItem[]>(initialFromServer ?? []);
  const c = doctorsPage;

  useEffect(() => {
    if (initialFromServer !== undefined) return;
    (async () => {
      try {
        const response = await api.get<DoctorListItem[]>("/doctors");
        setDoctors(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    })();
  }, [initialFromServer]);

  return (
    <UserPageShell id="page-doctors" className="min-h-screen bg-[#FAFAFA] py-12" data-testid="doctors-page">
      <div id="doctors-inner" className="max-w-7xl mx-auto px-6">
        <div id="doctors-intro" className="text-center mb-12 space-y-4">
          <h1
            id="doctors-page-title"
            className="heading-font text-4xl lg:text-5xl font-bold text-[#333]"
            data-testid="doctors-heading"
          >
            {c.title}
          </h1>
          <p className="text-lg text-[#6F6F6F]">{c.subtitle}</p>
        </div>
        <div id="doctors-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card
              id={`doctors-card-${doctor.id}`}
              key={doctor.id}
              className="p-6 rounded-2xl border-[#EAEAEA] space-y-4 hover:shadow-lg hover:border-[#1F6559] transition-all"
              data-testid="doctor-card"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
              <div>
                <h3 className="heading-font text-xl font-semibold text-[#333]" data-testid="doctor-name">
                  {doctor.name}
                </h3>
                <p className="text-sm text-[#6F6F6F]">{doctor.specialization}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-[#6F6F6F]">
                  <strong>{c.yearsLabel}</strong> {doctor.years_of_practice} {c.yearsSuffix}
                </p>
                <p className="text-[#1F6559] font-semibold text-lg">
                  {c.feePrefix}
                  {doctor.consultation_fee} {c.feeSuffix}
                </p>
              </div>
              <Button
                onClick={() => router.push("/appointments")}
                data-testid="consult-doctor-button"
                className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
              >
                {c.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </UserPageShell>
  );
};

export default Doctors;
