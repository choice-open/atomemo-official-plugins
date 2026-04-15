import type { Property, PropertyCredentialId } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "./i18n"
import { DINGTALK_APP_CREDENTIAL_NAME } from "./dingtalk"

export const locales = ["en-US", "zh-Hans"] as const

export const credentialParameter: PropertyCredentialId<"credential_id"> = {
  name: "credential_id",
  type: "credential_id",
  required: true,
  credential_name: DINGTALK_APP_CREDENTIAL_NAME,
  display_name: t("PARAM_CREDENTIAL_LABEL"),
  ui: {
    component: "credential-select",
  },
}

export const operatorParameter: Property<"operator_id"> = {
  name: "operator_id",
  type: "string",
  required: false,
  display_name: t("PARAM_OPERATOR_ID_LABEL"),
  ai: {
    llm_description: t("PARAM_OPERATOR_ID_LLM_DESCRIPTION"),
  },
  ui: {
    component: "input",
    hint: t("PARAM_OPERATOR_ID_HINT"),
    placeholder: t("PARAM_OPERATOR_ID_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
}
