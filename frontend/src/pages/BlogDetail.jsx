import React, { useState } from "react";
import { Helmet } from "react-helmet";

const BlogDetails = () => {

  const [language, setLanguage] = useState("en");
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question:
        language === "en"
          ? "What is PashuVaani?"
          : "पशुवाणी क्या है?",
      answer:
        language === "en"
          ? "PashuVaani is an AI-powered animal health guidance platform designed to provide early awareness and structured support for pet owners and dairy farmers in India."
          : "पशुवाणी एक AI आधारित पशु स्वास्थ्य मार्गदर्शन प्लेटफॉर्म है जो भारत में पेट ओनर्स और डेयरी किसानों को शुरुआती जागरूकता और संरचित सहायता प्रदान करने के लिए बनाया गया है।",
    },
    {
      question:
        language === "en"
          ? "Does PashuVaani diagnose diseases?"
          : "क्या पशुवाणी बीमारियों का निदान करता है?",
      answer:
        language === "en"
          ? "No. PashuVaani provides early guidance and risk awareness but does not replace veterinary diagnosis or treatment."
          : "नहीं। पशुवाणी केवल शुरुआती मार्गदर्शन और जोखिम जागरूकता देता है और पशु चिकित्सक के निदान या उपचार की जगह नहीं लेता।",
    },
    {
      question:
        language === "en"
          ? "How does AI help dairy farmers?"
          : "AI डेयरी किसानों की कैसे मदद करता है?",
      answer:
        language === "en"
          ? "AI analyses reported symptoms and productivity patterns to provide early alerts and encourage timely veterinary consultation."
          : "AI लक्षणों और उत्पादन पैटर्न का विश्लेषण करके शुरुआती चेतावनी देता है और समय पर पशु चिकित्सक से संपर्क करने के लिए प्रेरित करता है।",
    },
    {
      question:
        language === "en"
          ? "Is PashuVaani suitable for small farmers?"
          : "क्या पशुवाणी छोटे किसानों के लिए उपयुक्त है?",
      answer:
        language === "en"
          ? "Yes. The platform is designed to be mobile-first, simple, and accessible for small and medium-scale farmers."
          : "हाँ। यह प्लेटफॉर्म मोबाइल-फर्स्ट, सरल और छोटे व मध्यम किसानों के लिए आसानी से उपयोग करने योग्य बनाया गया है।",
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">

      <Helmet>
        <title>PashuVaani AI in Animal Health | Smart Dairy & Pet Care India</title>
        <meta
          name="description"
          content="Discover how PashuVaani is using AI-powered early guidance to transform animal health in India — from smart pet care to intelligent dairy farming."
        />
      </Helmet>

      {/* HERO */}

      <div className="bg-gradient-to-r from-[#E6F4EF] to-[#E8F0FF] py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <img
            src="/blogimage.jpeg"
            alt="AI animal health"
            className="rounded-xl shadow-lg w-full h-[380px] object-cover"
          />

          <div>

            <div className="mb-4 flex gap-3">

              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-1 rounded ${language === "en" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                English
              </button>

              <button
                onClick={() => setLanguage("hi")}
                className={`px-4 py-1 rounded ${language === "hi" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                हिंदी
              </button>

            </div>

            <h1 className="text-4xl font-bold text-[#0F3D2E] mb-4">

              {language === "en"
                ? "How PashuVaani is Bringing AI to Animal Health in India: From Smart Pets to Smart Dairy Farms"
                : "कैसे पशुवाणी भारत में पशु स्वास्थ्य में AI ला रहा है: स्मार्ट पेट से स्मार्ट डेयरी फार्म तक"}

            </h1>

            <p className="text-gray-600 text-lg">

              {language === "en"
                ? "Discover how PashuVaani is using AI-powered early guidance to transform animal health in India."
                : "जानिए कैसे पशुवाणी AI की मदद से भारत में पशु स्वास्थ्य को बेहतर बनाने की दिशा में काम कर रहा है।"}

            </p>

          </div>
        </div>
      </div>


      {/* BLOG CONTENT */}

      <div className="max-w-4xl mx-auto px-6 mt-16 bg-teal-50 p-10 rounded-xl shadow">

        {/* INTRO */}

        <h2 className="text-2xl font-semibold mb-4">

          {language === "en"
            ? "Introduction: The Animal Health Gap in India"
            : "परिचय: भारत में पशु स्वास्थ्य की चुनौतियाँ"}

        </h2>

        <p className="mb-4">
          {language === "en"
            ? "India is home to one of the world’s largest livestock populations and a rapidly growing pet ecosystem."
            : "भारत दुनिया की सबसे बड़ी पशुधन आबादी वाले देशों में से एक है और यहाँ पालतू पशुओं का तेजी से बढ़ता इकोसिस्टम भी है।"}
        </p>

        <p className="mb-4">
          {language === "en"
            ? "Yet millions of animal owners still face delayed disease detection, limited veterinary access in rural areas, lack of structured health monitoring and income loss due to preventable illnesses."
            : "फिर भी लाखों पशु मालिकों को देर से बीमारी का पता लगना, ग्रामीण क्षेत्रों में पशु चिकित्सकों की कमी, संरचित स्वास्थ्य निगरानी की कमी और रोकी जा सकने वाली बीमारियों के कारण आय में नुकसान जैसी समस्याओं का सामना करना पड़ता है।"}
        </p>

        <p className="mb-6">
          {language === "en"
            ? "For dairy farmers, even a small drop in milk production directly affects daily earnings."
            : "डेयरी किसानों के लिए दूध उत्पादन में थोड़ी सी गिरावट भी उनकी दैनिक आय को सीधे प्रभावित करती है।"}
        </p>


        {/* AI IN ANIMAL HEALTH */}

        <h2 className="text-2xl font-semibold mt-10 mb-4">

          {language === "en"
            ? "What is AI in Animal Health?"
            : "पशु स्वास्थ्य में AI क्या है?"}

        </h2>

        <p className="mb-4">
          {language === "en"
            ? "Artificial Intelligence (AI) in animal health refers to smart systems that analyse reported symptoms, detect abnormal patterns, track productivity changes, provide early risk awareness and encourage timely veterinary consultation."
            : "पशु स्वास्थ्य में आर्टिफिशियल इंटेलिजेंस (AI) ऐसे स्मार्ट सिस्टम को दर्शाता है जो लक्षणों का विश्लेषण करता है, असामान्य पैटर्न पहचानता है, उत्पादन में बदलाव को ट्रैक करता है और शुरुआती जोखिम की चेतावनी देता है।"}
        </p>

        <p className="mb-6">
          {language === "en"
            ? "AI does not replace veterinarians. It supports better decision-making."
            : "AI पशु चिकित्सकों की जगह नहीं लेता बल्कि बेहतर निर्णय लेने में मदद करता है।"}
        </p>


        {/* PET HEALTH */}

        <h2 className="text-2xl font-semibold mt-10 mb-4">

          {language === "en"
            ? "AI in Smart Pet Healthcare"
            : "स्मार्ट पेट हेल्थकेयर में AI"}

        </h2>

        <p className="mb-4">
          {language === "en"
            ? "Urban India is witnessing rapid growth in digital pet care."
            : "शहरी भारत में डिजिटल पेट केयर तेजी से बढ़ रहा है।"}
        </p>

        <ul className="list-disc pl-6 mb-6">
          <li>{language === "en" ? "Symptom-based early guidance" : "लक्षण आधारित शुरुआती मार्गदर्शन"}</li>
          <li>{language === "en" ? "Behaviour awareness prompts" : "व्यवहार जागरूकता संकेत"}</li>
          <li>{language === "en" ? "Preventive health education" : "रोकथाम आधारित स्वास्थ्य शिक्षा"}</li>
          <li>{language === "en" ? "Simple understandable insights" : "सरल और समझने योग्य जानकारी"}</li>
        </ul>


        {/* DAIRY */}

        <h2 className="text-2xl font-semibold mt-10 mb-4">

          {language === "en"
            ? "AI in Dairy & Livestock Health: The PashuVaani Vision"
            : "डेयरी और पशुधन स्वास्थ्य में AI: पशुवाणी का विज़न"}

        </h2>

        <p className="mb-6">
          {language === "en"
            ? "India’s dairy ecosystem represents one of the largest economic opportunities for digital transformation."
            : "भारत का डेयरी इकोसिस्टम डिजिटल परिवर्तन के लिए सबसे बड़े आर्थिक अवसरों में से एक है।"}
        </p>


        {/* FAQ */}

        <h2 className="text-2xl font-semibold mt-10 mb-6">
          {language === "en"
            ? "Frequently Asked Questions"
            : "अक्सर पूछे जाने वाले प्रश्न"}
        </h2>

        <div className="space-y-4">

          {faqs.map((faq, index) => (

            <div key={index} className="border rounded-lg overflow-hidden">

              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 font-semibold"
              >

                {faq.question}
                <span>{openFAQ === index ? "▲" : "▼"}</span>

              </button>

              {openFAQ === index && (
                <div className="p-4 text-gray-600 border-t">
                  {faq.answer}
                </div>
              )}

            </div>

          ))}

        </div>


        {/* CONCLUSION */}

        <h2 className="text-2xl font-semibold mt-10 mb-4">

          {language === "en"
            ? "Conclusion: Building the Future of Animal Health in India"
            : "निष्कर्ष: भारत में पशु स्वास्थ्य का भविष्य"}

        </h2>

        <p>
          {language === "en"
            ? "Artificial Intelligence is reshaping industries across the world. PashuVaani is committed to building a responsible, scalable and farmer-centric AI guidance platform."
            : "आर्टिफिशियल इंटेलिजेंस दुनिया भर के उद्योगों को बदल रहा है। पशुवाणी एक जिम्मेदार, स्केलेबल और किसान-केंद्रित AI प्लेटफॉर्म बनाने के लिए प्रतिबद्ध है।"}
        </p>

      </div>

    </div>
  );
};

export default BlogDetails;