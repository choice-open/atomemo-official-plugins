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
| Edge Functions | 1 | 按名称调用 Edge Function（body、method、headers） |
| 认证工具 | 22 | 登录、注册、登出、获取用户/会话、重置密码、OTP、设置会话、ID Token 登录、OAuth 登录、JWT 声明、OAuth Admin 等 |
| 其他 | 0 | （无 Demo 工具） |

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

**Edge Functions（1 个）**

| 工具名 | 说明 |
|--------|------|
| **supabase-invoke-edge-function** | 按名称调用已部署的 Supabase Edge Function（Deno）。支持 function_name、body（JSON）、method（POST/GET/PUT/PATCH/DELETE）、headers（JSON）。 |

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

---

### 1.4.1 Using filters 详细说明

在 **supabase-query**、**supabase-update**、**supabase-delete** 中，`filters` 参数为 JSON 字符串，用于筛选行。支持两种写法。

#### 格式一：对象（多列等值，AND）

传入一个 JSON 对象，键为列名，值为要相等的值。多个键值之间为 **AND** 关系。`null` / `undefined` 的键会被忽略。

| 示例 | 含义 |
|------|------|
| `{}` | 无过滤（等价于不填 filters） |
| `{"id": 1}` | `id = 1` |
| `{"status": "active", "tenant_id": "t1"}` | `status = 'active' AND tenant_id = 't1'` |
| `{"created_at": "2024-01-01T00:00:00Z"}` | 按时间等值 |

#### 格式二：数组（高级条件）

传入 JSON 数组，每项为一条条件，形如 `{ "op", "column?", "value?" }`。数组内条件按顺序应用，等效为 **AND**（除 `or` 见下）。支持的操作符如下。

| op | 说明 | column | value 类型 | 示例 |
|----|------|--------|------------|------|
| **eq** | 等于 | 必填 | 任意（非 null/undefined 才应用） | `{"op":"eq","column":"id","value":1}` |
| **neq** | 不等于 | 必填 | 任意 | `{"op":"neq","column":"status","value":"archived"}` |
| **gt** | 大于 | 必填 | 任意 | `{"op":"gt","column":"age","value":18}` |
| **gte** | 大于等于 | 必填 | 任意 | `{"op":"gte","column":"score","value":60}` |
| **lt** | 小于 | 必填 | 任意 | `{"op":"lt","column":"created_at","value":"2024-12-31"}` |
| **lte** | 小于等于 | 必填 | 任意 | `{"op":"lte","column":"count","value":100}` |
| **like** | 区分大小写模糊匹配（SQL LIKE） | 必填 | 字符串 | `{"op":"like","column":"name","value":"%张%"}` |
| **ilike** | 不区分大小写模糊匹配 | 必填 | 字符串 | `{"op":"ilike","column":"email","value":"%@example.com"}` |
| **is** | 是否为 null/true/false | 必填 | `true` / `false` / `null` | `{"op":"is","column":"deleted_at","value":null}` |
| **in** | 在给定列表中 | 必填 | **数组** | `{"op":"in","column":"status","value":["draft","pending"]}` |
| **contains** | 包含（JSON/数组/范围） | 必填 | 字符串 / 数组 / 对象 | `{"op":"contains","column":"tags","value":["a","b"]}` |
| **containedBy** | 被包含于 | 必填 | 字符串 / 数组 / 对象 | `{"op":"containedBy","column":"path","value":["a","b","c"]}` |
| **or** | 括号内条件 OR（PostgREST 表达式） | **不填** | 字符串（表达式） | `{"op":"or","value":"(status.eq.draft,status.eq.pending)"}` |

**组合示例：**

```json
[
  {"op":"gte","column":"created_at","value":"2024-01-01"},
  {"op":"lte","column":"created_at","value":"2024-12-31"},
  {"op":"in","column":"status","value":["active","pending"]},
  {"op":"ilike","column":"name","value":"%test%"}
]
```

表示：`created_at >= '2024-01-01' AND created_at <= '2024-12-31' AND status IN ('active','pending') AND name ILIKE '%test%'`。

