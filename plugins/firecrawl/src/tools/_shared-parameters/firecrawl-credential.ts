import type { PropertyCredentialId } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const firecrawlCredentialParameter: PropertyCredentialId<"credentialId"> =
  {
    name: "credentialId",
    type: "credential_id",
    credential_name: "firecrawl",
    display_name: t("PARAM_CREDENTIAL_LABEL"),
    required: true,
    ui: {
      component: "credential-select",
    },
  }
