import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import * as jose from "jose"
import { t } from "../i18n/i18n-node"

export const jwtDecodeTool = {
  name: "jwt-decoder",
  display_name: t("JWT_DECODE_DISPLAY_NAME"),
  description: t("JWT_DECODE_DESCRIPTION"),
  icon: "📋",
  parameters: [
    {
      name: "token",
      type: "string",
      required: true,
      display_name: t("DECODE_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DECODE_TOKEN_HINT"),
        placeholder: t("DECODE_TOKEN_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    try {
      const params = args.parameters ?? {}
      const token = params.token as string

      if (!token) {
        throw new Error("token is required")
      }

      const header = jose.decodeProtectedHeader(token)
      const payload = jose.decodeJwt(token)

      const result: Record<string, unknown> = {
        header,
        payload,
      }

      // Add human-readable timestamps if present
      if (typeof payload.iat === "number") {
        result.issued_at = new Date(payload.iat * 1000).toISOString()
      }
      if (typeof payload.exp === "number") {
        result.expires_at = new Date(payload.exp * 1000).toISOString()
        result.is_expired = Date.now() / 1000 > payload.exp
      }
      if (typeof payload.nbf === "number") {
        result.not_before = new Date(payload.nbf * 1000).toISOString()
      }

      return result as JsonValue
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  },
} satisfies ToolDefinition
