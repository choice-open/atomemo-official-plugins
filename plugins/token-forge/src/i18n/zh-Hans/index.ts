import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "令牌锻造",
  PLUGIN_DESCRIPTION: "用于生成签名令牌（JWT 等）以进行 API 鉴权的插件",
  JWT_DISPLAY_NAME: "JWT 令牌生成",
  JWT_DESCRIPTION: "使用指定的签名算法和声明生成 JWT 令牌",
  ALGORITHM_DISPLAY_NAME: "签名算法",
  ALGORITHM_HINT: "选择 JWT 签名算法",
  ACCESS_KEY_DISPLAY_NAME: "Access Key",
  ACCESS_KEY_HINT: "用作 JWT 'iss'（签发者）声明的 Access Key",
  ACCESS_KEY_PLACEHOLDER: "例如：your_access_key",
  SECRET_KEY_DISPLAY_NAME: "Secret Key",
  SECRET_KEY_HINT:
    "用于签名 JWT 令牌的 Secret Key。HMAC 算法请提供共享密钥字符串；RSA/EC 算法请提供 PEM 格式的私钥。",
  SECRET_KEY_PLACEHOLDER: "例如：your_secret_key",
  EXPIRES_IN_DISPLAY_NAME: "过期时间（秒）",
  EXPIRES_IN_HINT: "令牌有效期（秒），默认 1800 即 30 分钟",
  EXPIRES_IN_PLACEHOLDER: "1800",
  ADDITIONAL_CLAIMS_DISPLAY_NAME: "额外声明",
  ADDITIONAL_CLAIMS_HINT:
    "要包含在载荷中的额外 JWT 声明（JSON 对象）。可覆盖 'exp' 和 'nbf'，但不可覆盖 'iss'。",
  ADDITIONAL_CLAIMS_PLACEHOLDER: "JSON 对象，例如 sub、role、scope",
} satisfies Translation

export default zh_Hans
