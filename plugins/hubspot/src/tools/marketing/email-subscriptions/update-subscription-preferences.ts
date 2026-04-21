// API docs: https://developers.hubspot.com/docs/api/marketing/subscriptions
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

export const updateSubscriptionPreferencesTool = {
  name: "hubspot-update-subscription-preferences",
  display_name: t("UPDATE_SUBSCRIPTION_PREFERENCES_DISPLAY_NAME"),
  description: t("UPDATE_SUBSCRIPTION_PREFERENCES_DESCRIPTION"),
  icon: "📬",
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
      name: "subscription_statuses",
      type: "string",
      required: true,
      display_name: t("PARAM_SUBSCRIPTION_STATUSES_LABEL"),
      ai: { llm_description: t("PARAM_SUBSCRIPTION_STATUSES_HINT") },
      ui: {
        component: "code-editor",
        hint: t("PARAM_SUBSCRIPTION_STATUSES_HINT"),
      },
    },
    {
      name: "legal_basis",
      type: "string",
      required: false,
      display_name: t("PARAM_LEGAL_BASIS_LABEL"),
      ai: { llm_description: t("PARAM_LEGAL_BASIS_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_LEGAL_BASIS_HINT"),
        support_expression: true,
      },
    },
    {
      name: "legal_basis_explanation",
      type: "string",
      required: false,
      display_name: t("PARAM_LEGAL_BASIS_EXPLANATION_LABEL"),
      ai: { llm_description: t("PARAM_LEGAL_BASIS_EXPLANATION_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_LEGAL_BASIS_EXPLANATION_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const emailAddress = getString(args.parameters, "email_address")
    if (!emailAddress) throw new Error("email_address is required")

    const rawStatuses = args.parameters.subscription_statuses
    const subscriptionStatuses = (() => {
      if (!rawStatuses) return undefined
      if (typeof rawStatuses === "string") {
        try {
          return JSON.parse(rawStatuses) as Array<{
            id: string
            subscribed: boolean
          }>
        } catch {
          return undefined
        }
      }
      return rawStatuses as Array<{ id: string; subscribed: boolean }>
    })()
    if (!subscriptionStatuses?.length)
      throw new Error("subscription_statuses is required")

    const legalBasis = getString(args.parameters, "legal_basis")
    const legalBasisExplanation = getString(
      args.parameters,
      "legal_basis_explanation",
    )

    try {
      // Subscribe each entry; use subscribe/unsubscribe based on status
      const results = []
      for (const status of subscriptionStatuses) {
        if (status.subscribed) {
          const result =
            await client.communicationPreferences.statusApi.subscribe({
              emailAddress,
              subscriptionId: status.id,
              legalBasis: legalBasis as any,
              legalBasisExplanation,
            })
          results.push(result)
        } else {
          const result =
            await client.communicationPreferences.statusApi.unsubscribe({
              emailAddress,
              subscriptionId: status.id,
              legalBasis: legalBasis as any,
              legalBasisExplanation,
            })
          results.push(result)
        }
      }
      return { success: true, result: results } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
