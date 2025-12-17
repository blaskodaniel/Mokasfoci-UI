import { cache } from "react";
import { COOKIE_NAME } from "./config";
import { MatchOutcome } from "./enums";

export async function setUserTokenToCookie(token: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });
}

// Server-side cookie getter
export const getServerTokenFromCookie = cache(async () => {
  const { cookies } = await import("next/headers");
  return cookies().get(COOKIE_NAME)?.value ?? null;
});

// Client-side cookie getter
export const getClientTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];
  return cookieValue ?? null;
};

// Universal cookie getter (for backwards compatibility)
export const getUserTokenFromCookie = cache(async () => {
  // Check if we're on the client side
  if (typeof window !== "undefined") {
    // Client side - use document.cookie
    return getClientTokenFromCookie();
  }

  // Server side - use Next.js cookies
  return await getServerTokenFromCookie();
});

export async function removeUserTokenFromCookie() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();

  cookieStore.delete(COOKIE_NAME);
}

export const mapEnumToObjectArray = (enumType: any) =>
  Object.entries(enumType).map(([key, value]) => ({
    key: value,
    value: key,
  }));
