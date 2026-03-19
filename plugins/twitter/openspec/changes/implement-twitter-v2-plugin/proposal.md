## 为什么

Twitter 插件目前仅包含一个 demo 占位工具。我们需要实现完整的 Twitter/X API v2 集成，使用户可以通过 Atomemo 平台阅读推文、发布推文、管理用户和搜索内容。

## 变更内容

- 添加 Twitter API v2 的 OAuth 2.0 凭证支持（基于 PKCE 的用户上下文授权流程）
- 实现推文管理工具：创建推文、删除推文、获取推文、搜索推文、用户时间线
- 实现用户工具：获取用户信息、获取关注者、获取正在关注
- 实现点赞/取消点赞和转推/取消转推工具
- 添加共享参数和 Twitter API 客户端辅助库
- 更新 i18n 翻译（en-US、zh-Hans）覆盖所有新工具
- 移除 demo 占位工具
- 使用官方 `@xdevplatform/xdk` SDK 进行类型化 API 调用，内置分页和重试支持

## 能力

### 新增能力
- `twitter-oauth`：基于 PKCE 授权码流程的 OAuth 2.0 凭证定义，用于 Twitter API v2
- `tweet-management`：创建、删除、获取和搜索推文；用户时间线
- `user-management`：通过 ID/用户名获取用户信息，列出关注者和正在关注
- `tweet-interactions`：点赞/取消点赞推文，转推/取消转推

### 修改的能力
<!-- 无需修改现有能力 — 这是全新实现 -->

## 影响范围

- **代码**：用完整的工具套件替换 `src/tools/demo.ts`；新增 `src/credentials/`、`src/lib/`、`src/tools/_shared/`
- **依赖**：新增 `@xdevplatform/xdk`（X 平台官方 TypeScript SDK）
- **API**：Twitter API v2 端点（OAuth 2.0 PKCE、推文、用户、点赞、转推）
- **国际化**：为约 12 个工具新增 en-US 和 zh-Hans 翻译键
