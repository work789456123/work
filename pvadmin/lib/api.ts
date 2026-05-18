/**
 * Returns the base URL for API calls.
 *
 * In the browser we always use relative paths ("") so the Next.js rewrite
 * proxy in next.config.ts forwards /api/* to the backend container.
 * This means the same build works in local dev, Docker, and production
 * without any environment variable changes.
 */
export function getApiBase(): string {
  return "";
}
