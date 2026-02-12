import type { PropertyCredentialId } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";

export const notionCredentialParameter: PropertyCredentialId<"notionClient"> = {
  name: "notionClient",
  type: "credential_id",
  credential_name: "notion",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  required: true,
  ai: {
    llm_description: t("CREDENTIAL_LLM_DESCRIPTION"),
  },
  ui: {
    component: "credential-select",
  },
};
