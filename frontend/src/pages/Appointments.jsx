import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/utils/api";

const Appointments = () => {
  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "",
    gender: "",
    age: "NA",
    weight: "",
    weight_unit: "KG",
    owner_name: "",
    owner_number: "",
    vaccination_status: false,
    medical_history_available: false,
    medical_history: "",
    time_slot: ""
  });
  const [showMedicalHistoryPopup, setShowMedicalHistoryPopup] = useState(false);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const handleMedicalHistoryChange = (checked) => {
    if (checked) {
      setShowMedicalHistoryPopup(true);
    } else {
      setFormData({...formData, medical_history_available: false, medical_history: ""});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        weight: formData.weight ? `${formData.weight} ${formData.weight_unit}` : "NA"
      };
      const response = await api.post("/appointments", submitData);
      toast.success(response.data.message);
      setFormData({
        pet_name: "", pet_type: "", gender: "", age: "NA", weight: "", weight_unit: "KG",
        owner_name: "", owner_number: "", vaccination_status: false, medical_history_available: false, medical_history: "", time_slot: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to book appointment");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="appointment-page">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl font-bold text-[#111111] mb-4" data-testid="appointment-heading">Book Appointment</h1>
          <p className="text-[#6F6F6F]">Schedule a consultation for your pet</p>
        </div>

        <Card className="p-8 rounded-2xl border-[#EAEAEA]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pet_name">Pet Name *</Label>
                <Input id="pet_name" data-testid="appointment-pet-name" value={formData.pet_name} onChange={(e) => setFormData({...formData, pet_name: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="pet_type">Pet Type *</Label>
                <Input id="pet_type" data-testid="appointment-pet-type" placeholder="Dog, Cat, Cow, etc." value={formData.pet_type} onChange={(e) => setFormData({...formData, pet_type: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger data-testid="appointment-gender"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" data-testid="appointment-age" placeholder="NA" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input 
                    id="weight" 
                    data-testid="appointment-weight" 
                    placeholder="Enter weight" 
                    value={formData.weight} 
                    onChange={(e) => setFormData({...formData, weight: e.target.value})} 
                    className="rounded-lg border-[#EAEAEA] flex-1" 
                  />
                  <Select value={formData.weight_unit} onValueChange={(value) => setFormData({...formData, weight_unit: value})}>
                    <SelectTrigger data-testid="appointment-weight-unit" className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="LBS">LBS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="owner_name">Owner Name *</Label>
                <Input id="owner_name" data-testid="appointment-owner-name" value={formData.owner_name} onChange={(e) => setFormData({...formData, owner_name: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
              <div>
                <Label htmlFor="owner_number">Owner Number *</Label>
                <Input id="owner_number" data-testid="appointment-owner-number" value={formData.owner_number} onChange={(e) => setFormData({...formData, owner_number: e.target.value})} required className="rounded-lg border-[#EAEAEA]" />
              </div>
            </div>
            <div>
              <Label htmlFor="time_slot">Time Slot *</Label>
              <Select value={formData.time_slot} onValueChange={(value) => setFormData({...formData, time_slot: value})}>
                <SelectTrigger data-testid="appointment-time-slot"><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {/* Checkboxes Section */}
            <div className="space-y-4 bg-[#F5F5F5] p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="vaccination" 
                  data-testid="appointment-vaccination" 
                  checked={formData.vaccination_status} 
                  onCheckedChange={(checked) => setFormData({...formData, vaccination_status: checked})}
                />
                <Label htmlFor="vaccination" className="cursor-pointer font-medium">Pet is vaccinated</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="medical_history_available" 
                  data-testid="appointment-medical-history-checkbox" 
                  checked={formData.medical_history_available}
                  onCheckedChange={handleMedicalHistoryChange}
                />
                <Label htmlFor="medical_history_available" className="cursor-pointer font-medium">Medical history available</Label>
              </div>
            </div>

            {formData.medical_history_available && formData.medical_history && (
              <div className="bg-[#E8F5E9] p-4 rounded-xl">
                <p className="text-sm text-[#1F6559] font-medium">Medical History Added:</p>
                <p className="text-sm text-[#6F6F6F] mt-1">{formData.medical_history.substring(0, 100)}{formData.medical_history.length > 100 ? '...' : ''}</p>
              </div>
            )}

            <Button type="submit" data-testid="submit-appointment" className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#1F6559]/90 py-6 text-lg">
              Book Appointment
            </Button>
          </form>
        </Card>
      </div>

      {/* Medical History Popup */}
      <Dialog open={showMedicalHistoryPopup} onOpenChange={setShowMedicalHistoryPopup}>
        <DialogContent className="sm:max-w-lg" data-testid="medical-history-dialog">
          <DialogHeader>
            <DialogTitle className="heading-font text-xl">Add Medical History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              data-testid="medical-history-textarea"
              placeholder="Please describe your pet's medical history, including any previous conditions, surgeries, allergies, or ongoing treatments..."
              value={formData.medical_history}
              onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
              className="rounded-lg border-[#EAEAEA] min-h-[150px]"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setFormData({...formData, medical_history_available: true});
                  setShowMedicalHistoryPopup(false);
                }}
                className="flex-1 rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
                data-testid="save-medical-history"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({...formData, medical_history_available: false, medical_history: ""});
                  setShowMedicalHistoryPopup(false);
                }}
                className="flex-1 rounded-full border-[#EAEAEA]"
                data-testid="cancel-medical-history"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;