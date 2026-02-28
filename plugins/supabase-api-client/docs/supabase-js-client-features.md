# Supabase JS 客户端功能说明

本文档说明：① 本插件（supabase-api-client）当前已实现的功能；② 官方 `@supabase/supabase-js` 客户端功能清单及在本插件中的完成状态。

---

## 一、本插件当前实现情况

**插件已接入 Supabase，提供数据库（PostgREST）与认证（Auth）能力。**

### 1.1 概览

| 类型 | 数量 | 说明 |
|------|------|------|
| 凭证 | 1 | supabase-connection（URL + API Key） |
| 数据库工具 | 6 | Query、Insert、Update、Upsert、Delete、RPC |
| 认证工具 | 22 | 登录、注册、登出、获取用户/会话、重置密码、OTP、设置会话、ID Token 登录、OAuth 登录、JWT 声明、OAuth Admin 等 |
| 其他 | 1 | Demo 工具（测试用） |

### 1.2 依赖与凭证

- **依赖**：`package.json` 已包含 `@supabase/supabase-js`。
- **凭证**：**supabase-connection**（`src/credentials/supabase-connection.ts`），包含 `supabase_url`、`supabase_key`（anon 或 service_role），供所有工具复用。

### 1.3 工具列表

**数据库（6 个）**

| 工具名 | 说明 |
|--------|------|
| **supabase-query** | SELECT 查询。支持 columns、schema、filters（对象或数组格式）、order_by、limit、offset、return_mode（multiple/single/maybeSingle）、return_format（json/csv）、explain。 |
| **supabase-insert** | 单条或批量插入。支持 schema、returning。 |
| **supabase-update** | 按条件更新。支持 values、filters、schema、returning。 |
| **supabase-upsert** | 插入或更新。支持 rows、schema、on_conflict、returning。 |
| **supabase-delete** | 按条件删除。支持 filters、schema、returning。 |
| **supabase-rpc** | 调用 Postgres 函数。支持 function_name、args（JSON）、schema。 |

**认证（22 个）**

| 工具名 | 说明 |
|--------|------|
| **supabase-auth-sign-in** | 邮箱密码登录，返回 session 与 user。 |
| **supabase-auth-sign-up** | 邮箱密码注册，支持 options（emailRedirectTo、data）。 |
| **supabase-auth-sign-out** | 登出，scope：local / global。 |
| **supabase-auth-get-user** | 获取当前用户，可选传入 JWT 校验。 |
| **supabase-auth-get-session** | 获取当前会话。 |
| **supabase-auth-reset-password** | 发送重置密码邮件，可选 redirectTo。 |
| **supabase-auth-verify-otp** | 验证 OTP（type：email/sms/magiclink/recovery 等）。 |
| **supabase-auth-set-session** | 使用 access_token、refresh_token 设置会话。 |
| **supabase-auth-update-user** | 更新已登录用户（email/password/data），需 access_token + refresh_token。 |
| **supabase-auth-resend-otp** | 重发 OTP（type：signup/email_change/sms/phone_change）。 |
| **supabase-auth-exchange-code-for-session** | 用 OAuth PKCE 的 auth code 换取 session。 |
| **supabase-auth-sign-in-anonymously** | 匿名登录。 |
| **supabase-auth-sign-in-with-otp** | 发送 magic link/OTP 邮件以登录（用户用 verify-otp 完成）。 |
| **supabase-auth-sign-in-with-id-token** | 使用 OIDC ID Token 登录（Google、Apple、Azure、Facebook、Kakao 或自定义提供商）。 |
| **supabase-auth-sign-in-with-oauth** | 发起 OAuth 登录，返回重定向 URL；回调后用 exchange-code-for-session 换 session。 |
| **supabase-auth-get-claims** | 从 JWT 解码并校验后返回用户声明（sub、email、role 等）。 |
| **supabase-auth-admin-oauth-list-clients** | 列出 OAuth 2.1 客户端（需 service_role 且启用 OAuth 服务端）。 |
| **supabase-auth-admin-oauth-create-client** | 创建 OAuth 客户端。 |
| **supabase-auth-admin-oauth-get-client** | 按 ID 获取 OAuth 客户端。 |
| **supabase-auth-admin-oauth-update-client** | 更新 OAuth 客户端。 |
| **supabase-auth-admin-oauth-delete-client** | 删除 OAuth 客户端。 |
| **supabase-auth-admin-oauth-regenerate-secret** | 重新生成 OAuth 客户端 client_secret。 |

