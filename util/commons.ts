import { COOKIE_NAME } from "./config";

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

export async function getUserTokenFromCookie() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();

  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function removeUserTokenFromCookie() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();

  cookieStore.delete(COOKIE_NAME);
}
