"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import VideoIntro from "@/components/VideoIntro";
import { toast } from "sonner";
import { Car, MapPin, Calendar, Clock, Phone, User, Users, X, Info, CreditCard } from "lucide-react";
import UserPageShell from "@/motion/UserPageShell";
import { brand } from "@/assets/content/shared/brand";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import PawTexture from "@/components/PawTexture";
import api from "@/utils/api";

const travelPackages = [
  { id: 1, title: "Khatu Shyam Ji Darshan", subtitle: "One day trip from Jaipur to Khatu Shyam Ji", duration: "1 day", location: "Jaipur", price: 2199, image: "/images/1.jpeg" },
  { id: 2, title: "Salasar Balaji Darshan", subtitle: "One day trip from Jaipur to Salasar Balaji", duration: "1 day", location: "Jaipur", price: 3999, image: "/images/3.jpeg" },
  { id: 3, title: "Khatu Shyam & Salasar Balaji", subtitle: "Visit two divine temples in one trip", duration: "1 day", location: "Jaipur", price: 4199, image: "/images/4.jpeg" },
  { id: 4, title: "Triple Temple Tour", subtitle: "Visit Khatu Shyam Ji, Jeen Mata & Salasar Balaji", duration: "1 day", location: "Jaipur", price: 4699, image: "/images/2.jpeg" },
  { id: 5, title: "Complete Religious Tour", subtitle: "Complete tour of all major temples", duration: "1 day", location: "Jaipur", price: 5799, image: "/images/5.jpeg" },
  { id: 6, title: "Ranthambore", subtitle: "Ranthambore Journey", duration: "1 day", location: "Jaipur", price: 4499, image: "/images/6.jpeg" },
  { id: 7, title: "Jaipur Darshan Special", subtitle: "Places Covered (Best Route - No Rush, Full Mazaa)", duration: "1 day", location: "Jaipur", price: 2999, image: "/images/7.jpeg" },
  { id: 8, title: "Udaipur", subtitle: "Udaipur Journey", duration: "1 day", location: "Jaipur", price: 8599, image: "/images/8.jpeg" },
  { id: 9, title: "Jaipur to Delhi One Way", subtitle: "Jaipur to Delhi One Way Journey", duration: "1 day", location: "Jaipur", price: 3999, image: "/images/9.jpg" },
  { id: 10, title: "Jaipur to Gurgaon One Way", subtitle: "Jaipur to Gurgaon One Way Journey", duration: "1 day", location: "Jaipur", price: 3599, image: "/images/10.jpeg" },
];

const SUGGESTED_LOCATIONS = [
  "Jaipur International Airport",
  "Jaipur Railway Station",
  "Sindhi Camp Bus Stand",
  "Mansarovar, Jaipur",
  "Vaishali Nagar, Jaipur",
  "Malviya Nagar, Jaipur",
  "Raja Park, Jaipur",
  "C-Scheme, Jaipur",
  "Jagatpura, Jaipur",
];

const INDIAN_CITIES = [
  "Delhi NCR",
  "Mumbai, Maharashtra",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Surat, Gujarat",
  "Kolkata, West Bengal",
  "Chandigarh",
  "Lucknow, Uttar Pradesh",
  "Indore, Madhya Pradesh",
  "Agra, Uttar Pradesh",
  "Udaipur, Rajasthan",
  "Jodhpur, Rajasthan"
];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate);
  }
  return dates;
};

const TIME_OPTIONS: { value: string, label: string }[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMinute = m === 0 ? '00' : '30';
    const timeValue = `${h.toString().padStart(2, '0')}:${displayMinute}`;
    const timeLabel = `${displayHour}:${displayMinute} ${period}`;
    TIME_OPTIONS.push({ value: timeValue, label: timeLabel });
  }
}

