import type { TermsConsentAction, TermsConsentState } from "@/types/terms-consent";

export const termsConsentInitialState: TermsConsentState = {
  hasScrolledToBottom: false,
  consents: {
    readAndUnderstood: false,
    teletriageOnly: false,
    noVcpr: false,
    noReplaceInPerson: false,
  },
};

export function termsConsentReducer(
  state: TermsConsentState,
  action: TermsConsentAction
): TermsConsentState {
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
