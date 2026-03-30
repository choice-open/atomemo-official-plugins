import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "JWT Toolkit",
  PLUGIN_DESCRIPTION: "Sign, verify, and decode JSON Web Tokens (JWT).",

  // credential
  CREDENTIAL_DISPLAY_NAME: "JWT Secret",
  CREDENTIAL_DESCRIPTION:
    "The secret key or private key used for signing and verifying JWT tokens.",
  CREDENTIAL_SECRET_KEY_DISPLAY_NAME: "Secret / Private Key",
  CREDENTIAL_SECRET_KEY_HINT:
    "For HMAC algorithms: the shared secret string. For RSA/EC/EdDSA: the PEM-encoded private key.",
  CREDENTIAL_SECRET_KEY_PLACEHOLDER: "Enter secret or paste PEM private key",
  PARAM_CREDENTIAL_LABEL: "JWT Credential",

  // jwt-sign tool
  JWT_SIGN_DISPLAY_NAME: "JWT Signer",
  JWT_SIGN_DESCRIPTION:
    "Generate a signed JWT token with the specified algorithm and claims.",
  SIGN_ALGORITHM_DISPLAY_NAME: "Algorithm",
  SIGN_ALGORITHM_HINT:
    "The signing algorithm to use. HMAC algorithms (HS*) use a shared secret; RSA/EC/EdDSA algorithms use a PEM-encoded private key.",
  SIGN_ISSUER_DISPLAY_NAME: "Issuer (iss)",
  SIGN_ISSUER_HINT:
    "The issuer claim (iss). Identifies the principal that issued the JWT.",
  SIGN_ISSUER_PLACEHOLDER: "e.g. my-service",
  SIGN_SUBJECT_DISPLAY_NAME: "Subject (sub)",
  SIGN_SUBJECT_HINT:
    "The subject claim (sub). Identifies the principal that is the subject of the JWT.",
  SIGN_SUBJECT_PLACEHOLDER: "e.g. user-id-123",
  SIGN_AUDIENCE_DISPLAY_NAME: "Audience (aud)",
  SIGN_AUDIENCE_HINT:
    "The audience claim (aud). Identifies the recipients that the JWT is intended for.",
  SIGN_AUDIENCE_PLACEHOLDER: "e.g. https://api.example.com",
  SIGN_EXPIRES_IN_DISPLAY_NAME: "Expires In (seconds)",
  SIGN_EXPIRES_IN_HINT:
    "Token validity duration in seconds from now. Default: 1800 (30 minutes).",
  SIGN_EXPIRES_IN_PLACEHOLDER: "1800",
  SIGN_ADDITIONAL_CLAIMS_DISPLAY_NAME: "Additional Claims",
  SIGN_ADDITIONAL_CLAIMS_HINT:
    "Extra claims to include in the JWT payload as a JSON object.",
  SIGN_ADDITIONAL_CLAIMS_PLACEHOLDER: "JSON object with extra claims",

  // jwt-verify tool
  JWT_VERIFY_DISPLAY_NAME: "JWT Verifier",
  JWT_VERIFY_DESCRIPTION:
    "Verify a JWT token's signature and check its validity (expiration, not-before, etc.).",
  VERIFY_TOKEN_DISPLAY_NAME: "Token",
  VERIFY_TOKEN_HINT: "The JWT token string to verify.",
  VERIFY_TOKEN_PLACEHOLDER: "eyJhbGciOiJIUzI1NiIs...",
  VERIFY_ALGORITHMS_DISPLAY_NAME: "Allowed Algorithms",
  VERIFY_ALGORITHMS_HINT:
    "Optionally restrict which algorithms are accepted. If empty, the algorithm from the token header is used.",
  VERIFY_ISSUER_DISPLAY_NAME: "Expected Issuer (iss)",
  VERIFY_ISSUER_HINT:
    "If provided, the token's issuer claim must match this value.",
  VERIFY_ISSUER_PLACEHOLDER: "e.g. my-service",
  VERIFY_AUDIENCE_DISPLAY_NAME: "Expected Audience (aud)",
  VERIFY_AUDIENCE_HINT:
    "If provided, the token's audience claim must match this value.",
  VERIFY_AUDIENCE_PLACEHOLDER: "e.g. https://api.example.com",

  // jwt-decode tool
  JWT_DECODE_DISPLAY_NAME: "JWT Decoder",
  JWT_DECODE_DESCRIPTION:
    "Decode a JWT token without verifying its signature. Useful for inspecting headers and payload.",
  DECODE_TOKEN_DISPLAY_NAME: "Token",
  DECODE_TOKEN_HINT: "The JWT token string to decode.",
  DECODE_TOKEN_PLACEHOLDER: "eyJhbGciOiJIUzI1NiIs...",
} satisfies BaseTranslation

export default en_US
