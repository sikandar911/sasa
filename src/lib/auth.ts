import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "ajeer_admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ajeer2026admin";

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  if (!session) return false;
  // Simple token verification
  return session.value === Buffer.from(`admin_authenticated_${ADMIN_PASSWORD}`).toString("base64");
}

export function getAuthCookieValue(): string {
  return Buffer.from(`admin_authenticated_${ADMIN_PASSWORD}`).toString("base64");
}

export { AUTH_COOKIE_NAME };
