import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Zap, Crown, Shield, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { surakshaPage, surakshaPlans } from "@/assets/content/pashucare_suraksha_plan";
import UserPageShell from "@/motion/UserPageShell";
import { lucideFromMap } from "@/lib/lucideFromMap";

const planIcons = {
  message: MessageCircle,
  zap: Zap,
  crown: Crown,
};

const PashuCareSurakshaPlan = () => {
  const navigate = useNavigate();
  const page = surakshaPage;

  const handleNavigateToGopu = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("To continue with this feature please log in");
      window.dispatchEvent(new CustomEvent("openAuthModal"));
    } else {
      navigate("/gopu");
    }
  };

  return (
    <UserPageShell
      id="page-pashucare-suraksha-plan"
      className="min-h-screen bg-[#FAFAFA] py-12"
      data-testid="suraksha-plan-page"
    >
      <div id="suraksha-inner" className="max-w-6xl mx-auto px-6 relative">
        <Button
          id="suraksha-close-button"
          variant="ghost"
          size="icon"
          className="absolute right-6 top-0 text-gray-500 hover:bg-gray-200 rounded-full"
          onClick={handleNavigateToGopu}
          data-testid="close-suraksha-plan"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>

        <div id="suraksha-hero" className="text-center mb-16 space-y-4 pt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-800 font-medium">
            <Shield className="w-5 h-5" />
            <span>{page.badge}</span>
          </div>
          <h1 id="suraksha-page-title" className="heading-font text-4xl lg:text-5xl font-bold text-[#333]">
            {page.hero.line1}
            <br />
            <span className="text-[#1F6559]">{page.hero.line2}</span>
          </h1>
          <p className="text-lg text-[#6F6F6F] max-w-2xl mx-auto">
            {page.hero.descriptionBefore}
            <strong>{page.hero.descriptionEmphasis}</strong>
            {page.hero.descriptionAfter}
          </p>
        </div>

        <div id="suraksha-plans-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {surakshaPlans.map((plan) => {
            const PlanIcon = lucideFromMap(planIcons, plan.iconId);
            if (!PlanIcon) return null;
            return (
              <Card
                id={`suraksha-plan-card-${plan.id}`}
                key={plan.id}
                className={`relative p-8 rounded-2xl ${plan.color} ${plan.borderColor} border-2 space-y-6 ${plan.popular ? "ring-2 ring-yellow-400 ring-offset-2" : ""
                  }`}
                data-testid={`plan-card-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-black text-sm font-bold px-4 py-1 rounded-full flex items-center">
                      <Star className="w-4 h-4 mr-1" /> {page.popularBadge}
                    </span>
                  </div>
                )}
                <div className="text-center space-y-2">
                  <PlanIcon
                    className={`w-12 h-12 mx-auto ${plan.id === "daily"
                        ? "text-yellow-600"
                        : plan.id === "monthly"
                          ? "text-[#1F6559]"
                          : "text-gray-500"
                      }`}
                  />
                  <h3 className="heading-font text-2xl font-bold text-[#333]">{plan.name}</h3>
                  <p className="text-sm text-[#6F6F6F]">{plan.nameHindi}</p>
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold text-[#333]">{plan.price}</span>
                  <span className="text-[#6F6F6F] ml-2">{plan.period}</span>
                </div>
                <p className="text-center text-[#6F6F6F]">{plan.description}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[#333]">
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
                  onClick={() => plan.id !== "free" && handleNavigateToGopu()}
                  disabled={plan.id === "free"}
                  className={`w-full rounded-full py-6 text-lg font-semibold ${plan.buttonStyle}`}
                  data-testid={`plan-button-${plan.id}`}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            );
          })}
        </div>

        <div id="suraksha-how-it-works" className="bg-teal-50 rounded-2xl border border-[#EAEAEA] p-8 mb-16">
          <h2 id="suraksha-how-it-works-title" className="heading-font text-2xl font-bold text-[#333] text-center mb-8">
            {page.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {page.howItWorks.steps.map((step, i) => {
              const colors = [
                "bg-green-100 text-green-600",
                "bg-yellow-100 text-yellow-600",
                "bg-red-100 text-red-600",
                "bg-[#1F6559]/20 text-[#1F6559]",
              ];
              return (
                <div key={step.title} className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold text-xl ${colors[i]}`}
                  >
                    {step.n}
                  </div>
                  <h4 className="font-semibold text-[#333]">{step.title}</h4>
                  <p className="text-sm text-[#6F6F6F]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div id="suraksha-promo-cta" className="bg-gradient-to-r from-[#1F6559] to-[#2ba896] rounded-2xl p-8 text-white text-center space-y-4">
          <h3 className="heading-font text-2xl font-bold">{page.promo.quote}</h3>
          <p className="opacity-90">{page.promo.description}</p>
          <Button
            onClick={handleNavigateToGopu}
            className="rounded-full bg-teal-50 text-[#1F6559] hover:bg-teal-50/90 px-8 py-6 text-lg font-semibold"
          >
            {page.promo.cta}
          </Button>
        </div>
      </div>
    </UserPageShell>
  );
};

export default PashuCareSurakshaPlan;
