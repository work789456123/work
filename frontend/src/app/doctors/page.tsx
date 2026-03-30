import Doctors from "@/views/Doctors";
import { doctorsPage } from "@/assets/content/doctors";
import type { DoctorListItem } from "@/types/doctors";
import { API_BASE } from "@/utils/api";

export const revalidate = 300;

async function fetchDoctorsFromServer(): Promise<DoctorListItem[] | undefined> {
  if (!process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NODE_ENV === "production") {
    return undefined;
  }
  try {
    const url = `${API_BASE.replace(/\/$/, "")}/doctors`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return undefined;
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as DoctorListItem[]) : [];
  } catch {
    return undefined;
  }
}

export async function generateMetadata() {
  return {
    title: doctorsPage.title,
    description: doctorsPage.subtitle,
  };
}

export default async function DoctorsPage() {
  const initialFromServer = await fetchDoctorsFromServer();
  return <Doctors initialFromServer={initialFromServer} />;
}
