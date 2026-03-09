import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseAuthGetUserTool: ToolDefinition = {
  name: "supabase-auth-get-user",
  display_name: t("AUTH_GET_USER_DISPLAY_NAME"),
  description: t("AUTH_GET_USER_DESCRIPTION"),
  icon: "👤",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "jwt",
      type: "string",
      required: false,
      display_name: t("AUTH_JWT_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_JWT_PLACEHOLDER"),
        hint: t("AUTH_JWT_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const supabase = clientResult.supabase
    const jwt = (parameters.jwt as string)?.trim() || undefined
    const result = await supabase.auth.getUser(jwt)
    return authResult({ data: result.data, error: result.error }) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
