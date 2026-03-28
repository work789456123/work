import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openPromoModal', handleOpen);
    return () => window.removeEventListener('openPromoModal', handleOpen);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md text-center p-6 border-0 rounded-[28px] overflow-hidden">
        {/* Background gradient decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] opacity-20 -z-10 blur-xl"></div>
        
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-[#1FA7A6]/10 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[#1FA7A6]" fill="currentColor" />
          </div>
          <DialogTitle className="text-2xl font-bold text-[#333] mb-2 font-['Outfit',sans-serif]">
            Protect Your Pet's Future
          </DialogTitle>
          <DialogDescription className="text-base text-[#6F6F6F] leading-relaxed">
            Discover our <span className="font-semibold text-[#1F6559]">PashuCare Suraksha Plan</span> for comprehensive protection and intelligent care.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-6">
          <div className="bg-[#1F6559]/5 rounded-2xl p-4 border border-[#1F6559]/10 text-left">
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-[#333]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Unlimited Gopu.AI Health Consultations</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[#333]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Priority Emergency Support</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[#333]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Comprehensive Health Records</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-3 mt-4">
            <Button 
              onClick={() => {
                setIsOpen(false);
                navigate('/pashucare-suraksha-plan');
              }}
              className="w-full rounded-full bg-amber-500 text-black hover:bg-amber-400 font-semibold py-6 text-lg transition-transform hover:scale-[1.02]"
            >
              View Suraksha Plan
            </Button>
            <Button 
              onClick={() => {
                setIsOpen(false);
                navigate('/gopu');
              }}
              variant="outline"
              className="w-full rounded-full border-[#1FA7A6] text-[#1FA7A6] hover:bg-[#1FA7A6]/5 font-semibold py-6 text-lg transition-colors"
            >
              Continue to Gopu.AI
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoModal;
