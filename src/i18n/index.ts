import { enUSMessages } from "@/i18n/messages/en-US";
import { zhCNMessages } from "@/i18n/messages/zh-CN";

export const supportedLocales = ["zh-CN", "en-US"] as const;

export type Locale = (typeof supportedLocales)[number];
export type TranslationKey = keyof typeof zhCNMessages;

type Messages = Record<TranslationKey, string>;

const localeMessages: Record<Locale, Messages> = {
  "zh-CN": zhCNMessages,
  "en-US": enUSMessages,
};

const fallbackLocale: Locale = "zh-CN";

export const isLocale = (value: string): value is Locale => {
  return supportedLocales.includes(value as Locale);
};

export const getLocaleMessages = (locale: Locale): Messages => {
  return localeMessages[locale] ?? localeMessages[fallbackLocale];
};

export const getTranslation = (locale: Locale, key: TranslationKey): string => {
  const messages = getLocaleMessages(locale);
  return messages[key] ?? localeMessages[fallbackLocale][key] ?? key;
};
