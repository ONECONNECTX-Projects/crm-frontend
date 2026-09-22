/**
 * Single sign-on across CRM, Intranet and Quest Calc.
 *
 * The CRM login is the only login. Its token is written to a cookie instead of
 * localStorage because localStorage is per-origin, while a cookie is shared by
 * every port on localhost and by every subdomain of NEXT_PUBLIC_SSO_DOMAIN in
 * production. The other two apps read it on boot and use it as their own token
 * — their APIs accept it and resolve the user by email.
 */

export const SSO_COOKIE = "sso_token";

// Empty in dev: a host-only cookie on localhost is already shared across ports.
const DOMAIN = process.env.NEXT_PUBLIC_SSO_DOMAIN || "";

const MAX_AGE = 3 * 24 * 60 * 60; // match the API's 3d token

export function setSsoToken(token: string): void {
  if (typeof document === "undefined") return;
  const domain = DOMAIN ? `; domain=${DOMAIN}` : "";
  // Secure only over https — setting it on http://localhost would drop the cookie.
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${SSO_COOKIE}=${token}; path=/; max-age=${MAX_AGE}; samesite=lax${domain}${secure}`;
}

export function getSsoToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${SSO_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearSsoToken(): void {
  if (typeof document === "undefined") return;
  const domain = DOMAIN ? `; domain=${DOMAIN}` : "";
  document.cookie = `${SSO_COOKIE}=; path=/; max-age=0${domain}`;
}

/** The app switcher's targets. Ports match each app's dev server. */
export const APPS = [
  {
    key: "crm",
    name: "CRM",
    url: process.env.NEXT_PUBLIC_CRM_URL || "http://localhost:3000",
  },
  {
    key: "intranet",
    name: "Intranet",
    url: process.env.NEXT_PUBLIC_INTRANET_URL || "http://localhost:3001",
  },
  {
    key: "calc",
    name: "Code Calculator",
    url: process.env.NEXT_PUBLIC_CALC_URL || "http://localhost:5173",
  },
];
