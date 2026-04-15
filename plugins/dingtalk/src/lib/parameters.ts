import type { PropertyCredentialId } from "@choiceopen/atomemo-plugin-sdk-js/types"
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
