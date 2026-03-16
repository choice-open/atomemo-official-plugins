# supabase-api-client

Atomemo 官方插件，在工作流中通过 Supabase API 操作数据库（PostgREST）、Storage（文件桶）与 Edge Functions。认证（Auth）工具已标注为未实现。

## 功能概览

| 类型     | 数量 | 说明 |
|----------|------|------|
| 凭证     | 1    | **supabase-connection**（Supabase URL + API Key，anon 或 service_role） |
| 数据库   | 6    | Query、Insert、Update、Upsert、Delete、RPC |
| Edge     | 1    | 调用 Edge Function |
| Storage  | 7    | 列出桶/文件、上传、下载、删除、签名 URL、公开 URL |
| Vector   | 13   | 桶/索引 CRUD、向量 put/get/list/query/delete |
| 认证     | 0    | **未实现**：Auth 16 个与 OAuth Admin 6 个在 `src/index.ts` 的 `plugin.addTool` 中已注释 |

- **数据库**：支持 filters（等值对象或高级操作符）、order、limit、offset、return_mode、RPC 等。
- **Edge**：按名称与可选 body 调用已部署的 Edge Function。
- **Storage**：列出桶与文件、上传（支持 Atomemo file_ref 或 base64/文本）、下载（返回 base64）、删除、创建签名 URL、获取公开 URL。
- **Vector**：列出/创建/获取/删除桶与索引；向量 put、get、list、query、delete。
- **认证**：**未实现**。Auth（16 个）与 OAuth Admin（6 个）在 `plugin.addTool` 中已注释，插件当前不提供认证相关工具。

更细的功能与官方客户端对照见 [docs/supabase-js-client-features.md](./docs/supabase-js-client-features.md)。

## 凭证

在 Atomemo 中配置 **supabase-connection**，填写：

- **supabase_url**：项目 URL（如 `https://xxx.supabase.co`）
- **supabase_key**：anon key（前端）或 service_role key（服务端/Admin 操作）

## 开发

```bash
# 安装依赖
bun install

# 运行单元测试（不含 e2e，无需网络）
bun run test
# 或
bun run test:unit

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
- **端到端测试**
  - 配置好 `.env` 后，在 Supabase SQL Editor 中执行 `test/e2e/crud.e2e.test.ts` 文件头注释里的建表 SQL，然后执行：`bun run test:e2e`。无 env 时 e2e 会自动跳过。
  - 默认 `bun run test` 只跑单元测试（已排除 test/e2e），e2e 需单独执行 `bun run test:e2e`。

## 协议

MIT
