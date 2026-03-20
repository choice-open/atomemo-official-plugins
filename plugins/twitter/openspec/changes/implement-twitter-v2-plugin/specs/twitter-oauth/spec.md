## 新增需求

### 需求：OAuth 2.0 PKCE 凭证定义
插件必须定义名为 `twitter-oauth` 的凭证，支持 OAuth 2.0。必须包含 `client_id`、`client_secret`、`access_token`、`refresh_token` 和 `expires_at` 参数。`access_token`、`refresh_token` 和 `expires_at` 参数必须在 UI 中隐藏（`display_none: true`）。

#### 场景：凭证注册到插件
- **当** 插件初始化时
- **则** 必须通过 `plugin.addCredential()` 添加名为 `twitter-oauth` 且 `oauth2: true` 的凭证定义

#### 场景：凭证参数类型正确
- **当** 用户配置 Twitter 凭证时
- **则** `client_id` 必须是必填的 `string` 类型，使用 `input` 组件
- **则** `client_secret` 必须是必填的 `encrypted_string` 类型，使用 `encrypted-input` 组件
- **则** `access_token` 和 `refresh_token` 必须是可选的 `encrypted_string` 字段，在 UI 中隐藏

### 需求：使用 PKCE 构建 OAuth 2.0 授权 URL
凭证必须实现 `oauth2_build_authorize_url`，使用 `@xdevplatform/xdk` 的 `generateCodeVerifier` 和 `generateCodeChallenge` 工具构建带 PKCE 的 Twitter OAuth 2.0 授权 URL。URL 必须指向 `https://twitter.com/i/oauth2/authorize`。

#### 场景：构建授权 URL
- **当** 使用 `client_id`、`redirect_uri` 和 `state` 调用 `oauth2_build_authorize_url` 时
- **则** 必须使用 SDK 工具生成 PKCE 的 `code_verifier` 和 `code_challenge`
- **则** 必须返回包含 `response_type=code`、提供的 `client_id`、`redirect_uri`、`state`、`code_challenge_method=S256`、生成的 `code_challenge` 以及 scope（包括 `tweet.read tweet.write users.read follows.read like.read like.write offline.access`）的 URL
- **则** 必须存储 `code_verifier` 以便后续 token 交换使用（通过返回的 `parameters_patch`）

### 需求：OAuth 2.0 Token 交换
凭证必须实现 `oauth2_get_token`，通过 `https://api.x.com/2/oauth2/token` 将授权码交换为 access token 和 refresh token。

#### 场景：成功交换 Token
- **当** 使用有效的 `code` 和 `redirect_uri` 调用 `oauth2_get_token` 时
- **则** 必须向 Twitter token 端点发送 POST 请求，包含 `grant_type=authorization_code` 和存储的 PKCE `code_verifier`
- **则** 必须返回包含 `access_token`、`refresh_token` 和 `expires_at` 的 `parameters_patch`

#### 场景：Token 交换失败
- **当** token 端点返回错误时
- **则** 必须抛出包含错误描述的 Error

### 需求：OAuth 2.0 Token 刷新
凭证必须实现 `oauth2_refresh_token`，通过 `https://api.x.com/2/oauth2/token` 刷新过期的 access token。

#### 场景：成功刷新 Token
- **当** 使用有效的 `refresh_token` 调用 `oauth2_refresh_token` 时
- **则** 必须向 token 端点发送 POST 请求，包含 `grant_type=refresh_token`
- **则** 必须返回包含新的 `access_token`、`refresh_token` 和 `expires_at` 的 `parameters_patch`

### 需求：使用官方 SDK 的 Twitter 客户端辅助工具
插件必须提供 `src/lib/require-twitter.ts` 模块，使用用户的 access token 从 `@xdevplatform/xdk` 创建 `Client`。

#### 场景：从凭证创建客户端
- **当** 使用包含 `access_token` 的有效凭证调用 `requireTwitterClient` 时
- **则** 必须返回使用 `{ accessToken }` 初始化的 `@xdevplatform/xdk` `Client` 实例

#### 场景：凭证缺失
- **当** 使用缺失或无效的凭证调用 `requireTwitterClient` 时
- **则** 必须抛出指示凭证必需的 Error
