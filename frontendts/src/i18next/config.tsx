import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import de from "./de.json";

i18n
  .use(LanguageDetector) // auto-detect user language
  .use(initReactI18next) // connect with React
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;