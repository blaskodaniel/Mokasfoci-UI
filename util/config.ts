const ENV = process.env.NODE_ENV || "development";

export const IS_DEV = ENV === "development";
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
