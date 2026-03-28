import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  blogHelmet,
  blogHero,
  blogArticle,
  blogFaqs,
} from "@/assets/content/blog_detail";

const BlogDetails = () => {
  const [language, setLanguage] = useState("en");
  const [openFAQ, setOpenFAQ] = useState(null);
  const t = (o) => o[language] || o.en;
  const art = blogArticle;

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div id="page-blog-detail" className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
      <Helmet>
        <title>{blogHelmet.title}</title>
        <meta name="description" content={blogHelmet.description} />
      </Helmet>

      <div id="blog-detail-hero" className="bg-gradient-to-r from-[#E6F4EF] to-[#E8F0FF] py-16">
        <div id="blog-detail-hero-inner" className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={blogHero.imageSrc}
            alt={blogHero.imageAlt}
            className="rounded-xl shadow-lg w-full h-[380px] object-cover"
          />
          <div>
            <div id="blog-detail-lang-toggle" className="mb-4 flex gap-3">
              <button
                id="blog-detail-lang-en"
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-4 py-1 rounded ${language === "en" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {blogHero.langButtons.en}
              </button>
              <button
                id="blog-detail-lang-hi"
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-4 py-1 rounded ${language === "hi" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {blogHero.langButtons.hi}
              </button>
            </div>
            <h1 id="blog-detail-title" className="text-4xl font-bold text-[#0F3D2E] mb-4">
              {t(blogHero.title)}
            </h1>
            <p className="text-gray-600 text-lg">{t(blogHero.subtitle)}</p>
          </div>
        </div>
      </div>

      <div id="blog-detail-article" className="max-w-4xl mx-auto px-6 mt-16 bg-teal-50 p-10 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">{t(art.intro.heading)}</h2>
        {art.intro.paragraphs.map((p, i) => (
          <p key={i} className="mb-4">
            {t(p)}
          </p>
        ))}

        <h2 className="text-2xl font-semibold mt-10 mb-4">{t(art.aiSection.heading)}</h2>
        {art.aiSection.paragraphs.map((p, i) => (
          <p key={i} className={i === art.aiSection.paragraphs.length - 1 ? "mb-6" : "mb-4"}>
            {t(p)}
          </p>
        ))}

        <h2 className="text-2xl font-semibold mt-10 mb-4">{t(art.petSection.heading)}</h2>
        <p className="mb-4">{t(art.petSection.lead)}</p>
        <ul className="list-disc pl-6 mb-6">
          {art.petSection.bullets.map((b, i) => (
            <li key={i}>{t(b)}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">{t(art.dairySection.heading)}</h2>
        <p className="mb-6">{t(art.dairySection.paragraph)}</p>

        <h2 id="blog-detail-faq-title" className="text-2xl font-semibold mt-10 mb-6">
          {t(art.faqTitle)}
        </h2>
        <div id="blog-detail-faq-list" className="space-y-4">
          {blogFaqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 font-semibold"
              >
                {t(faq.question)}
                <span>{openFAQ === index ? "▲" : "▼"}</span>
              </button>
              {openFAQ === index && (
                <div className="p-4 text-gray-600 border-t">{t(faq.answer)}</div>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-4">{t(art.conclusion.heading)}</h2>
        <p>{t(art.conclusion.paragraph)}</p>
      </div>
    </div>
  );
};

export default BlogDetails;
