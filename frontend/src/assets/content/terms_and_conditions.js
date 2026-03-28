/** Route: /terms-and-conditions — UI chrome (legal body: TermsLegalSections.jsx) */
export const termsPage = {
  title: "Terms & Conditions",
};

export const termsConsent = {
  sectionTitle: "Your Consent",
  scrollWarning: "Please read through all terms to the bottom before accepting.",
  acceptButton: "Accept Terms",
  checkAllHint: "Please check all boxes above to continue.",
};

/** `name` matches reducer / state keys */
export const termsConsentItems = [
  {
    name: "readAndUnderstood",
    labelPlain: "I have read and understood these Terms & Conditions",
  },
  {
    name: "teletriageOnly",
    labelParts: {
      before: "I understand that the platform provides ",
      emphasis: "teletriage and informational guidance only",
      after: "",
    },
  },
  {
    name: "noVcpr",
    labelParts: {
      before: "I acknowledge that ",
      emphasis: "no Veterinary-Client-Patient Relationship is established",
      after: "",
    },
  },
  {
    name: "noReplaceInPerson",
    labelParts: {
      before: "I agree that the platform ",
      emphasis: "does not replace in-person veterinary care",
      after: "",
    },
  },
];
