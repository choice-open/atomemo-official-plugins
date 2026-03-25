import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "JWT 工具箱",
  PLUGIN_DESCRIPTION: "签名、验证和解码 JSON Web Token (JWT)。",

  // credential
  CREDENTIAL_DISPLAY_NAME: "JWT 密钥",
  CREDENTIAL_DESCRIPTION: "用于签名和验证 JWT Token 的密钥或私钥。",
  CREDENTIAL_SECRET_KEY_DISPLAY_NAME: "密钥 / 私钥",
  CREDENTIAL_SECRET_KEY_HINT:
    "HMAC 算法：共享密钥字符串。RSA/EC/EdDSA：PEM 编码的私钥。",
  CREDENTIAL_SECRET_KEY_PLACEHOLDER: "输入密钥或粘贴 PEM 私钥",
  PARAM_CREDENTIAL_LABEL: "JWT 凭证",

  // jwt-sign tool
  JWT_SIGN_DISPLAY_NAME: "JWT Signer",
  JWT_SIGN_DESCRIPTION: "使用指定算法和声明生成签名的 JWT Token。",
  SIGN_ALGORITHM_DISPLAY_NAME: "算法",
  SIGN_ALGORITHM_HINT:
    "签名算法。HMAC 算法（HS*）使用共享密钥；RSA/EC/EdDSA 算法使用 PEM 编码的私钥。",
  SIGN_ISSUER_DISPLAY_NAME: "签发者 (iss)",
  SIGN_ISSUER_HINT: "签发者声明 (iss)，标识签发 JWT 的主体。",
  SIGN_ISSUER_PLACEHOLDER: "如 my-service",
  SIGN_SUBJECT_DISPLAY_NAME: "主题 (sub)",
  SIGN_SUBJECT_HINT: "主题声明 (sub)，标识 JWT 的主体。",
  SIGN_SUBJECT_PLACEHOLDER: "如 user-id-123",
  SIGN_AUDIENCE_DISPLAY_NAME: "受众 (aud)",
  SIGN_AUDIENCE_HINT: "受众声明 (aud)，标识 JWT 的预期接收者。",
  SIGN_AUDIENCE_PLACEHOLDER: "如 https://api.example.com",
  SIGN_EXPIRES_IN_DISPLAY_NAME: "过期时间（秒）",
  SIGN_EXPIRES_IN_HINT: "Token 从当前时间起的有效秒数。默认：1800（30 分钟）。",
  SIGN_EXPIRES_IN_PLACEHOLDER: "1800",
  SIGN_ADDITIONAL_CLAIMS_DISPLAY_NAME: "附加声明",
  SIGN_ADDITIONAL_CLAIMS_HINT: "以 JSON 对象形式添加额外的 JWT 载荷声明。",
  SIGN_ADDITIONAL_CLAIMS_PLACEHOLDER: "JSON 格式的额外声明",

  // jwt-verify tool
  JWT_VERIFY_DISPLAY_NAME: "JWT Verifier",
  JWT_VERIFY_DESCRIPTION:
    "验证 JWT Token 的签名并检查其有效性（过期时间、生效时间等）。",
  VERIFY_TOKEN_DISPLAY_NAME: "Token",
  VERIFY_TOKEN_HINT: "要验证的 JWT Token 字符串。",
  VERIFY_TOKEN_PLACEHOLDER: "eyJhbGciOiJIUzI1NiIs...",
  VERIFY_ALGORITHMS_DISPLAY_NAME: "允许的算法",
  VERIFY_ALGORITHMS_HINT: "可选限制接受的算法。留空则使用 Token 头部中的算法。",
  VERIFY_ISSUER_DISPLAY_NAME: "期望签发者 (iss)",
  VERIFY_ISSUER_HINT: "如提供，Token 的签发者声明必须匹配此值。",
  VERIFY_ISSUER_PLACEHOLDER: "如 my-service",
  VERIFY_AUDIENCE_DISPLAY_NAME: "期望受众 (aud)",
  VERIFY_AUDIENCE_HINT: "如提供，Token 的受众声明必须匹配此值。",
  VERIFY_AUDIENCE_PLACEHOLDER: "如 https://api.example.com",

  // jwt-decode tool
  JWT_DECODE_DISPLAY_NAME: "JWT Decoder",
  JWT_DECODE_DESCRIPTION:
    "解码 JWT Token，无需验证签名。适用于查看头部和载荷内容。",
  DECODE_TOKEN_DISPLAY_NAME: "Token",
  DECODE_TOKEN_HINT: "要解码的 JWT Token 字符串。",
  DECODE_TOKEN_PLACEHOLDER: "eyJhbGciOiJIUzI1NiIs...",
} satisfies Translation

export default zh_Hans
