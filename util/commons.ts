import { cookies } from "next/headers";
import { COOKIE_NAME } from "./config";

export function setUserTokenToCookie(token: string) {
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

export function getUserTokenFromCookie() {
  const cookieStore = cookies();

  return cookieStore.get(COOKIE_NAME)?.value;
}

export function removeUserTokenFromCookie() {
  const cookieStore = cookies();

  cookieStore.delete(COOKIE_NAME);
}
