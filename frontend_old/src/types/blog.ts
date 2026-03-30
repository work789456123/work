/** Blog copy objects keyed by locale code, always including `en`. */
export type BlogLocalizedCopy = Record<string, string> & { en: string };
