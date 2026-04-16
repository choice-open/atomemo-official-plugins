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

async function buildKey(alg: Algorithm, secret: string) {
  if (isHmac(alg)) {
    return new TextEncoder().encode(secret)
  }
  return jose.importPKCS8(secret, alg)
}

const algorithmOptions = ALGORITHMS.map((alg) => ({
  value: alg as string,
  label: { en_US: alg, zh_Hans: alg },
}))

export const jwtSignTool = {
  name: "jwt-signer",
  display_name: t("JWT_SIGN_DISPLAY_NAME"),
  description: t("JWT_SIGN_DESCRIPTION"),
  icon: "🔏",
  skill: getSkill("jwt-signer"),
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
      name: "algorithm",
      type: "string",
      required: true,
      default: "HS256",
      display_name: t("SIGN_ALGORITHM_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: algorithmOptions,
        hint: t("SIGN_ALGORITHM_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "issuer",
      type: "string",
      required: false,
      display_name: t("SIGN_ISSUER_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("SIGN_ISSUER_HINT"),
        placeholder: t("SIGN_ISSUER_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "subject",
      type: "string",
      required: false,
      display_name: t("SIGN_SUBJECT_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("SIGN_SUBJECT_HINT"),
        placeholder: t("SIGN_SUBJECT_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "audience",
      type: "string",
      required: false,
      display_name: t("SIGN_AUDIENCE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("SIGN_AUDIENCE_HINT"),
        placeholder: t("SIGN_AUDIENCE_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "expires_in",
      type: "number",
      required: false,
      display_name: t("SIGN_EXPIRES_IN_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("SIGN_EXPIRES_IN_HINT"),
        placeholder: t("SIGN_EXPIRES_IN_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "additional_claims",
      type: "string",
      required: false,
      default: "{}",
      display_name: t("SIGN_ADDITIONAL_CLAIMS_DISPLAY_NAME"),
      ui: {
        component: "code-editor",
        language: "json",
        min_height: 120,
        hint: t("SIGN_ADDITIONAL_CLAIMS_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    try {
      const params = args.parameters ?? {}
      const algorithm = (params.algorithm as Algorithm) ?? "HS256"
      const credentialId = params.jwt_credential as string
      const cred = args.credentials?.[credentialId] as
        | Record<string, unknown>
        | undefined
      const secretKey = cred?.secret_key as string
      const issuer = params.issuer as string | undefined
      const subject = params.subject as string | undefined
      const audience = params.audience as string | undefined
      const expiresIn = Number(params.expires_in) || 1800
      const additionalClaimsRaw = params.additional_claims as string | undefined

      if (!secretKey) {
        throw new Error("secret_key is required")
      }

      let additionalClaims: Record<string, unknown> = {}
      if (additionalClaimsRaw?.trim()) {
        additionalClaims = JSON.parse(additionalClaimsRaw)
      }

      const key = await buildKey(algorithm, secretKey)

      const now = Math.floor(Date.now() / 1000)
      const builder = new jose.SignJWT({ ...additionalClaims })
        .setProtectedHeader({ alg: algorithm, typ: "JWT" })
        .setIssuedAt(now)
        .setNotBefore(now - 5)
        .setExpirationTime(now + expiresIn)

      if (issuer) builder.setIssuer(issuer)
      if (subject) builder.setSubject(subject)
      if (audience) builder.setAudience(audience)

      const token = await builder.sign(key)

      return {
        token,
        algorithm,
        issued_at: new Date(now * 1000).toISOString(),
        expires_at: new Date((now + expiresIn) * 1000).toISOString(),
      } as JsonValue
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  },
} satisfies ToolDefinition