### 1.4 Filters 与 Modifiers

- **Filters**：支持两种格式：① JSON 对象表示多列等值（如 `{"id": 1}`）；② JSON 数组表示高级条件，支持操作符：`eq`、`neq`、`gt`、`gte`、`lt`、`lte`、`like`、`ilike`、`is`、`in`、`contains`、`containedBy`、`or`（见 `src/lib/supabase-filters.ts`）。Query / Update / Delete 均使用同一套 filters 解析。
- **Modifiers**：Query 支持 `order`、`limit`、`range`（offset）、`return_mode`（multiple / single / maybeSingle）、`return_format`（json / csv）、`explain`（返回执行计划）。

### 1.5 未实现模块

Edge Functions、Realtime、Storage、Analytics、Vector 均未在本插件中封装；Auth 的**认证状态监听**（onAuthStateChange，需长连接）、SSO/Web3、MFA、Auth Admin、OAuth Server 未封装；**OAuth Admin**（OAuth 客户端 CRUD、再生 secret）已封装。

---

## 二、官方 @supabase/supabase-js 功能清单与完成状态

以下为官方 JS 客户端在文档中暴露的主要能力；**「本插件」**列标记该能力在本插件中是否已实现。

### 2.1 数据库（Database / PostgREST）

| 能力 | 说明 | 本插件 |
|------|------|--------|
| **Fetch data** | `select(columns?, options?)` 查询表/视图 | ✅ 完成（supabase-query） |
| **Insert data** | `insert(values, options?)` 单条或批量插入 | ✅ 完成（supabase-insert） |
| **Update data** | `update(values, options)` 更新（需配合 filters） | ✅ 完成（supabase-update） |
| **Upsert data** | `upsert(values, options?)` 插入或更新 | ✅ 完成（supabase-upsert） |
| **Delete data** | `delete(options)` 删除（需配合 filters） | ✅ 完成（supabase-delete） |
| **Call Postgres function** | `rpc(fn, args, options)` 调用数据库函数 | ✅ 完成（supabase-rpc） |
| **Using filters** | `eq` / `neq` / `gt` / `gte` / `lt` / `lte` / `like` / `ilike` / `is` / `in` / `contains` / `containedBy` / `or` 等 | ✅ 完成（filters 支持对象多列 eq 或数组格式 `[{op, column, value}]`，query/update/delete 通用） |
| **Using modifiers** | `order` / `limit` / `range` / `single()` / `maybeSingle()` / CSV / `explain` | ✅ 完成（query 支持 order、limit、range、return_mode、return_format、explain；abortSignal/overrideTypes 未做） |

### 2.2 认证（Auth）

| 能力 | 说明 | 本插件 |
|------|------|--------|
| **Create a new user** | 注册新用户 | ✅ 完成（supabase-auth-sign-up） |
| **Sign in** | 邮箱密码登录 | ✅ 完成（supabase-auth-sign-in） |
| **Sign out** | 登出 | ✅ 完成（supabase-auth-sign-out） |
| **Send password reset** | 发送重置密码邮件 | ✅ 完成（supabase-auth-reset-password） |
| **Verify and log in through OTP** | 验证 OTP 并登录 | ✅ 完成（supabase-auth-verify-otp） |
| **Retrieve session / user** | 获取当前 session / user | ✅ 完成（supabase-auth-get-session、supabase-auth-get-user） |
| **Set session** | 使用 token 设置会话 | ✅ 完成（supabase-auth-set-session） |
| **Update user** | 更新用户信息 | ✅ 完成（supabase-auth-update-user，需 access_token+refresh_token） |
| **Resend OTP / Exchange auth code** | 重发 OTP、用 auth code 换 session | ✅ 完成（supabase-auth-resend-otp、supabase-auth-exchange-code-for-session） |
| **Create an anonymous user** | 匿名用户 | ✅ 完成（supabase-auth-sign-in-anonymously） |
| **Sign in through OTP** | 发起 OTP 登录（发邮件/短信） | ✅ 完成（supabase-auth-sign-in-with-otp，用户用 verify-otp 完成） |
| **Listen to auth events** | 监听认证状态变化 | ❌ 未实现（需长连接，不适合单次调用工具模型） |
| **Sign in with ID token** | 原生/ID Token 登录 | ✅ 完成（supabase-auth-sign-in-with-id-token） |
| **Sign in through OAuth** | OAuth 登录 | ✅ 完成（supabase-auth-sign-in-with-oauth，返回 URL；回调用 exchange-code-for-session） |
| **Sign in through SSO** | SSO 登录 | ❌ 未实现 |
| **Sign in through Web3** | Solana / Ethereum 等 Web3 登录 | ❌ 未实现 |
| **Get user claims from verified JWT** | 从 JWT 获取用户声明 | ✅ 完成（supabase-auth-get-claims） |
| **Link / Unlink identity** | 关联/解绑身份 | ❌ 未实现 |
| **Auth MFA** | 多因素认证：enroll、challenge、unenroll、AAL、列出 factors | ❌ 未实现 |
| **OAuth Server** | 授权详情、批准/拒绝、列出/撤销 grant | ❌ 未实现 |
| **Auth Admin** | 用户 CRUD、邀请链接、登出用户、管理 MFA factors | ❌ 未实现 |
| **OAuth Admin** | OAuth 客户端 CRUD、再生 client secret | ✅ 完成（supabase-auth-admin-oauth-*：list/create/get/update/delete/regenerate-secret，需 service_role） |

