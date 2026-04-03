## 背景

Twitter 插件已通过 Atomemo 插件 SDK 搭建脚手架，但仅包含一个 demo 工具。Gmail 插件提供了成熟的 OAuth2 API 插件模式，包括共享参数、凭证管理和 HTTP 客户端辅助工具。Twitter API v2 使用 OAuth 2.0 PKCE（基于 Proof Key for Code Exchange 的授权码流程）进行用户上下文操作。X 平台官方 TypeScript SDK（`@xdevplatform/xdk`）为所有 v2 端点提供了类型化的客户端绑定。

## 目标 / 非目标

**目标：**
- 完整覆盖 Twitter API v2 常用操作（推文、用户、点赞、转推）
- 实现与 Gmail 插件凭证模式一致的 OAuth 2.0 PKCE 凭证流程
- 使用官方 `@xdevplatform/xdk` SDK 进行类型化 API 调用
- 通过共享参数和 i18n 支持保持一致的用户体验

**非目标：**
- 不支持 Twitter API v1.1
- 不支持流式/实时端点（Filtered Stream、Volume Stream）
- 不支持 Twitter Ads API、Spaces API 或 Compliance API
- 不支持私信端点（后续可添加）
- 不支持媒体上传（需要分块上传流程 — 作为后续增强）

## 决策

### 1. 使用官方 X SDK（`@xdevplatform/xdk`）
**决策**：使用官方 `@xdevplatform/xdk` 包进行所有 API 调用。在每次工具调用中使用用户的 `accessToken` 创建 `Client` 实例。
**理由**：官方 SDK 为所有 v2 端点提供了类型化方法（`client.posts.create()`、`client.users.getMe()` 等），内置分页支持和 3 次自动重试。这消除了手动 URL 构造、JSON 解析和错误处理的需要。该 SDK 采用 MIT 许可，由 X 开发者平台团队维护，且轻量无重型传递依赖。
**考虑过的替代方案**：原生 `fetch` — 因 SDK 以极小代价提供了显著价值（类型、分页、重试）而被否决。

### 2. OAuth 2.0 PKCE（授权码流程）
**决策**：在凭证定义中实现 OAuth 2.0 PKCE 授权码流程，使用 SDK 的 `OAuth2`、`generateCodeVerifier` 和 `generateCodeChallenge` 工具生成 PKCE 参数。凭证的 `oauth2_build_authorize_url`、`oauth2_get_token` 和 `oauth2_refresh_token` 方法处理完整流程。
**理由**：Twitter API v2 的用户上下文端点要求使用 OAuth 2.0 PKCE。SDK 提供了内置的 PKCE 工具，无需自行实现加密逻辑。
**考虑过的替代方案**：OAuth 1.0a — 仍受支持但已弃用于 v2 端点，且实现更为复杂。

### 3. 每次调用创建客户端模式
**决策**：在每个工具的 `invoke()` 调用中通过 `requireTwitterClient()` 辅助函数创建新的 `Client({ accessToken })` 实例，参照 Gmail 的 `requireGmailClient()` 模式。
**理由**：每次工具调用可能使用不同的凭证。Client 是无状态的且创建成本低。Token 刷新由 Atomemo SDK 的凭证生命周期处理，而非 X SDK 的客户端。

### 4. 共享参数模式
**决策**：遵循 Gmail 的 `_shared/parameters.ts` 模式，用于凭证选择器、推文 ID、用户 ID、分页参数。
**理由**：减少约 12 个工具间的重复代码，确保一致的 UI 行为。

### 5. 权限范围
**决策**：请求以下 OAuth 2.0 scopes：`tweet.read`、`tweet.write`、`users.read`、`follows.read`、`like.read`、`like.write`、`offline.access`。
**理由**：覆盖所有计划中的工具能力。`offline.access` 用于获取 refresh token。

### 6. SDK API 映射
**决策**：工具到 SDK 方法的映射如下：
- 推文 CRUD：`client.posts.create()`、`.delete()`、`.getById()`、`.searchRecent()`
- 用户推文：`client.users.getPosts()`
- 用户：`client.users.getMe()`、`.getById()`、`.getByUsername()`、`.getFollowers()`、`.getFollowing()`
- 点赞：`client.users.likePost()`、`.unlikePost()`
- 转推：`client.users.repostPost()`、`.unrepostPost()`

## 风险 / 权衡

- **[Twitter API 速率限制]** → SDK 内置重试（3 次），但 429 速率限制错误仍会展示给用户。无需额外处理。
- **[Token 过期]** → OAuth2 刷新流程通过 Atomemo SDK 内置的 `oauth2_refresh_token` 凭证机制处理，与 Gmail 一致。X SDK 的 Client 不会自动刷新 Token。
- **[SDK 稳定性]** → `@xdevplatform/xdk` 当前版本为 v0.5.0（pre-1.0），API 表面可能变化。在 package.json 中锁定版本以降低风险。
- **[无媒体上传]** → 推文创建初期仅支持纯文本。SDK 支持 `client.media`，但分块上传增加了复杂性 — 作为后续增强更合适。
