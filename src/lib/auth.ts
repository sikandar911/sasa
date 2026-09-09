import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "ajeer_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "ajeer2026admin";
}

export function verifyPassword(password: string): boolean {
  return password.trim() === getAdminPassword().trim();
}

export function getAuthCookieValue(): string {
  return Buffer.from(`admin_authenticated_${getAdminPassword()}`).toString("base64");
}

export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);
    if (!session || !session.value) return false;
    return session.value === getAuthCookieValue();
  } catch (err) {
    return false;
  }
}

export { AUTH_COOKIE_NAME };