**`or` 说明**：`value` 为 PostgREST 的 filter 表达式字符串，例如 `(col.eq.1,col.eq.2)` 表示该列等于 1 或 2。与数组内其他项仍是 AND 关系。

---

### 1.4.2 Using modifiers 详细说明

仅在 **supabase-query** 中生效，用于排序、分页、返回形式和执行计划。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **order_by** | string | 无 | 排序：`列名.asc` 或 `列名.desc`。不填则不排序。 |
| **limit** | integer | 100 | 最多返回行数，范围 1–1000。 |
| **offset** | integer | 0 | 跳过前 N 行，与 limit 一起实现分页。 |
| **return_mode** | string | `multiple` | 返回形式：`multiple`（数组）、`single`（单行，无/多行报错）、`maybeSingle`（单行或 null）。 |
| **return_format** | string | `json` | 数据格式：`json` 或 `csv`。 |
| **explain** | boolean | false | 为 true 时返回执行计划（不返回数据），需项目开启 `db_plan_enabled`。 |

#### order_by

- 格式：`列名.方向`，方向为 **asc**（升序）或 **desc**（降序）。
- 不填或空字符串：不添加 `order`，由数据库默认顺序决定。
- 仅填列名（无 `.`）：按该列**升序**。

| 输入 | 效果 |
|------|------|
| `created_at.desc` | 按 `created_at` 降序（新在前） |
| `created_at.asc` | 按 `created_at` 升序 |
| `name.asc` | 按 `name` 升序 |
| `score.desc` | 按 `score` 降序（高在前） |

#### limit 与 offset（分页）

- 内部实现为 PostgREST 的 `range(offset, offset + limit - 1)`。
- 示例：`limit=10`, `offset=20` → 第 21–30 行。
- 第一页：`offset=0`, `limit=10`；第二页：`offset=10`, `limit=10`。

#### return_mode

| 值 | 行为 |
|----|------|
| **multiple** | 返回数组 `[]`，可能 0 行或多行。 |
| **single** | 期望恰好 1 行；0 行或多行时 PostgREST 会报错，工具返回该错误。 |
| **maybeSingle** | 0 行时返回 `null`，1 行时返回该行；多行时报错。 |

#### return_format

| 值 | 返回 |
|----|------|
| **json** | 数据为 JSON（数组或单对象）。 |
| **csv** | 数据为 CSV 字符串。 |

#### explain

- 设为 `true` 时，不执行实际查询，而是返回该查询的**执行计划**（JSON）。
- 用于分析性能；需在 Supabase 项目中启用 `db_plan_enabled`，否则可能报错。

---

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
| **Invoke Edge Function** | 调用 Supabase Edge Function（Deno） | ✅ 完成（supabase-invoke-edge-function：function_name、body、method、headers） |
| **CORS headers** | Edge Function 的 CORS 配置 | ⚠️ 需在 Edge Function 内自行配置 |
| **Update authorization token** | 更新调用时的授权 token | ✅ 使用凭证中的 API Key，自动带 Authorization |

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

- **本插件**：已实现 **凭证**（supabase-connection）、**数据库** 6 项能力（Query / Insert / Update / Upsert / Delete / RPC，含 filters 与 modifiers）、**Edge Functions** 1 项（supabase-invoke-edge-function）、**认证** 22 个工具（登录、注册、登出、获取用户/会话、重置密码、OTP 验证与发起、设置会话、更新用户、重发 OTP、code 换 session、匿名登录、ID Token 登录、OAuth 登录、JWT 声明、OAuth Admin 六项）。未实现：Realtime、Storage、Analytics、Vector；Auth 的 SSO/Web3、MFA、Auth Admin、OAuth Server。
- **图例**：✅ 完成 = 已封装为工具或凭证；⚠️ 部分完成 = 仅覆盖该能力的一部分；❌ 未实现 = 尚未封装。
- **扩展**：若需增加能力，可参考第二节表格，在 `src/tools/` 中新增工具并复用现有凭证，在 `src/index.ts` 中注册。

---

*文档依据：Supabase JavaScript API Reference（v2.0）及本插件代码与 package.json。*
