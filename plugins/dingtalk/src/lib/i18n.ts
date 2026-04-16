import type { I18nText } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { L, t as generatedT } from "../i18n/i18n-node"
import type { Translations } from "../i18n/i18n-types"

export function t(entry: keyof Translations): I18nText {
  return generatedT(entry) as I18nText
}

export { L }
