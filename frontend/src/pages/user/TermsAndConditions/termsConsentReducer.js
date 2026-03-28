export const termsConsentInitialState = {
  hasScrolledToBottom: false,
  consents: {
    readAndUnderstood: false,
    teletriageOnly: false,
    noVcpr: false,
    noReplaceInPerson: false,
  },
};

export function termsConsentReducer(state, action) {
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
