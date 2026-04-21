// API docs: https://developers.hubspot.com/docs/api/crm/owners
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { credentialParams } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
} from "../../_shared/utils"

export const getOwnerByEmailTool = {
  name: "hubspot-get-owner-by-email",
  display_name: t("GET_OWNER_BY_EMAIL_DISPLAY_NAME"),
  description: t("GET_OWNER_BY_EMAIL_DESCRIPTION"),
  icon: "👑",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "email",
      type: "string",
      required: true,
      display_name: t("PARAM_OWNER_EMAIL_LABEL"),
      ai: { llm_description: t("PARAM_OWNER_EMAIL_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_OWNER_EMAIL_HINT"),
        placeholder: t("PARAM_OWNER_EMAIL_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const email = getString(args.parameters, "email")
    if (!email) throw new Error("email is required")
    try {
      const result = await client.crm.owners.ownersApi.getPage(email)
      const owner = result.results[0]
      if (!owner) throw new Error(`Owner not found with email: ${email}`)
      return { success: true, owner } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
