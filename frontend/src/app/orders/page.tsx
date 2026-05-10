"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Truck, 
  ChevronRight, 
  Search,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import { motion } from "framer-motion";
import UserPageShell from "@/motion/UserPageShell";
import PageTitle from "@/components/PageTitle";
import PawTexture from "@/components/PawTexture";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserPageShell id="page-orders" className="min-h-screen bg-white">
      <PageTitle 
        id="orders-hero"
        className="bg-gradient-to-br from-[#1F6559] to-[#38C2B4] pb-24 pt-16 text-white"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Your Orders</h1>
          <p className="mt-4 text-lg text-white/80">Manage and track your marketplace purchases.</p>
        </div>
      </PageTitle>

      <section className="relative z-10 -mt-16 px-4 pb-20 sm:px-6">
        <PawTexture />
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-12 shadow-xl shadow-[#1F6559]/5 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-200">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Your shopping bag is empty</h3>
            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Browse our marketplace for high-quality pet food, accessories, and healthcare products.
            </p>
            <Button 
              onClick={() => router.push("/marketplace")}
              className="mt-10 rounded-2xl bg-[#1F6559] px-10 py-7 text-lg font-bold shadow-xl shadow-[#1F6559]/20 hover:bg-[#184F46]"
            >
              Explore Marketplace
            </Button>
          </div>
        </div>
      </section>
    </UserPageShell>
  );
}
