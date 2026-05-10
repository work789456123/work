import type { GopuChatMessage } from "@/types/gopu";

/** The welcome message shown when a new or empty session opens. */
export const DEFAULT_MESSAGE: GopuChatMessage = {
  role: "assistant",
  content:
    "Hi, I am Gopu, your Animal Health Chatbot. How can I assist you today?",
  isWelcome: true,
};

export type FAQ = {
  /** Short question label shown on the chip */
  question: string;
  /** Pre-written instant answer — shown without an API call for sub-second response */
  answer: string;
  /** Emoji icon displayed on the chip */
  emoji: string;
};

export const FAQ_LIST: FAQ[] = [
  {
    question: "Is your pet vomiting?",
    emoji: "🤢",
    answer:
      "Vomiting can range from harmless (eating too fast, grass) to serious. For a single episode in an otherwise alert pet:\n\n1. **Withhold food** for 4–6 hours but keep fresh water available.\n2. After the break, offer a small bland meal — boiled rice with plain chicken works well.\n3. Watch for **red flags**: blood in vomit, vomiting 3+ times, bloated belly, lethargy, or signs of pain. Any of these need same-day vet care.\n\nIf your pet vomits more than twice in 24 hours, or is a puppy or kitten, please see a vet promptly.",
  },
  {
    question: "Is your pet not eating or drinking?",
    emoji: "🍽️",
    answer:
      "Loss of appetite or refusal to drink is always worth taking seriously.\n\n**Not eating:**\n- A single skipped meal in an adult dog or cat can be normal if they seem alert and energetic.\n- Over 24 hours without eating (12 hours for puppies/kittens) warrants a vet visit.\n\n**Not drinking (more urgent):**\n- Dehydration sets in quickly. Pinch the skin on the back of the neck gently — if it stays 'tented' instead of snapping back, your pet may be dehydrated.\n- Try offering cool fresh water or a small amount of low-sodium broth.\n\nIf your pet hasn't eaten or drunk anything in over 24 hours, or seems lethargic or in pain, please contact a veterinarian today.",
  },
  {
    question: "Would you like to book an appointment?",
    emoji: "📅",
    answer:
      "Here's how to connect with a veterinarian through PashuVaani:\n\n1. **In-person consultation** — Use the Appointments section of the app to find and book a vet near you.\n2. **Tele-consultation** — Great for follow-ups, diet advice, and non-emergency concerns. Book the same way.\n3. **Medical emergency** — Use the **'Raise a Medical Complaint'** button in the sidebar (bottom-left) and our team will contact you promptly.\n\nFor life-threatening emergencies, go directly to the nearest veterinary clinic without delay.",
  },
  {
    question: "What should I feed my pet daily?",
    emoji: "🥗",
    answer:
      "A balanced daily diet depends on the species, age, and size of your pet.\n\n**Dogs & Cats:**\n- High-quality commercial kibble with real protein (chicken, fish, or lamb) listed as the first ingredient.\n- Feed 2–3 times a day for adults; puppies and kittens need 3–4 smaller meals.\n- Always keep fresh water available.\n- **Never give**: onions, garlic, grapes, raisins, chocolate, or xylitol — all are toxic to pets.\n\n**Cattle, Goats & Sheep:**\n- Good-quality hay or silage forms the base; supplement with a balanced mineral mix.\n- Transition feed changes gradually over 7–10 days to prevent bloat or acidosis.\n\nTell me your pet's species, breed, age, and weight for more personalised guidance.",
  },
  {
    question: "How do I deworm my pet?",
    emoji: "💊",
    answer:
      "Deworming is one of the most important routine care steps.\n\n**Dogs & Cats:**\n- Puppies and kittens: every 2 weeks from age 2–8 weeks, then monthly until 6 months.\n- Adults: every 3 months (4 times a year).\n\n**Cattle, Goats & Sheep:**\n- Every 3–6 months, or guided by a fecal egg count test.\n- Rotate drug classes to prevent resistance.\n\nCommon dewormers include Albendazole, Fenbendazole, Ivermectin, and Pyrantel. The right choice depends on the parasite type and your pet's weight. Always weigh your pet before dosing — underdosing won't clear the worms. Exact dose and route must be confirmed by a licensed veterinarian.",
  },
  {
    question: "My pet has a fever — what do I do?",
    emoji: "🌡️",
    answer:
      "Normal temperature for dogs and cats is **38–39.2°C (100.4–102.5°F)**. Signs of fever include warm/dry nose, hot ears, lethargy, shivering, and reduced appetite.\n\n**What to do right now:**\n1. Confirm with a rectal thermometer if possible.\n2. Move your pet to a cool, shaded area and offer fresh water.\n3. Place a damp (not ice-cold) cloth on their paws and belly.\n4. **Do NOT give paracetamol, ibuprofen, or aspirin** — these are toxic to dogs and cats.\n\n**See a vet urgently if:**\n- Temperature is above 40°C (104°F).\n- The fever has lasted more than 24 hours.\n- Your pet is not drinking, is very lethargic, or has other symptoms like vomiting or difficulty breathing.",
  },
];
