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
      <div className="min-h-screen bg-[#FAFAFA] py-12">

        <div className="max-w-3xl mx-auto px-6">

          <h1 className="text-3xl font-bold text-center mb-8">
            Appointment with {selectedDoctor.name}
          </h1>

          <Card className="p-8 rounded-2xl">

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <Label>Pet Name</Label>
                <Input
                  value={formData.pet_name}
                  onChange={(e) =>
                    setFormData({ ...formData, pet_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Pet Type</Label>
                <Input
                  placeholder="Dog, Cat, Cow"
                  value={formData.pet_type}
                  onChange={(e) =>
                    setFormData({ ...formData, pet_type: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Owner Name</Label>
                <Input
                  value={formData.owner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Owner Number</Label>
                <Input
                  value={formData.owner_number}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_number: e.target.value })
                  }
                />
              </div>

              <Button className="w-full bg-[#1F6559] text-white">
                Book Appointment
              </Button>

              <Button
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
    <div className="min-h-screen bg-[#FAFAFA] py-12">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-center mb-12">
          Choose Your Doctor
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {doctors.map((doctor) => (
            <Card key={doctor.id} className="p-6 text-center rounded-2xl">

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