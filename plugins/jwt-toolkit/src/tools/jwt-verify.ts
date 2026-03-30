import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import * as jose from "jose"
import { t } from "../i18n/i18n-node"
import { getSkill } from "../skills"

const ALGORITHMS = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512",
  "EdDSA",
] as const

type Algorithm = (typeof ALGORITHMS)[number]

function isHmac(alg: string): boolean {
  return alg.startsWith("HS")
}

async function buildVerifyKey(alg: string, secret: string) {
  if (isHmac(alg)) {
    return new TextEncoder().encode(secret)
  }
  return jose.importSPKI(secret, alg)
}

const algorithmOptions = ALGORITHMS.map((alg) => ({
  value: alg as string,
  label: { en_US: alg, zh_Hans: alg },
}))

export const jwtVerifyTool = {
  name: "jwt-verifier",
  display_name: t("JWT_VERIFY_DISPLAY_NAME"),
  description: t("JWT_VERIFY_DESCRIPTION"),
  icon: "🔍",
  skill: getSkill("jwt-verifier"),
  parameters: [
    {
      name: "jwt_credential",
      type: "credential_id",
      required: true,
      display_name: t("PARAM_CREDENTIAL_LABEL"),
      credential_name: "jwt-secret",
      ui: { component: "credential-select" },
    },
    {
      name: "token",
      type: "string",
      required: true,
      display_name: t("VERIFY_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("VERIFY_TOKEN_HINT"),
        placeholder: t("VERIFY_TOKEN_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "algorithms",
      type: "string",
      required: false,
      display_name: t("VERIFY_ALGORITHMS_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: algorithmOptions,
        hint: t("VERIFY_ALGORITHMS_HINT"),
        width: "medium",
      },
    },
    {
      name: "issuer",
      type: "string",
      required: false,
      display_name: t("VERIFY_ISSUER_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("VERIFY_ISSUER_HINT"),
        placeholder: t("VERIFY_ISSUER_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "audience",
      type: "string",
      required: false,
      display_name: t("VERIFY_AUDIENCE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("VERIFY_AUDIENCE_HINT"),
        placeholder: t("VERIFY_AUDIENCE_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    try {
      const params = args.parameters ?? {}
      const token = params.token as string
      const credentialId = params.jwt_credential as string
      const cred = args.credentials?.[credentialId] as
        | Record<string, unknown>
        | undefined
      const secretKey = cred?.secret_key as string
      const algorithmsParam = params.algorithms as string | undefined
      const issuer = params.issuer as string | undefined
      const audience = params.audience as string | undefined

      if (!token) {
        throw new Error("token is required")
      }
      if (!secretKey) {
        throw new Error("secret_key is required")
      }

      // Decode header to get algorithm for key import
      const header = jose.decodeProtectedHeader(token)
      const alg = algorithmsParam || header.alg || "HS256"

      const key = await buildVerifyKey(alg, secretKey)

      const options: jose.JWTVerifyOptions = {}
      if (algorithmsParam) {
        options.algorithms = [algorithmsParam as Algorithm]
      }
      if (issuer) options.issuer = issuer
      if (audience) options.audience = audience

      const { payload, protectedHeader } = await jose.jwtVerify(
        token,
        key,
        options,
      )

      return {
        valid: true,
        header: protectedHeader,
        payload,
      } as JsonValue
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  },
} satisfies ToolDefinition
