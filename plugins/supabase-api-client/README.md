# supabase-api-client

Atomemo 官方插件，在工作流中通过 Supabase API 操作数据库（PostgREST）与认证（Auth）。

## 功能概览

| 类型     | 数量 | 说明 |
|----------|------|------|
| 凭证     | 1    | **supabase-connection**（Supabase URL + API Key，anon 或 service_role） |
| 数据库   | 6    | Query、Insert、Update、Upsert、Delete、RPC |
| 认证     | 22   | 登录/注册/登出、获取用户/会话、重置密码、OTP、OAuth、ID Token、JWT 声明、OAuth Admin 等 |

- **数据库**：支持 filters（等值对象或高级操作符）、order、limit、offset、return_mode、RPC 等。
- **认证**：邮箱密码、Magic Link/OTP、匿名登录、OAuth 登录、ID Token 登录、exchange code 换 session、JWT 声明解析；OAuth Admin 提供 OAuth 客户端 CRUD 与 secret 再生（需 service_role）。

更细的功能与官方客户端对照见 [docs/supabase-js-client-features.md](./docs/supabase-js-client-features.md)。

## 凭证

在 Atomemo 中配置 **supabase-connection**，填写：

- **supabase_url**：项目 URL（如 `https://xxx.supabase.co`）
- **supabase_key**：anon key（前端）或 service_role key（服务端/Admin 操作）

## 开发

```bash
# 安装依赖
bun install

# 运行单元测试
bun run test

# 类型检查
bun run typecheck

# 代码检查与格式化
bun run check

# 构建
bun run build
```

## 调试

- **断点调试测试**
  - 在 Cursor/VS Code 中打开「运行和调试」(Run and Debug)，选择 **Debug Vitest (current file)** 或 **Debug Vitest (all tests)**，在测试或源码里打断点后 F5 启动即可。
  - 或使用 **JavaScript 调试终端**：终端里选 “JavaScript Debug Terminal”，然后执行 `bun run test`，断点会生效。

- **打日志**
  - 在 `src/tools/*.ts` 或 `src/lib/*.ts` 里使用 `console.log` / `console.error`，运行 `bun run test` 或在实际运行插件的环境里查看输出。

- **单跑某个测试**
  - `bun run test -- --run test/index.test.ts` 只跑该文件；
  - `bun run test -- --run -t "supabase-query"` 只跑名称包含 `supabase-query` 的用例。

- **真实 Supabase**
  - 在项目根目录建 `.env`，写 `SUPABASE_URL`、`SUPABASE_KEY`，在插件或自写脚本里用 `createSupabaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)` 连真实库调试（不要提交 .env）。

## 协议

MIT
