import type { LocaleTranslationFunctions } from "typesafe-i18n"
import type {
  Locales,
  Translations,
  TranslationFunctions,
} from "./i18n-types.js"
export declare const L: LocaleTranslationFunctions<
  Locales,
  Translations,
  TranslationFunctions
>
export declare const t: (entry: keyof Translations) => {
  [key: string]: string
  en_US: string
}
export default L
