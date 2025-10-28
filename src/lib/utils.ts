export function objectToQueryString(obj: Record<string, any>) {
  return Object.keys(obj)
    .map((key) => `${key}=${obj[key] || ""}`)
    .join("&");
}

export function compactNumber(num: number) {
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
  }).format(num);
}

// Helper function to format date
export function formatDate(date: string | Date | null) {
  if (!date) return "Jamais";
  return Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(price);
}

export function getColorScheme(theme: "light" | "dark" | undefined) {
  return {
    backgroundColor: theme === "dark" ? "#231f1f" : "#ffffff",
    foregroundColor: theme === "dark" ? "#ffe5e5" : "#413030",
    primaryColor: theme === "dark" ? "#e7000b" : "#e7000b",
    primaryForegroundColor: theme === "dark" ? "#f9fafb" : "#fef2f2",
    borderColor: theme === "dark" ? "#3a2727" : "#ebebeb",
    cardColor: theme === "dark" ? "#221b1b" : "#fafafa",
  };
}
