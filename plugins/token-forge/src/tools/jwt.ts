import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { importPKCS8, SignJWT } from "jose"
import { t } from "../i18n/i18n-node"

const SUPPORTED_ALGORITHMS = [
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

type Algorithm = (typeof SUPPORTED_ALGORITHMS)[number]

const HMAC_ALGORITHMS = new Set<string>(["HS256", "HS384", "HS512"])

export const jwtTool = {
  name: "jwt-generator",
  display_name: t("JWT_DISPLAY_NAME"),
  description: t("JWT_DESCRIPTION"),
  icon: "https://server-media-public.atomemo.ai/icons/jwt.svg",
  parameters: [
    {
      name: "algorithm",
      type: "string",
      required: true,
      display_name: t("ALGORITHM_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("ALGORITHM_HINT"),
        support_expression: true,
      },
      options: [
        {
          value: "HS256",
          label: {
            en_US: "HS256 (HMAC-SHA256)",
            zh_Hans: "HS256 (HMAC-SHA256)",
          },
        },
        {
          value: "HS384",
          label: {
            en_US: "HS384 (HMAC-SHA384)",
            zh_Hans: "HS384 (HMAC-SHA384)",
          },
        },
        {
          value: "HS512",
          label: {
            en_US: "HS512 (HMAC-SHA512)",
            zh_Hans: "HS512 (HMAC-SHA512)",
          },
        },
        {
          value: "RS256",
          label: {
            en_US: "RS256 (RSA-PKCS1-SHA256)",
            zh_Hans: "RS256 (RSA-PKCS1-SHA256)",
          },
        },
        {
          value: "RS384",
          label: {
            en_US: "RS384 (RSA-PKCS1-SHA384)",
            zh_Hans: "RS384 (RSA-PKCS1-SHA384)",
          },
        },
        {
          value: "RS512",
          label: {
            en_US: "RS512 (RSA-PKCS1-SHA512)",
            zh_Hans: "RS512 (RSA-PKCS1-SHA512)",
          },
        },
        {
          value: "PS256",
          label: {
            en_US: "PS256 (RSA-PSS-SHA256)",
            zh_Hans: "PS256 (RSA-PSS-SHA256)",
          },
        },
        {
          value: "PS384",
          label: {
            en_US: "PS384 (RSA-PSS-SHA384)",
            zh_Hans: "PS384 (RSA-PSS-SHA384)",
          },
        },
        {
          value: "PS512",
          label: {
            en_US: "PS512 (RSA-PSS-SHA512)",
            zh_Hans: "PS512 (RSA-PSS-SHA512)",
          },
        },
        {
          value: "ES256",
          label: {
            en_US: "ES256 (ECDSA-P256-SHA256)",
            zh_Hans: "ES256 (ECDSA-P256-SHA256)",
          },
        },
        {
          value: "ES384",
          label: {
            en_US: "ES384 (ECDSA-P384-SHA384)",
            zh_Hans: "ES384 (ECDSA-P384-SHA384)",
          },
        },
        {
          value: "ES512",
          label: {
            en_US: "ES512 (ECDSA-P521-SHA512)",
            zh_Hans: "ES512 (ECDSA-P521-SHA512)",
          },
        },
        {
          value: "EdDSA",
          label: {
            en_US: "EdDSA (Ed25519/Ed448)",
            zh_Hans: "EdDSA (Ed25519/Ed448)",
          },
        },
      ],
      enum: [...SUPPORTED_ALGORITHMS],
      default: "HS256",
    },
    {
      name: "access_key",
      type: "string",
      required: true,
      display_name: t("ACCESS_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("ACCESS_KEY_HINT"),
        placeholder: t("ACCESS_KEY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "secret_key",
      type: "string",
      required: true,
      display_name: t("SECRET_KEY_DISPLAY_NAME"),
      ui: {
        component: "code-editor",
        hint: t("SECRET_KEY_HINT"),
        placeholder: t("SECRET_KEY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "expires_in",
      type: "number",
      required: false,
      display_name: t("EXPIRES_IN_DISPLAY_NAME"),
      default: 1800,
      ui: {
        component: "number-input",
        hint: t("EXPIRES_IN_HINT"),
        placeholder: t("EXPIRES_IN_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "additional_claims",
      type: "object",
      required: false,
      display_name: t("ADDITIONAL_CLAIMS_DISPLAY_NAME"),
      decoder: "json",
      properties: [],
      ui: {
        component: "code-editor",
        language: "json",
        hint: t("ADDITIONAL_CLAIMS_HINT"),
        placeholder: t("ADDITIONAL_CLAIMS_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const algorithm = (args.parameters.algorithm as string) || "HS256"
    const accessKey = args.parameters.access_key as string
    const secretKey = args.parameters.secret_key as string
    const expiresIn = Number(args.parameters.expires_in ?? 1800)
    const additionalClaims =
      (args.parameters.additional_claims as Record<string, unknown>) || {}

    if (!secretKey) {
      throw new Error("secret_key must not be empty")
    }

    const now = Math.floor(Date.now() / 1000)
    const baseClaims: Record<string, unknown> = {
      iss: accessKey,
      exp: now + expiresIn,
      nbf: now - 5,
    }

    // Merge: baseClaims < additionalClaims < { iss: accessKey } (iss cannot be overridden)
    const payload = { ...baseClaims, ...additionalClaims, iss: accessKey }

    const alg = algorithm as Algorithm
    const key = HMAC_ALGORITHMS.has(alg)
      ? new TextEncoder().encode(secretKey)
      : await importPKCS8(secretKey, alg)

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg, typ: "JWT" })
      .sign(key)

    return { token }
  },
} satisfies ToolDefinition
