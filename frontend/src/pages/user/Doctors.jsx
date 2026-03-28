import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/utils/api";
import { doctorsPage } from "@/assets/doctors";

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const c = doctorsPage;

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="doctors-page">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#333]" data-testid="doctors-heading">
            {c.title}
          </h1>
          <p className="text-lg text-[#6F6F6F]">{c.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="p-6 rounded-2xl border-[#EAEAEA] space-y-4 hover:shadow-lg hover:border-[#1F6559] transition-all"
              data-testid="doctor-card"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
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
                onClick={() => navigate("/appointments")}
                data-testid="consult-doctor-button"
                className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
              >
                {c.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
