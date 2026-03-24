import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Token Forge",
  PLUGIN_DESCRIPTION:
    "A plugin for generating signed tokens (JWT, etc.) for API authentication",
  JWT_DISPLAY_NAME: "JWT Token Generator",
  JWT_DESCRIPTION:
    "Generate a signed JWT token with the specified algorithm and claims",
  ALGORITHM_DISPLAY_NAME: "Signing Algorithm",
  ALGORITHM_HINT: "Select the JWT signing algorithm",
  ACCESS_KEY_DISPLAY_NAME: "Access Key",
  ACCESS_KEY_HINT: "The access key used as the JWT 'iss' (issuer) claim",
  ACCESS_KEY_PLACEHOLDER: "e.g. your_access_key",
  SECRET_KEY_DISPLAY_NAME: "Secret Key",
  SECRET_KEY_HINT:
    "The secret key used to sign the JWT token. For HMAC algorithms, provide a shared secret string; for RSA/EC algorithms, provide a PEM-encoded private key.",
  SECRET_KEY_PLACEHOLDER: "e.g. your_secret_key",
  EXPIRES_IN_DISPLAY_NAME: "Expires In (seconds)",
  EXPIRES_IN_HINT:
    "Token validity duration in seconds (default: 1800 = 30 minutes)",
  EXPIRES_IN_PLACEHOLDER: "1800",
  ADDITIONAL_CLAIMS_DISPLAY_NAME: "Additional Claims",
  ADDITIONAL_CLAIMS_HINT:
    "Additional JWT claims to include in the payload (JSON object). Can override 'exp' and 'nbf' but not 'iss'.",
  ADDITIONAL_CLAIMS_PLACEHOLDER: "JSON object, e.g. sub, role, scope",
} satisfies BaseTranslation

export default en_US
