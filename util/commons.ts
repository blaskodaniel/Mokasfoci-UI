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

export const getUserTokenFromCookie = cache(async () => {
  const { cookies } = await import("next/headers");

  return cookies().get(COOKIE_NAME)?.value ?? null;
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
