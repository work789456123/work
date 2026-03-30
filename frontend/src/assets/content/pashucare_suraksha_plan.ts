/** Route: /pashucare-suraksha-plan — plan rows use iconId mapped in page */
export const surakshaPage = {
  badge: "PashuCare Suraksha Plan",
  hero: {
    line1: "Protect Your Pashu with",
    line2: "Unlimited AI Care",
    descriptionBefore: "Because ",
    descriptionEmphasis: "Pashu Bhi Pariwar Hai",
    descriptionAfter:
      ". Get instant veterinary guidance anytime, anywhere. Choose a plan that fits your needs.",
  },
  popularBadge: "MOST POPULAR",
  howItWorks: {
    title: "How Credit System Works",
    steps: [
      {
        n: "1",
        title: "Start Free",
        desc: "Get 10 free messages every day to try Gopu.AI",
      },
      {
        n: "2",
        title: "Get Warnings",
        desc: "At 8 & 9 messages, you'll see remaining count",
      },
      {
        n: "3",
        title: "Limit Reached",
        desc: "After 10 messages, purchase credits to continue",
      },
      {
        n: "4",
        title: "Unlimited Care",
        desc: "Buy a plan and get unlimited guidance",
      },
    ],
  },
  promo: {
    quote: "Aaj ka free limit khatam. ₹10 me full din puch sakte ho.",
    description:
      "This is what you'll see when your daily free limit is used. Just ₹10 gives you 24 hours of unlimited guidance!",
    cta: "Try Gopu.AI Now",
  },
};

export const surakshaPlans = [
  {
    id: "free",
    iconId: "message",
    name: "Free Plan",
    nameHindi: "मुफ्त प्लान",
    price: "₹0",
    period: "per day",
    description: "Start your journey with Gopu.AI",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    features: [
      "10 questions per day",
      "Basic health guidance",
      "Text-only consultation",
      "Standard response time",
    ],
    limitations: ["No image upload", "No priority support"],
    buttonText: "Current Plan",
    buttonStyle: "bg-gray-400 text-gray-600 cursor-not-allowed",
    popular: false,
  },
  {
    id: "daily",
    iconId: "zap",
    name: "Daily Farmer Pass",
    nameHindi: "दैनिक किसान पास",
    price: "₹10",
    period: "for 24 hours",
    description: "Perfect for daily animal care needs",
    color: "bg-yellow-50",
    borderColor: "border-yellow-400",
    features: [
      "25 questions in 24 hours",
      "2 image uploads included",
      "Detailed health analysis",
      "Priority response",
    ],
    limitations: [],
    buttonText: "Buy Now - ₹10",
    buttonStyle: "bg-yellow-500 hover:bg-yellow-600 text-black",
    popular: true,
  },
  {
    id: "monthly",
    iconId: "crown",
    name: "Monthly Smart Plan",
    nameHindi: "मासिक स्मार्ट प्लान",
    price: "₹199",
    period: "for 30 days",
    description: "Best value for regular users",
    color: "bg-[#1F6559]/5",
    borderColor: "border-[#1F6559]",
    features: [
      "300 questions in 30 days",
      "20 image uploads included",
      "Priority reply always",
      "Detailed health reports",
      "Emergency guidance priority",
    ],
    limitations: [],
    buttonText: "Buy Now - ₹199",
    buttonStyle: "bg-[#1F6559] hover:bg-[#184F46] text-white",
    popular: false,
  },
];
