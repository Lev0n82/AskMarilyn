import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type GuestId = "elon" | "bill" | "roger" | "stan" | "laura" | "george" | "ryerson";

interface GuestConfig {
  name: string;
  title: string;
  image: string;
  quote: string;
  theme: string;
}

const GUESTS: Record<GuestId, GuestConfig> = {
  elon: {
    name: "Elon Musk",
    title: "Technoking",
    image: "/images/guests/elon.png",
    quote: "First principles thinking would suggest this answer is obvious.",
    theme: "border-blue-500 bg-slate-900 text-blue-100",
  },
  bill: {
    name: "Bill Gates",
    title: "Founder",
    image: "/images/guests/bill.png",
    quote: "I didn't get rich by writing bad code. Or did I?",
    theme: "border-green-500 bg-emerald-900 text-green-100",
  },
  roger: {
    name: "Roger",
    title: "The Alien",
    image: "/images/guests/roger.png",
    quote: "Do you have any pecan sandies? Also, that answer is wrong.",
    theme: "border-gray-400 bg-gray-800 text-gray-200",
  },
  stan: {
    name: "Stan Smith",
    title: "CIA",
    image: "/images/guests/stan.png",
    quote: "This test is a threat to national security.",
    theme: "border-red-600 bg-red-950 text-red-100",
  },
  laura: {
    name: "Laura Secord",
    title: "Canadian Hero",
    image: "/images/guests/laura.png",
    quote: "I walked 20 miles to warn you about that syntax error.",
    theme: "border-amber-600 bg-amber-950 text-amber-100",
  },
  george: {
    name: "George Brown",
    title: "Father of Confederation",
    image: "/images/guests/george.png",
    quote: "The Globe demands the truth! And better variable names.",
    theme: "border-sepia-600 bg-stone-900 text-stone-200",
  },
  ryerson: {
    name: "Egerton Ryerson",
    title: "Educator",
    image: "/images/guests/ryerson.png",
    quote: "Education is the foundation of the state. And this code is shaky.",
    theme: "border-indigo-600 bg-indigo-950 text-indigo-100",
  },
};

interface SpecialGuestProps {
  trigger: boolean;
  onDismiss: () => void;
}

export function SpecialGuest({ trigger, onDismiss }: SpecialGuestProps) {
  const [currentGuest, setCurrentGuest] = useState<GuestId | null>(null);

  useEffect(() => {
    if (trigger) {
      const guestKeys = Object.keys(GUESTS) as GuestId[];
      const randomGuest = guestKeys[Math.floor(Math.random() * guestKeys.length)];
      setCurrentGuest(randomGuest);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setCurrentGuest(null);
        onDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onDismiss]);

  if (!currentGuest) return null;

  const guest = GUESTS[currentGuest];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="fixed bottom-8 right-8 z-50 max-w-sm"
      >
        <Card className={cn("border-4 shadow-2xl overflow-hidden", guest.theme)}>
          <CardContent className="p-0 flex items-center">
            <div className="w-24 h-24 bg-black/20 flex-shrink-0">
              {/* Placeholder for actual image */}
              <div className="w-full h-full flex items-center justify-center text-4xl">
                👤
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg leading-none mb-1">{guest.name}</h4>
              <p className="text-xs opacity-70 mb-2 uppercase tracking-wider">{guest.title}</p>
              <p className="italic text-sm leading-snug">"{guest.quote}"</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
