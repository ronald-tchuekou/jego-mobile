export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333",
  APP_URL: process.env.EXPO_PUBLIC_APP_URL ?? "https://dev.jego.cm",
};

export function getApiUrl(path: string = "") {
  const base = env.API_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

