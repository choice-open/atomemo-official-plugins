// API docs: https://developers.hubspot.com/docs/api-reference/legacy/communication-preferences/v3/guide
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

export const removeEmailSubscriptionTool = {
  name: "hubspot-remove-email-subscription",
  display_name: t("REMOVE_EMAIL_SUBSCRIPTION_DISPLAY_NAME"),
  description: t("REMOVE_EMAIL_SUBSCRIPTION_DESCRIPTION"),
  icon: "📧",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "email_address",
      type: "string",
      required: true,
      display_name: t("PARAM_EMAIL_ADDRESS_LABEL"),
      ai: { llm_description: t("PARAM_EMAIL_ADDRESS_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_EMAIL_ADDRESS_HINT"),
        placeholder: t("PARAM_EMAIL_ADDRESS_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "subscription_id",
      type: "string",
      required: true,
      display_name: t("PARAM_SUBSCRIPTION_ID_LABEL"),
      ai: { llm_description: t("PARAM_SUBSCRIPTION_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_SUBSCRIPTION_ID_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const emailAddress = getString(args.parameters, "email_address")
    const subscriptionId = getString(args.parameters, "subscription_id")
    if (!emailAddress || !subscriptionId)
      throw new Error("email_address and subscription_id are required")

    try {
      const result =
        await client.communicationPreferences.statusApi.unsubscribe({
          emailAddress,
          subscriptionId,
          legalBasis: undefined as any,
          legalBasisExplanation: undefined as any,
        })
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
