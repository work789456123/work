import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Zap, Crown, Shield, MessageCircle, Image } from "lucide-react";

const PashuCareSurakshaPlan = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      nameHindi: "मुफ्त प्लान",
      price: "₹0",
      period: "per day",
      description: "Start your journey with Gopu.AI",
      icon: MessageCircle,
      color: "bg-gray-100",
      borderColor: "border-gray-300",
      features: [
        "10 questions per day",
        "Basic health guidance",
        "Text-only consultation",
        "Standard response time"
      ],
      limitations: [
        "No image upload",
        "No priority support"
      ],
      buttonText: "Current Plan",
      buttonStyle: "bg-gray-400 cursor-not-allowed",
      popular: false
    },
    {
      id: "daily",
      name: "Daily Farmer Pass",
      nameHindi: "दैनिक किसान पास",
      price: "₹10",
      period: "for 24 hours",
      description: "Perfect for daily animal care needs",
      icon: Zap,
      color: "bg-yellow-50",
      borderColor: "border-yellow-400",
      features: [
        "25 questions in 24 hours",
        "2 image uploads included",
        "Detailed health analysis",
        "Priority response"
      ],
      limitations: [],
      buttonText: "Buy Now - ₹10",
      buttonStyle: "bg-yellow-500 hover:bg-yellow-600 text-black",
      popular: true
    },
    {
      id: "monthly",
      name: "Monthly Smart Plan",
      nameHindi: "मासिक स्मार्ट प्लान",
      price: "₹99",
      period: "for 30 days",
      description: "Best value for regular users",
      icon: Crown,
      color: "bg-[#1F6559]/5",
      borderColor: "border-[#1F6559]",
      features: [
        "300 questions in 30 days",
        "20 image uploads included",
        "Priority reply always",
        "Detailed health reports",
        "Emergency guidance priority"
      ],
      limitations: [],
      buttonText: "Buy Now - ₹99",
      buttonStyle: "bg-[#1F6559] hover:bg-[#184F46] text-white",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="suraksha-plan-page">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-800 font-medium">
            <Shield className="w-5 h-5" />
            <span>PashuCare Suraksha Plan</span>
          </div>
          <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111]">
            Protect Your Pashu with
            <br />
            <span className="text-[#1F6559]">Unlimited AI Care</span>
          </h1>
          <p className="text-lg text-[#6F6F6F] max-w-2xl mx-auto">
            Because <strong>Pashu Bhi Pariwar Hai</strong>. Get instant veterinary guidance anytime, anywhere. 
            Choose a plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 rounded-2xl ${plan.color} ${plan.borderColor} border-2 space-y-6 ${
                plan.popular ? "ring-2 ring-yellow-400 ring-offset-2" : ""
              }`}
              data-testid={`plan-card-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-black text-sm font-bold px-4 py-1 rounded-full flex items-center">
                    <Star className="w-4 h-4 mr-1" /> MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center space-y-2">
                <plan.icon className={`w-12 h-12 mx-auto ${plan.id === 'daily' ? 'text-yellow-600' : plan.id === 'monthly' ? 'text-[#1F6559]' : 'text-gray-500'}`} />
                <h3 className="heading-font text-2xl font-bold text-[#111111]">{plan.name}</h3>
                <p className="text-sm text-[#6F6F6F]">{plan.nameHindi}</p>
              </div>

              <div className="text-center">
                <span className="text-5xl font-bold text-[#111111]">{plan.price}</span>
                <span className="text-[#6F6F6F] ml-2">{plan.period}</span>
              </div>

              <p className="text-center text-[#6F6F6F]">{plan.description}</p>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[#111111]">
                    <Check className="w-5 h-5 text-[#1F6559] mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation, idx) => (
                  <li key={idx} className="flex items-center text-[#9F9F9F]">
                    <span className="w-5 h-5 mr-3 flex-shrink-0 text-center">✕</span>
                    {limitation}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => plan.id !== 'free' && navigate('/gopu')}
                disabled={plan.id === 'free'}
                className={`w-full rounded-full py-6 text-lg font-semibold ${plan.buttonStyle}`}
                data-testid={`plan-button-${plan.id}`}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 mb-16">
          <h2 className="heading-font text-2xl font-bold text-[#111111] text-center mb-8">
            How Credit System Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 font-bold text-xl">1</div>
              <h4 className="font-semibold text-[#111111]">Start Free</h4>
              <p className="text-sm text-[#6F6F6F]">Get 10 free messages every day to try Gopu.AI</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 font-bold text-xl">2</div>
              <h4 className="font-semibold text-[#111111]">Get Warnings</h4>
              <p className="text-sm text-[#6F6F6F]">At 8 & 9 messages, you'll see remaining count</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 font-bold text-xl">3</div>
              <h4 className="font-semibold text-[#111111]">Limit Reached</h4>
              <p className="text-sm text-[#6F6F6F]">After 10 messages, purchase credits to continue</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#1F6559]/20 rounded-full flex items-center justify-center mx-auto text-[#1F6559] font-bold text-xl">4</div>
              <h4 className="font-semibold text-[#111111]">Unlimited Care</h4>
              <p className="text-sm text-[#6F6F6F]">Buy a plan and get unlimited guidance</p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        <div className="bg-gradient-to-r from-[#1F6559] to-[#2ba896] rounded-2xl p-8 text-white text-center space-y-4">
          <h3 className="heading-font text-2xl font-bold">
            "Aaj ka free limit khatam. ₹10 me full din puch sakte ho."
          </h3>
          <p className="opacity-90">
            This is what you'll see when your daily free limit is used. Just ₹10 gives you 24 hours of unlimited guidance!
          </p>
          <Button
            onClick={() => navigate('/gopu')}
            className="rounded-full bg-white text-[#1F6559] hover:bg-white/90 px-8 py-6 text-lg font-semibold"
          >
            Try Gopu.AI Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PashuCareSurakshaPlan;
