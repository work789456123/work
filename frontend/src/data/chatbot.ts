import type { GopuChatMessage } from "@/types/gopu";

export type GopuUiLanguage = "English" | "Hindi";

export function normalizeGopuLanguage(lang: string | undefined | null): GopuUiLanguage {
	if (lang && lang.trim().toLowerCase() === "english") return "English";
	return "Hindi";
}

/** Client-only; safe for use inside useEffect after mount. */
export function getStoredGopuLanguage(): GopuUiLanguage {
	if (typeof window === "undefined") return "Hindi";
	try {
		const s = localStorage.getItem("gopuChatLanguage");
		if (s === "English" || s === "Hindi") return s;
	} catch {
		/* private mode */
	}
	return "Hindi";
}

export function getDefaultWelcomeMessage(lang: GopuUiLanguage): GopuChatMessage {
	if (lang === "English") {
		return {
			role: "assistant",
			content:
				"Hi, I am Gopu, your Animal Health Chatbot. How can I assist you today?",
			isWelcome: true,
		};
	}
	return {
		role: "assistant",
		content:
			"नमस्ते, मैं गोपु हूँ — आपका पशु स्वास्थ्य सहायक। आज मैं आपकी कैसे मदद कर सकता हूँ?",
		isWelcome: true,
	};
}

/** English welcome; prefer `getDefaultWelcomeMessage(lang)` for UI parity with language toggle. */
export const DEFAULT_MESSAGE: GopuChatMessage = getDefaultWelcomeMessage("English");

export type FAQ = {
	question: string;
	answer: string;
	questionHi: string;
	answerHi: string;
	emoji: string;
};

export function faqChipLabel(faq: FAQ, lang: GopuUiLanguage): string {
	return lang === "Hindi" ? faq.questionHi : faq.question;
}

export function faqAnswerForLanguage(faq: FAQ, lang: GopuUiLanguage): string {
	return lang === "Hindi" ? faq.answerHi : faq.answer;
}

