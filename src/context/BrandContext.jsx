import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "expenseTrackerBrandSettings";
export const DEFAULT_SETTINGS = {
  appName: "ExpenseFlow",
  tagline: "Personal Finance",
  currency: "NPR",
  accent: "#6c5ce7",
  logo: "",
};
const CURRENCIES = ["NPR", "USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];

/** Accepts only well-formed settings, falling back to defaults field by field. */
const sanitize = (saved) => {
  if (!saved || typeof saved !== "object") return DEFAULT_SETTINGS;
  return {
    appName: typeof saved.appName === "string" ? saved.appName.slice(0, 32) : DEFAULT_SETTINGS.appName,
    tagline: typeof saved.tagline === "string" ? saved.tagline.slice(0, 48) : DEFAULT_SETTINGS.tagline,
    currency: CURRENCIES.includes(saved.currency) ? saved.currency : DEFAULT_SETTINGS.currency,
    accent: typeof saved.accent === "string" && /^#[\da-f]{6}$/i.test(saved.accent) ? saved.accent : DEFAULT_SETTINGS.accent,
    logo:
      typeof saved.logo === "string" && saved.logo.startsWith("data:image/") && saved.logo.length <= 700_000
        ? saved.logo
        : "",
  };
};

const BrandContext = createContext(null);

/**
 * Keeps branding preferences in one place so every screen stays consistent.
 * Saved in this browser's localStorage.
 */
export function BrandProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch (error) {
      console.warn("Brand preferences could not be restored.", error);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    // Keep document metadata and CSS branding synchronized with saved settings.
    document.title = settings.appName || DEFAULT_SETTINGS.appName;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = settings.logo || "/pwa-64x64.png";
    document.documentElement.style.setProperty("--brand-accent", settings.accent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn("Brand preferences could not be saved.", error);
    }
  }, [settings]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

/** Provides the current brand settings to app components and settings forms. */
export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) throw new Error("useBrand must be used inside BrandProvider.");
  return context;
}

/**
 * Formats amounts with the selected currency while keeping local display conventions.
 *
 * formatCurrency(1234.5)                     -> "NPR 1,234.50"
 * formatCurrency(1234.5, { whole: true })    -> "NPR 1,235"
 * formatCurrency(123456, { compact: true })  -> "NPR 1.2L"
 */
export function useCurrencyFormatter() {
  const { settings } = useBrand();
  return (amount, { compact = false, whole = false } = {}) => {
    const locale = ["NPR", "INR"].includes(settings.currency) ? "en-IN" : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: settings.currency,
      notation: compact ? "compact" : "standard",
      minimumFractionDigits: compact || whole ? 0 : 2,
      maximumFractionDigits: compact ? 1 : whole ? 0 : 2,
    }).format(Number(amount) || 0);
  };
}