export default function TravelWithPetPage() {
  const router = useRouter();
  
  const [introComplete, setIntroComplete] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCustomFormPopup, setShowCustomFormPopup] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof travelPackages[0] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showCustomPickupSuggestions, setShowCustomPickupSuggestions] = useState(false);
  const [showCustomDropSuggestions, setShowCustomDropSuggestions] = useState(false);
  const [dates] = useState(generateDates());

  // Package Booking State
  const [packageForm, setPackageForm] = useState({
    paymentOption: "confirmation", // 'confirmation' or 'full'
    phoneNumber: "",
    passengers: 1,
    pets: 1,
    carType: "Sedan", // 'Sedan' or 'SUV'
    selectedDate: dates[0].toISOString().split('T')[0],
    selectedTime: "",
    pickupLocation: "",
  });

  // Custom Form State
  const [customFormData, setCustomFormData] = useState({
    owner_name: "",
    owner_number: "",
    pickup_location: "",
    drop_location: "",
    pickup_date: "",
    pickup_time: "",
    pet_type: "",
    pet_breed: "",
    number_of_pets: 1,
    cab_preference: "",
    emergency_contact: "",
    additional_notes: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("To continue with this feature please log in");
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openAuthModal"));
      }, 100);
    } else {
      const name = localStorage.getItem("user_name") || "";
      setCustomFormData((prev) => ({ ...prev, owner_name: name }));
    }
  }, [router]);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomFormData((prev) => ({
      ...prev,
      [name]: name === "number_of_pets" ? parseInt(value) || 1 : value,
    }));
  };

  const handleCustomSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post("/pet-cabs", customFormData);
      setShowCustomFormPopup(false);
      setShowSuccessPopup(true);
      setCustomFormData({
        owner_name: localStorage.getItem("user_name") || "",
        owner_number: "",
        pickup_location: "",
        drop_location: "",
        pickup_date: "",
        pickup_time: "",
        pet_type: "",
        pet_breed: "",
        number_of_pets: 1,
        cab_preference: "",
        emergency_contact: "",
        additional_notes: "",
      });
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { detail?: string } }; message?: string };
      const msg = err?.response?.data?.detail || err.message || "Failed to book pet cab. Please try again.";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const openPackageModal = (pkg: typeof travelPackages[0]) => {
    setSelectedPackage(pkg);
    setPackageForm(prev => ({
      ...prev,
      carType: "Sedan"
    }));
    setShowPackageModal(true);
  };

  const totalPrice = useMemo(() => {
    if (!selectedPackage) return 0;
    let total = selectedPackage.price;
    if (packageForm.carType === "SUV") {
      total += 500;
    }
    return total;
  }, [selectedPackage, packageForm.carType]);

  const handlePackageSubmit = async () => {
    if (!packageForm.phoneNumber || !packageForm.pickupLocation || !packageForm.selectedTime) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const ownerName = localStorage.getItem("user_name") || "User";
      
      const payload = {
        owner_name: ownerName,
        owner_number: packageForm.phoneNumber,
        pickup_location: packageForm.pickupLocation,
        drop_location: selectedPackage?.title || "Travel Package",
        pickup_date: packageForm.selectedDate,
        pickup_time: packageForm.selectedTime,
        pet_type: "Not Specified",
        number_of_pets: packageForm.pets,
        cab_preference: packageForm.carType,
        emergency_contact: packageForm.phoneNumber,
        additional_notes: `Package Booking. Passengers: ${packageForm.passengers}. Payment Option: ${packageForm.paymentOption === 'confirmation' ? 'Confirmation Amount (₹400)' : 'Full Amount'}. Total Price: ₹${totalPrice}.`
      };

      await api.post("/pet-cabs", payload);
      setShowPackageModal(false);
      setShowSuccessPopup(true);
      
      // Reset form
      setPackageForm({
        paymentOption: "confirmation",
        phoneNumber: "",
        passengers: 1,
        pets: 1,
        carType: "Sedan",
        selectedDate: dates[0].toISOString().split('T')[0],
        selectedTime: "",
        pickupLocation: "",
      });
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { detail?: string } }; message?: string };
      const msg = err?.response?.data?.detail || err.message || "Failed to book pet cab. Please try again.";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Video intro — shown once before the page content */}
      {!introComplete && (
        <VideoIntro onComplete={() => setIntroComplete(true)} />
      )}

      {/* Page content fades in after the intro completes */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="travel-page-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          >
    <UserPageShell id="page-pet-cabs" className="min-h-screen bg-gray-50/50 pb-24">
      <PageTitle
        id="pet-cabs-hero"
        className="relative overflow-hidden bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10 pb-16 pt-12 md:pb-20 md:pt-16"
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl md:h-96 md:w-96"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#1F6559]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm md:h-16 md:w-16">
            <Car
              className="h-7 w-7 text-white md:h-8 md:w-8"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <p className="heading-font mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
            {brand.name}
          </p>
          <h1
            id="pet-cabs-page-title"
            className="heading-font text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Travel Packages
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
            Book a comfortable, pet-friendly trip to your favorite destinations. 
            We ensure a safe and spiritual journey for you and your pets!
          </p>
        </div>
      </PageTitle>

      {/* Packages Grid */}
      <section className="relative z-10 -mt-12 px-4 md:px-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {travelPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
              <div className="h-48 overflow-hidden relative bg-[#F8FBFB]">
                {pkg.image ? (
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:bg-[#F0F7F7] transition-colors duration-500">
                    <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                      <Car size={48} className="text-[#1FA7A6]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F6559]">PashuVaani Travel</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{pkg.title}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2">{pkg.subtitle}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-[#1FA7A6]" /> {pkg.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#1FA7A6]" /> {pkg.location}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="font-bold text-[#1F6559] text-lg">₹{pkg.price.toLocaleString('en-IN')}</p>
                  </div>
                  <Button 
                    onClick={() => openPackageModal(pkg)}
                    className="bg-[#1FA7A6] hover:bg-[#1F6559] text-white rounded-lg px-6 font-semibold shadow-md"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customize FAB */}
      <button
        onClick={() => setShowCustomFormPopup(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] px-6 py-4 font-bold text-white shadow-xl shadow-[#1FA7A6]/30 transition-transform hover:scale-105 hover:shadow-2xl active:scale-95"
      >
        <Car className="h-5 w-5" />
        Customize
      </button>

      {/* Package Booking Modal */}
      <Dialog open={showPackageModal} onOpenChange={setShowPackageModal}>
        <DialogContent className="sm:max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 border-0 bg-gray-50 flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book {selectedPackage?.title}</h2>
              <p className="text-sm text-gray-500">Fill in the details to complete your booking</p>
            </div>
            <button onClick={() => setShowPackageModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Package Price</span>
                <span className="font-bold">₹{selectedPackage?.price}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-900 font-bold">Total Price</span>
                <span className="font-bold text-[#1FA7A6] text-xl">₹{totalPrice}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Select Payment Option <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setPackageForm({...packageForm, paymentOption: 'confirmation'})}
                  className={`p-3 rounded-xl border text-left transition-all ${packageForm.paymentOption === 'confirmation' ? 'border-[#1FA7A6] bg-[#1FA7A6]/5 ring-1 ring-[#1FA7A6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <p className="font-semibold text-sm text-gray-900">Pay Confirmation Amount</p>
                  <p className="text-xs text-gray-500 mt-1">₹400 to confirm booking</p>
                </button>
                <button 
                  type="button"
                  onClick={() => setPackageForm({...packageForm, paymentOption: 'full'})}
                  className={`p-3 rounded-xl border text-left transition-all ${packageForm.paymentOption === 'full' ? 'border-[#1FA7A6] bg-[#1FA7A6]/5 ring-1 ring-[#1FA7A6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <p className="font-semibold text-sm text-gray-900">Pay Full Amount</p>
                  <p className="text-xs text-gray-500 mt-1">₹{totalPrice} one-time payment</p>
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit number"
                className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 px-4 py-3 outline-none focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20 placeholder:text-gray-400"
                value={packageForm.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPackageForm({...packageForm, phoneNumber: val});
                }}
              />
            </div>

            {/* Pickup Location */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-gray-900">Pickup Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter or select pickup address"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                value={packageForm.pickupLocation}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                onChange={(e) => setPackageForm({...packageForm, pickupLocation: e.target.value})}
              />
              {showLocationSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                  {SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(packageForm.pickupLocation.toLowerCase())).map((loc, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-200 last:border-0"
                      onClick={() => {
                        setPackageForm({...packageForm, pickupLocation: loc});
                        setShowLocationSuggestions(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                  {SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(packageForm.pickupLocation.toLowerCase())).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Use &quot;{packageForm.pickupLocation}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Passengers & Pets */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Number of Passengers <span className="text-red-500">*</span></label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#1FA7A6]"
                  value={packageForm.passengers}
                  onChange={(e) => setPackageForm({...packageForm, passengers: parseInt(e.target.value)})}
                >
                  {[1, 2].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Number of Pets <span className="text-red-500">*</span></label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#1FA7A6]"
                  value={packageForm.pets}
                  onChange={(e) => setPackageForm({...packageForm, pets: parseInt(e.target.value)})}
                >
                  {[1, 2].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Pet' : 'Pets'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Car Type */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Select Car Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setPackageForm({...packageForm, carType: 'Sedan'})}
                  className={`p-3 rounded-xl border text-left transition-all ${packageForm.carType === 'Sedan' ? 'border-[#1FA7A6] bg-[#1FA7A6]/5 ring-1 ring-[#1FA7A6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <p className="font-semibold text-sm text-gray-900">Sedan</p>
                  <p className="text-xs font-medium text-gray-600 mt-0.5">+₹0</p>
                </button>
                <button 
                  type="button"
                  onClick={() => setPackageForm({...packageForm, carType: 'SUV'})}
                  className={`p-3 rounded-xl border text-left transition-all ${packageForm.carType === 'SUV' ? 'border-[#1FA7A6] bg-[#1FA7A6]/5 ring-1 ring-[#1FA7A6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <p className="font-semibold text-sm text-gray-900">SUV</p>
                  <p className="text-xs font-medium text-gray-600 mt-0.5">+₹500</p>
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-900">Select Date <span className="text-red-500">*</span></label>
                <span className="text-xs text-gray-500">Schedule Pickup</span>
              </div>
              
              {/* Date Scroll */}
              <div className="flex gap-3 overflow-x-auto pb-4 scroll-smooth hide-scrollbar">
                {dates.map((date, i) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = packageForm.selectedDate === dateStr;
                  const isToday = i === 0;
                  const isTomorrow = i === 1;
                  
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setPackageForm({...packageForm, selectedDate: dateStr})}
                      className={`min-w-[70px] shrink-0 p-2 rounded-xl border flex flex-col items-center transition-all ${isSelected ? 'border-[#1FA7A6] bg-[#1FA7A6]/5 ring-1 ring-[#1FA7A6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <span className={`text-xs font-medium ${isSelected ? 'text-[#1FA7A6]' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-lg font-bold my-0.5 ${isSelected ? 'text-[#1FA7A6]' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-[#1FA7A6]' : 'text-gray-400'}`}>
                        {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Selected Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Select 
                    value={packageForm.selectedTime}
                    onValueChange={(val) => setPackageForm({...packageForm, selectedTime: val})}
                  >
                    <SelectTrigger className="w-full h-auto rounded-xl border border-gray-200 bg-white px-4 py-3 pl-12 outline-none focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20 text-lg shadow-none">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 z-[100]">
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem 
                          key={time.value} 
                          value={time.value} 
                          className="focus:bg-[#1FA7A6]/10 focus:text-[#1F6559] text-gray-900 rounded-lg cursor-pointer py-3 transition-colors"
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 sticky bottom-0 bg-gray-50 border-t pb-2">
              <Button 
                onClick={handlePackageSubmit}
                disabled={submitting}
                className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl text-lg font-bold shadow-lg"
              >
                {submitting ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Form Modal (The original form) */}
      <Dialog open={showCustomFormPopup} onOpenChange={setShowCustomFormPopup}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 border-0 flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-900">Custom Pet Cab Booking</DialogTitle>
            <button onClick={() => setShowCustomFormPopup(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleCustomSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* User Details */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-[#1FA7A6]" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="owner_name"
                    value={customFormData.owner_name}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-[#1FA7A6]" /> Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    name="owner_number"
                    value={customFormData.owner_number}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                    placeholder="10-digit number"
                  />
                </div>

                {/* Location Details */}
                <div className="space-y-2 md:col-span-2 relative">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-[#1FA7A6]" /> Pickup Location
                  </label>
                  <input
                    required
                    type="text"
                    name="pickup_location"
                    value={customFormData.pickup_location}
                    onFocus={() => setShowCustomPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCustomPickupSuggestions(false), 200)}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                    placeholder="Enter pickup address"
                  />
                  {showCustomPickupSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                      {SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(customFormData.pickup_location.toLowerCase())).map((loc, idx) => (
                        <div 
                          key={idx}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-200 last:border-0"
                          onClick={() => {
                            setCustomFormData({...customFormData, pickup_location: loc});
                            setShowCustomPickupSuggestions(false);
                          }}
                        >
                          {loc}
                        </div>
                      ))}
                      {SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(customFormData.pickup_location.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Use &quot;{customFormData.pickup_location}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2 relative">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-[#1FA7A6]" /> Drop Location
                  </label>
                  <input
                    required
                    type="text"
                    name="drop_location"
                    value={customFormData.drop_location}
                    onFocus={() => setShowCustomDropSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCustomDropSuggestions(false), 200)}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                    placeholder="Enter drop address"
                  />
                  {showCustomDropSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                      {SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(customFormData.drop_location.toLowerCase())).map((loc, idx) => (
                        <div 
                          key={idx}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-200 last:border-0"
                          onClick={() => {
                            setCustomFormData({...customFormData, drop_location: loc});
                            setShowCustomDropSuggestions(false);
                          }}
                        >
                          {loc}
                        </div>
                      ))}
                      {SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(customFormData.drop_location.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Use &quot;{customFormData.drop_location}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar size={16} className="text-[#1FA7A6]" /> Pickup Date
                  </label>
                  <input
                    required
                    type="date"
                    name="pickup_date"
                    value={customFormData.pickup_date}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-[#1FA7A6]" /> Pickup Time
                  </label>
                  <Select
                    value={customFormData.pickup_time}
                    onValueChange={(val) => setCustomFormData({...customFormData, pickup_time: val})}
                  >
                    <SelectTrigger className="w-full h-auto rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20 shadow-none">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 z-[100]">
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem 
                          key={time.value} 
                          value={time.value} 
                          className="focus:bg-[#1FA7A6]/10 focus:text-[#1F6559] text-gray-900 rounded-lg cursor-pointer py-3 transition-colors"
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pet Details */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Pet Type
                  </label>
                  <select
                    required
                    name="pet_type"
                    value={customFormData.pet_type}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                  >
                    <option value="">Select Pet Type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Pet Breed (Optional)
                  </label>
                  <input
                    type="text"
                    name="pet_breed"
                    value={customFormData.pet_breed}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                    placeholder="e.g. Golden Retriever"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={16} className="text-[#1FA7A6]" /> Number of Pets
                  </label>
                  <input
                    required
                    type="number"
                    name="number_of_pets"
                    min="1"
                    max="10"
                    value={customFormData.number_of_pets}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Cab Preference (Optional)
                  </label>
                  <select
                    name="cab_preference"
                    value={customFormData.cab_preference}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                  >
                    <option value="">Select Preference</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>

                {/* Emergency Contact & Notes */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-red-500" /> Emergency Contact
                  </label>
                  <input
                    required
                    type="tel"
                    name="emergency_contact"
                    value={customFormData.emergency_contact}
                    onChange={handleCustomChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20"
                    placeholder="Alternative number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Additional Notes/Instructions (Optional)
                  </label>
                  <textarea
                    name="additional_notes"
                    value={customFormData.additional_notes}
                    onChange={handleCustomChange}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/20 resize-none"
                    placeholder="Any specific instructions for the driver..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-8">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] text-lg font-bold shadow-xl shadow-[#1FA7A6]/20 transition-all hover:scale-[1.02] hover:shadow-2xl"
                >
                  {submitting ? "Booking..." : "Book Custom Pet Cab"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={showSuccessPopup}
        onOpenChange={(open) => !open && setShowSuccessPopup(false)}
      >
        <DialogContent
          id="pet-cab-success-dialog"
          className="border-[#C7D3CC]/80 bg-white sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="heading-font text-xl text-[#1F6559] md:text-2xl">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-base text-[#6F6F6F]">
              Your pet cab request has been received. Our team will review your booking and assign a driver shortly. You can track your booking status from your profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={() => {
                setShowSuccessPopup(false);
                router.push("/tracking/pet-cabs");
              }}
              className="w-full bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] text-white shadow-md hover:opacity-95 sm:w-auto sm:min-w-[120px]"
            >
              Track Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserPageShell>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

