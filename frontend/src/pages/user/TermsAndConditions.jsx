import React, { useRef, useEffect, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TermsLegalSections from "@/components/user/TermsLegalSections";
import {
  termsPage,
  termsConsent,
  termsConsentItems,
} from "@/assets/terms_and_conditions";

const THRESHOLD = 10;

const initialState = {
  hasScrolledToBottom: false,
  consents: {
    readAndUnderstood: false,
    teletriageOnly: false,
    noVcpr: false,
    noReplaceInPerson: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SCROLLED_BOTTOM":
      return { ...state, hasScrolledToBottom: true };
    case "TOGGLE_CONSENT":
      return {
        ...state,
        consents: { ...state.consents, [action.name]: action.checked },
      };
    default:
      return state;
  }
}

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { hasScrolledToBottom, consents } = state;

  const allConsented = Object.values(consents).every(Boolean);
  const canAccept = hasScrolledToBottom && allConsented;

  const handleScroll = useCallback(() => {
    if (hasScrolledToBottom || !contentRef.current) return;
    const { bottom } = contentRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (bottom <= windowHeight + THRESHOLD) {
      dispatch({ type: "SET_SCROLLED_BOTTOM" });
    }
  }, [hasScrolledToBottom]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    dispatch({ type: "TOGGLE_CONSENT", name, checked });
  };

  const handleAccept = () => {
    localStorage.setItem("pashuvaani_terms_accepted", "true");
    navigate("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[900px] mx-auto bg-teal-50 rounded-2xl shadow-sm p-6 sm:p-10">
        <h1 className="text-[32px] font-bold text-gray-900 mb-8 text-center border-b pb-6">
          {termsPage.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div
            ref={contentRef}
            className="flex-1 order-1 md:order-2 text-[16px] leading-[1.7] text-gray-700"
          >
            <TermsLegalSections />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {termsConsent.sectionTitle}
              </h3>

              {!hasScrolledToBottom && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-sm text-yellow-700">
                    {termsConsent.scrollWarning}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {termsConsentItems.map((item) => (
                  <label
                    key={item.name}
                    className="flex items-start cursor-pointer group"
                  >
                    <div className="flex items-center h-6 mt-0.5">
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={consents[item.name]}
                        onChange={handleCheckboxChange}
                        disabled={!hasScrolledToBottom}
                        className="w-5 h-5 text-[#1F6559] bg-gray-100 border-gray-300 rounded focus:ring-[#1F6559] focus:ring-2 disabled:opacity-50"
                      />
                    </div>
                    <div className="ml-3">
                      <span
                        className={`text-base font-medium ${!hasScrolledToBottom ? "text-gray-400" : "text-gray-800"}`}
                      >
                        {item.labelPlain ? (
                          item.labelPlain
                        ) : (
                          <>
                            {item.labelParts.before}
                            <em className="not-italic font-bold">
                              {item.labelParts.emphasis}
                            </em>
                            {item.labelParts.after}
                          </>
                        )}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center sm:items-start">
                <Button
                  onClick={handleAccept}
                  disabled={!canAccept}
                  className="w-full sm:w-auto px-8 py-3 text-lg rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {termsConsent.acceptButton}
                </Button>
                {!canAccept && hasScrolledToBottom && (
                  <p className="text-sm text-red-500 mt-2 text-center sm:text-left">
                    {termsConsent.checkAllHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
