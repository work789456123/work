export type TermsConsentConsents = {
  readAndUnderstood: boolean;
  teletriageOnly: boolean;
  noVcpr: boolean;
  noReplaceInPerson: boolean;
};

export type TermsConsentKey = keyof TermsConsentConsents;

export type TermsConsentState = {
  hasScrolledToBottom: boolean;
  consents: TermsConsentConsents;
};

export type TermsConsentAction =
  | { type: "SET_SCROLLED_BOTTOM" }
  | {
      type: "TOGGLE_CONSENT";
      name: TermsConsentKey;
      checked: boolean;
    };

export type TermsConsentItem =
  | { name: TermsConsentKey; labelPlain: string }
  | {
      name: TermsConsentKey;
      labelParts: { before: string; emphasis: string; after: string };
    };

