export type Locale = "en" | "tk" | "ru";

export const routing = {
    locales: ["en", "tk", "ru"] as Locale[],
    defaultLocale: "en" as Locale
};

export const localeStrings = ['en', 'tk', 'ru'] as const;