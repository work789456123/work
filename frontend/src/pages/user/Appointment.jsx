import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AppointmentsPage = () => {

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialization: "Veterinary Surgeon",
      experience: "8 Years",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Dr. Priya Mehta",
      specialization: "Pet Nutrition & Care",
      experience: "5 Years",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "",
    owner_name: "",
    owner_number: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Appointment Booked Successfully");
  };

  if (selectedDoctor) {
    return (
      <div id="page-legacy-appointment-booking" className="min-h-screen bg-[#FAFAFA] py-12">
        <div id="legacy-appointment-booking-inner" className="max-w-3xl mx-auto px-6">
          <h1 id="legacy-appointment-booking-title" className="text-3xl font-bold text-center mb-8">
            Appointment with {selectedDoctor.name}
          </h1>

          <Card id="legacy-appointment-form-card" className="p-8 rounded-2xl">
            <form id="legacy-appointment-booking-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="legacy-appointment-pet_name">Pet Name</Label>
                <Input
                  id="legacy-appointment-pet_name"
                  value={formData.pet_name}
                  onChange={(e) =>
                    setFormData({ ...formData, pet_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="legacy-appointment-pet_type">Pet Type</Label>
                <Input
                  id="legacy-appointment-pet_type"
                  placeholder="Dog, Cat, Cow"
                  value={formData.pet_type}
                  onChange={(e) =>
                    setFormData({ ...formData, pet_type: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="legacy-appointment-owner_name">Owner Name</Label>
                <Input
                  id="legacy-appointment-owner_name"
                  value={formData.owner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="legacy-appointment-owner_number">Owner Number</Label>
                <Input
                  id="legacy-appointment-owner_number"
                  value={formData.owner_number}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_number: e.target.value })
                  }
                />
              </div>

              <Button id="legacy-appointment-submit" className="w-full bg-[#1F6559] text-white">
                Book Appointment
              </Button>

              <Button
                id="legacy-appointment-back"
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setSelectedDoctor(null)}
              >
                Back to Doctors
              </Button>

            </form>

          </Card>

        </div>

      </div>
    );
  }

  return (
    <div id="page-legacy-appointment-pick-doctor" className="min-h-screen bg-[#FAFAFA] py-12">
      <div id="legacy-appointment-pick-inner" className="max-w-5xl mx-auto px-6">
        <h1 id="legacy-appointment-pick-title" className="text-4xl font-bold text-center mb-12">
          Choose Your Doctor
        </h1>

        <div id="legacy-appointment-doctors-grid" className="grid md:grid-cols-2 gap-8">
          {doctors.map((doctor) => (
            <Card
              id={`legacy-appointment-doctor-card-${doctor.id}`}
              key={doctor.id}
              className="p-6 text-center rounded-2xl"
            >

              <img
                src={doctor.image}
                className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
              />

              <h2 className="text-xl font-bold">{doctor.name}</h2>

              <p className="text-[#1F6559]">{doctor.specialization}</p>

              <p className="text-gray-500">
                Experience: {doctor.experience}
              </p>

              <Button
                onClick={() => setSelectedDoctor(doctor)}
                className="mt-4 bg-[#1F6559] text-white"
              >
                Consult With Doctor
              </Button>

            </Card>
          ))}

        </div>

      </div>

    </div>
  );
};

export default AppointmentsPage;