### 2.3 Edge Functions

| 能力 | 说明 | 本插件 |
|------|------|--------|
| **Invoke Edge Function** | 调用 Supabase Edge Function | ❌ 未实现 |
| **CORS headers** | Edge Function 的 CORS 配置 | ❌ 未实现 |
| **Update authorization token** | 更新调用时的授权 token | ❌ 未实现 |

### 2.4 Realtime

| 能力 | 说明 | 本插件 |
|------|------|--------|
| **Subscribe to channel** | 订阅频道 | ❌ 未实现 |
| **Unsubscribe** | 取消订阅单个或全部频道 | ❌ 未实现 |
| **Retrieve all channels** | 获取当前所有频道 | ❌ 未实现 |
| **Broadcast a message** | 向频道广播消息 | ❌ 未实现 |
| **Set authentication token** | 设置 Realtime 认证 token | ❌ 未实现 |

### 2.5 Storage（文件桶）

| 能力 | 说明 | 本插件 |
|------|------|--------|
| **Bucket CRUD** | 访问桶、列出/获取/创建/清空/更新/删除 bucket | ❌ 未实现 |
| **Upload / Replace / Move / Copy** | 上传、覆盖、移动、复制文件 | ❌ 未实现 |
| **Signed URL** | 创建单个/多个签名 URL、签名上传 URL、上传到签名 URL | ❌ 未实现 |
| **Download / Delete / List** | 下载、删除、列出文件 | ❌ 未实现 |
| **Metadata / Exists** | 检查文件是否存在、获取元数据 | ❌ 未实现 |
| **List files (v2)** | 新版列表 API | ❌ 未实现 |
| **Convert to base64** | 文件转 base64 | ❌ 未实现 |

### 2.6 Analytics Buckets

| 能力 | 说明 | 本插件 |
|------|------|--------|
| 访问/创建/列出/删除 analytics bucket | 分析数据桶管理 | ❌ 未实现 |

### 2.7 Vector Buckets（向量）

| 能力 | 说明 | 本插件 |
|------|------|--------|
| **Vector bucket** | 访问/创建/删除/获取/列出 vector bucket | ❌ 未实现 |
| **Vector index** | 创建/删除/获取/列出 vector index，访问索引 | ❌ 未实现 |
| **Vectors** | 删除/获取/列出/添加向量，向量搜索 | ❌ 未实现 |

---

## 三、小结

- **本插件**：已实现 **凭证**（supabase-connection）、**数据库** 6 项能力（Query / Insert / Update / Upsert / Delete / RPC，含 filters 与 modifiers）、**认证** 22 个工具（登录、注册、登出、获取用户/会话、重置密码、OTP 验证与发起、设置会话、更新用户、重发 OTP、code 换 session、匿名登录、ID Token 登录、OAuth 登录、JWT 声明、OAuth Admin 六项）。未实现：Edge Functions、Realtime、Storage、Analytics、Vector；Auth 的 SSO/Web3、MFA、Auth Admin、OAuth Server。
- **图例**：✅ 完成 = 已封装为工具或凭证；⚠️ 部分完成 = 仅覆盖该能力的一部分；❌ 未实现 = 尚未封装。
- **扩展**：若需增加能力，可参考第二节表格，在 `src/tools/` 中新增工具并复用现有凭证，在 `src/index.ts` 中注册。

---

*文档依据：Supabase JavaScript API Reference（v2.0）及本插件代码与 package.json。*
