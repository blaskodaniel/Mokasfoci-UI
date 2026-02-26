import { cache } from "react";
import { COOKIE_NAME } from "./config";
import { MatchOutcome, MatchStatus, MatchType } from "./enums";

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

/**
 * Formázza a nagy számokat olvashatóbb formátumba
 * @param num - A formázandó szám
 * @param compact - Ha true, rövid formátum (1K, 1M), ha false, szóközzel elválasztott
 * @returns Formázott szám string
 */
export const formatNumber = (num: number, compact: boolean = false): string => {
  if (isNaN(num) || num === null || num === undefined) return "0";

  if (compact) {
    // Kompakt formátum: 1K, 1M, 1B
    const absNum = Math.abs(num);

    if (absNum >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (absNum >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (absNum >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    return num.toString();
  } else {
    // Szóközzel elválasztott formátum: 1 234 567
    return new Intl.NumberFormat("hu-HU").format(num);
  }
};

export const getMatchStatusInfo = (status: MatchStatus | null): { color: string; text: string; className?: string } => {
  switch (status) {
    case MatchStatus.enabled:
      return { color: "", text: "Látható", className: "" };
    case MatchStatus.finished:
      return { color: "bg-gray-600", text: "Vége", className: "" };
    case MatchStatus.playing:
      return {
        color: "bg-red-600",
        text: "LIVE",
        className: "animate-pulse text-white",
      };
    default:
      return { color: "bg-yellow-600", text: "Ismeretlen" };
  }
};

export const getMatchTypeText = (type: MatchType): string => {
  switch (type) {
    case MatchType.Final:
      return "Döntő";
    case MatchType.Semifinal:
      return "Elődöntő";
    case MatchType.Quarterfinal:
      return "Negyedöntő";
    case MatchType.RoundOf16:
      return "Nyolcaddöntő";
    case MatchType.RoundOf32:
      return "Legjobb 32";
    case MatchType.GroupStageRound1:
      return "Csoportkör 1. forduló";
    case MatchType.GroupStageRound2:
      return "Csoportkör 2. forduló";
    case MatchType.GroupStageRound3:
      return "Csoportkör 3. forduló";
    default:
      return "-";
  }
};