export const FAQ_LIST: FAQ[] = [
	{
		question: "Is your pet vomiting?",
		questionHi: "क्या आपके पालतू जानवर को उल्टी हो रही है?",
		emoji: "🤢",
		answer:
			"Vomiting can range from harmless (eating too fast, grass) to serious. For a single episode in an otherwise alert pet:\n\n1. **Withhold food** for 4–6 hours but keep fresh water available.\n2. After the break, offer a small bland meal — boiled rice with plain chicken works well.\n3. Watch for **red flags**: blood in vomit, vomiting 3+ times, bloated belly, lethargy, or signs of pain. Any of these need same-day vet care.\n\nIf your pet vomits more than twice in 24 hours, or is a puppy or kitten, please see a vet promptly.",
		answerHi:
			"उल्टी हल्की (ज़्यादा खाने, घास खाने) से लेकर गंभीर तक हो सकती है। अगर पालतू सतर्क है और एक बार उल्टी हुई हो:\n\n1. **4–6 घंटे भोजन बंद** रखें, साफ पानी देते रहें।\n2. उसके बाद थोड़ा हल्का भोजन — उबला चावल और बिना मसाले का चिकन।\n3. **खतरे के संकेत**: खून, दिन में 3+ बार उल्टी, पेट फूलना, सुस्ती या दर्द। इनमें से कोई भी हो तो उसी दिन पशु चिकित्सक से मिलें।\n\n24 घंटे में दो से ज़्यादा बार उल्टी, या छोटे बच्चे (पपी/किटन) हों तो जल्दी डॉक्टर दिखाएँ।",
	},
	{
		question: "Is your pet not eating or drinking?",
		questionHi: "क्या आपका पालतू खा या पी नहीं रहा?",
		emoji: "🍽️",
		answer:
			"Loss of appetite or refusal to drink is always worth taking seriously.\n\n**Not eating:**\n- A single skipped meal in an adult dog or cat can be normal if they seem alert and energetic.\n- Over 24 hours without eating (12 hours for puppies/kittens) warrants a vet visit.\n\n**Not drinking (more urgent):**\n- Dehydration sets in quickly. Pinch the skin on the back of the neck gently — if it stays 'tented' instead of snapping back, your pet may be dehydrated.\n- Try offering cool fresh water or a small amount of low-sodium broth.\n\nIf your pet hasn't eaten or drunk anything in over 24 hours, or seems lethargic or in pain, please contact a veterinarian today.",
		answerHi:
			"भूख न लगना या पानी न पीना गंभीरता से लेना चाहिए।\n\n**खाना न खाना:**\n- वयस्क कुत्ते/बिल्ली में एक बार भोजन छूटना कभी-कभी सामान्य हो सकता है अगर वे सतर्क हों।\n- 24 घंटे से ज़्यादा भोजन न करे (पपी/किटन में 12 घंटे) तो पशु चिकित्सक दिखाएँ।\n\n**पानी न पीना (ज़्यादा ज़रूरी):**\n- निर्जलीकरण जल्दी होता है। गर्दन की त्वचा हल्के से चिकोटें — अगर त्वचा 'खड़ी' रह जाए तो निर्जलीकरण संभव है।\n- ठंडा पानी या थोड़ा कम-नमक वाला शोरबा दें।\n\n24 घंटे से ज़्यादा न खाया-पिया हो, या सुस्ती/दर्द हो तो आज ही वेट से संपर्क करें।",
	},
	{
		question: "Would you like to book an appointment?",
		questionHi: "क्या आप अपॉइंटमेंट बुक करना चाहेंगे?",
		emoji: "📅",
		answer:
			"Here's how to connect with a veterinarian through PashuVaani:\n\n1. **In-person consultation** — Use the Appointments section of the app to find and book a vet near you.\n2. **Tele-consultation** — Great for follow-ups, diet advice, and non-emergency concerns. Book the same way.\n3. **Medical emergency** — Use the **'Raise a Medical Complaint'** button in the sidebar (bottom-left) and our team will contact you promptly.\n\nFor life-threatening emergencies, go directly to the nearest veterinary clinic without delay.",
		answerHi:
			"पाशुवाणी से वेट से जुड़ने के तरीके:\n\n1. **क्लिनिक पर मुलाकात** — ऐप में **Appointments** से पास के वेट को बुक करें।\n2. **टेली-कंसल्ट** — फॉलो-अप, आहार की सलाह, गैर-आपातकालीन समस्याओं के लिए उपयुक्त; वहीं से बुक करें।\n3. **चिकित्सा आपातकाल** — साइडबार में नीचे **'Raise a Medical Complaint'** दबाएँ; हमारी टीम जल्द संपर्क करेगी।\n\nजानलेवा आपात स्थिति में बिना देरी नज़दीकी पशु चिकित्सा केंद्र जाएँ।",
	},
	{
		question: "What should I feed my pet daily?",
		questionHi: "रोज़ाना अपने पालतू को क्या खिलाना चाहिए?",
		emoji: "🥗",
		answer:
			"A balanced daily diet depends on the species, age, and size of your pet.\n\n**Dogs & Cats:**\n- High-quality commercial kibble with real protein (chicken, fish, or lamb) listed as the first ingredient.\n- Feed 2–3 times a day for adults; puppies and kittens need 3–4 smaller meals.\n- Always keep fresh water available.\n- **Never give**: onions, garlic, grapes, raisins, chocolate, or xylitol — all are toxic to pets.\n\n**Cattle, Goats & Sheep:**\n- Good-quality hay or silage forms the base; supplement with a balanced mineral mix.\n- Transition feed changes gradually over 7–10 days to prevent bloat or acidosis.\n\nTell me your pet's species, breed, age, and weight for more personalised guidance.",
		answerHi:
			"संतुलित दैनिक आहार प्रजाति, उम्र और वजन पर निर्भर करता है।\n\n**कुत्ते और बिल्लियाँ:**\n- अच्छी क्वालिटी का ड्राई फ़ूड जिसमें पहली सामग्री असली प्रोटीन (चिकन, मछली, मेमना) हो।\n- वयस्कों को दिन में 2–3 बार; पपी/किटन को 3–4 छोटे भोजन।\n- साफ पानी हमेशा उपलब्ध रखें।\n- **कभी न दें**: प्याज, लहसुन, अंगूर, किशमिश, चॉकलेट, ज़ाइलिटॉल — ये विषैले हैं।\n\n**गाय, बकरी, भेड़:**\n- अच्छी घास या साइलेज आधार; संतुलित खनिज मिश्रण।\n- आहार बदलाव 7–10 दिन में धीरे-धीरे करें ताकि गैस/एसिडोसिस न हो।\n\nअपनी प्रजाति, नस्ल, उम्र और वजन बताएँ तो और व्यक्तिगत सलाह दे सकता हूँ।",
	},
	{
		question: "How do I deworm my pet?",
		questionHi: "कृमि मुक्ति (डिवर्मिंग) कैसे करूँ?",
		emoji: "💊",
		answer:
			"Deworming is one of the most important routine care steps.\n\n**Dogs & Cats:**\n- Puppies and kittens: every 2 weeks from age 2–8 weeks, then monthly until 6 months.\n- Adults: every 3 months (4 times a year).\n\n**Cattle, Goats & Sheep:**\n- Every 3–6 months, or guided by a fecal egg count test.\n- Rotate drug classes to prevent resistance.\n\nCommon dewormers include Albendazole, Fenbendazole, Ivermectin, and Pyrantel. The right choice depends on the parasite type and your pet's weight. Always weigh your pet before dosing — underdosing won't clear the worms. Exact dose and route must be confirmed by a licensed veterinarian.",
		answerHi:
			"कृमि मुक्ति नियमित देखभाल का अहम हिस्सा है।\n\n**कुत्ते और बिल्लियाँ:**\n- पपी/किटन: 2–8 सप्ताह की उम्र से हर 2 सप्ताह, फिर 6 महीने तक मासिक।\n- वयस्क: हर 3 महीने (साल में 4 बार)।\n\n**गाय, बकरी, भेड़:**\n- हर 3–6 महीने, या मल परीक्षण के अनुसार।\n- प्रतिरोध रोकने के लिए दवा वर्ग बदलते रहें।\n\nआम दवाएँ: एल्बेंडाज़ोल, फेनबेंडाज़ोल, आइवर्मेक्टिन, पाइरेंटेल। सही विकल्प परजीवी प्रकार और वजन पर निर्भर करता है। खुराक से पहले वजन ज़रूर लें — कम खुराक से कीड़े नहीं जाते। सटीक खुराक और तरीका लाइसेंसी वेट तय करेगा।",
	},
	{
		question: "My pet has a fever — what do I do?",
		questionHi: "मेरे पालतू को बुखार है — क्या करूँ?",
		emoji: "🌡️",
		answer:
			"Normal temperature for dogs and cats is **38–39.2°C (100.4–102.5°F)**. Signs of fever include warm/dry nose, hot ears, lethargy, shivering, and reduced appetite.\n\n**What to do right now:**\n1. Confirm with a rectal thermometer if possible.\n2. Move your pet to a cool, shaded area and offer fresh water.\n3. Place a damp (not ice-cold) cloth on their paws and belly.\n4. **Do NOT give paracetamol, ibuprofen, or aspirin** — these are toxic to dogs and cats.\n\n**See a vet urgently if:**\n- Temperature is above 40°C (104°F).\n- The fever has lasted more than 24 hours.\n- Your pet is not drinking, is very lethargic, or has other symptoms like vomiting or difficulty breathing.",
		answerHi:
			"कुत्तों और बिल्लियों का सामान्य तापमान **38–39.2°C** है। बुखार के लक्षण: गर्म/सूखी नाक, गर्म कान, सुस्ती, काँपना, भूख कम।\n\n**अभी क्या करें:**\n1. हो सके तो मलाशय थर्मामीटर से जाँच करें।\n2. ठंडी छायादार जगह पर रखें, पानी दें।\n3. पंजों और पेट पर गीला (बर्फ़ ठंडा नहीं) कपड़ा रखें।\n4. **पैरासिटामॉल, इबुप्रोफेन या एस्पिरिन न दें** — कुत्ते-बिल्लियों के लिए विषैले हैं।\n\n**तुरंत वेट दिखाएँ अगर:**\n- तापमान 40°C से ऊपर।\n- बुखार 24 घंटे से ज़्यादा।\n- पानी न पी रहा, बहुत सुस्त, उल्टी या साँस लेने में दिक्कत।",
	},
];
