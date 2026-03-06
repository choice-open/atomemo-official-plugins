## 文档结构

| 章节 | 说明 |
|------|------|
| [插件使用说明](#插件使用说明) | 安装、配置凭据、在工作流中使用、典型场景示例 |
| [已实现的 Atomemo Tool 与 Credential 说明](#已实现的-atomemo-tool-与-credential-说明) | 各工具与凭据的详细参数、返回结构 |

## 插件使用说明

### 前置条件

- 已安装并运行 [Atomemo](https://atomemo.choiceform.com) 工作流平台
- 拥有可访问的 ClickHouse 实例（本地或云端），并知晓其 HTTP 接口地址（如 `http://localhost:8123`）

### 1. 安装插件

在 Atomemo 中通过插件市场添加 **ClickHouse** 插件，或从本地/私有源安装。安装完成后，插件会提供四个工具和一个连接凭据类型。

### 2. 配置 ClickHouse 连接凭据

在使用任何工具前，需要先创建 **ClickHouse 连接凭据**（`clickhouse-connection`）：

1. 在 Atomemo 的「凭据」或「设置」中新建凭据
2. 选择类型：**ClickHouse 连接**
3. 填写连接信息：
   - **ClickHouse 地址**（必填）：如 `http://localhost:8123` 或 `https://your-clickhouse.cloud`
   - **用户名**（选填，默认 `default`）
   - **密码**（选填，如有）
   - **默认数据库**（选填，默认 `default`）
4. 保存并命名该凭据（如 `生产环境 ClickHouse`）

后续在工作流中引用该凭据时，工具会自动使用其中的连接信息，无需在每个节点重复填写。

### 3. 在工作流中使用工具

在 Atomemo 工作流编辑器中，添加「工具」节点，选择对应的 ClickHouse 工具，并绑定已创建的连接凭据。

| 工具 | 典型用途 |
|------|----------|
| **ClickHouse 连通性检查** | 健康检查、连接预热、条件分支前的可用性判断 |
| **ClickHouse 查询（JSON）** | 执行 SELECT，获取分析结果、配置数据、用户画像等 |
| **ClickHouse 执行（DDL/命令）** | 建表、改表、删表、执行管理类 SQL |
| **ClickHouse 插入行数据** | 批量写入事件、日志、指标等结构化数据 |

每个工具的参数说明见下文「已实现的 Atomemo Tool 与 Credential 说明」。

### 4. 典型使用场景示例

**场景一：事件数据入库**

1. 使用 **ClickHouse 执行** 创建表（若不存在）：
   ```sql
   CREATE TABLE IF NOT EXISTS events (id UInt64, name String) ENGINE = MergeTree() ORDER BY (id)
   ```
2. 使用 **ClickHouse 插入行数据**，将上游节点输出的 JSON 数组写入 `events` 表。

**场景二：查询结果驱动后续流程**

1. 使用 **ClickHouse 查询（JSON）** 执行 SELECT，如 `SELECT * FROM users WHERE status = 'active'`
2. 将返回的 `rows` 作为下游节点的输入，用于发送通知、触发任务等。

**场景三：健康检查与容错**

1. 在工作流开始或关键步骤前，使用 **ClickHouse 连通性检查** 做 ping
2. 根据返回的 `success` 决定是否继续执行，或走降级分支。

**场景四：参数化查询与安全**

在 **ClickHouse 查询（JSON）** 中使用参数化查询，避免 SQL 注入：

- SQL：`SELECT * FROM orders WHERE user_id = {uid:UInt64}`
- `query_params`：`{ "uid": 12345 }`

### 5. 故障排查

| 现象 | 可能原因 | 建议 |
|------|----------|------|
| 连通性检查失败 | 地址错误、网络不通、防火墙拦截 | 确认 URL 可访问（如 `curl http://localhost:8123/ping`），检查端口与协议 |
| 认证失败 | 用户名/密码错误 | 核对凭据中的用户名、密码，确认 ClickHouse 用户权限 |
| 查询超时 | 数据量大、`max_result_rows` 过高 | 降低 `max_rows`，或使用更精确的 WHERE 条件 |
| 插入失败 | 表不存在、列类型不匹配、JSON 格式错误 | 先用 **ClickHouse 执行** 建表，确保 `rows` 为合法 JSON 数组且字段与表结构一致 |
| Web 环境 ping 失败 | `/ping` 端点被 CORS 或代理限制 | 在 **ClickHouse 连通性检查** 中开启「使用 SELECT 方式 ping」 |

### 6. 安全说明

| 项目 | 说明 |
|------|------|
| **SQL 注入** | `query`、`statement`、`table` 等参数直接传给 ClickHouse，不做转义。**务必**由工作流作者控制，勿将不可信用户输入直接拼接进 SQL。查询时优先使用 `query_params` 参数化。 |
| **凭据保护** | 密码等敏感信息由 Atomemo 凭据系统管理，插件不记录或转发。 |
| **连接地址** | 凭据中的 ClickHouse URL 应由管理员配置，避免指向内网或不可信目标（SSRF 风险）。 |
| **JSON 参数** | `query_params`、`clickhouse_settings`、`rows`、`columns` 需为合法 JSON，格式错误会返回通用错误信息。 |
| **max_rows 上限** | 查询工具的 `max_rows` 上限为 100,000，超出部分自动截断，避免大结果集导致内存压力。 |

---

## 已实现的 Atomemo Tool 与 Credential 说明

### 1. ClickHouse 连接凭据：`clickhouse-connection`

- **定义文件**：`src/credentials/clickhouse.ts`
- **用途**：集中管理连接 ClickHouse 的 URL、用户、密码和默认数据库。
- **参数字段**：
  - `url`（string，必填）
    - 示例：`http://localhost:8123`、`https://<cloud-endpoint>`
  - `username`（string，选填，默认 `default`）
  - `password`（string，选填，敏感）
  - `database`（string，选填，默认 `default`）

所有工具通过 `credential_id` 参数引用该凭据，不需要在工具参数里重复填这些信息。

### 2. 连通性检查工具：`clickhouse-ping`

- **定义文件**：`src/tools/clickhouse.ts` → `clickhousePingTool`
- **用途**：检查 ClickHouse 实例是否可用，适合做健康检查 / 预热。
- **参数**
  - `connection`（credential_id，必填）
    - 关联 Credential：`clickhouse-connection`
  - `use_select_mode`（boolean，选填，默认 `false`）
    - `false`：使用 `/ping` 端点（Node 环境推荐）
    - `true`：使用 `SELECT` 查询模拟 ping（Web/CORS 友好）
- **返回结构（示例）**
  ```json
  {
    "success": true,
    "message": "Ping ClickHouse successfully.",
    "details": {
      "success": true
    }
  }
  ```

### 3. 通用查询工具：`clickhouse-query-json`

- **定义文件**：`src/tools/clickhouse.ts` → `clickhouseQueryJsonTool`
- **用途**：执行 SELECT 查询，返回 `JSONEachRow` 结果列表。
- **参数**
  - `connection`（credential_id，必填）
  - `query`（string，必填）
    - 任意 SELECT 语句，例如：
      ```sql
      SELECT id, name FROM users WHERE id = {id:UInt64}
      ```
  - `query_params`（object，选填）
    - 与 SQL 占位符对应，例如：
      ```json
      { "id": 42 }
      ```
  - `clickhouse_settings`（object，选填）
    - 单次查询级别的设置，如：
      ```json
      { "max_execution_time": 30 }
      ```
  - `max_rows`（number，选填，默认 1000）
    - 内部映射到 `max_result_rows`，用于防止一次性拉取过多行。
- **返回结构（示例）**
  ```json
  {
    "success": true,
    "row_count": 2,
    "rows": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
  }
  ```
  失败时：
  ```json
  {
    "success": false,
    "message": "Query ClickHouse failed.",
    "error": "error message ..."
  }
  ```

### 4. DDL / 命令执行工具：`clickhouse-exec`

- **定义文件**：`src/tools/clickhouse.ts` → `clickhouseExecTool`
- **用途**：执行不需要返回结果集的语句，例如建表、改表、删表、简单 INSERT 等。
- **参数**
  - `connection`（credential_id，必填）
  - `statement`（string，必填）
    - 示例：
      ```sql
      CREATE TABLE IF NOT EXISTS events
      (
        event_date Date,
        user_id    UInt64,
        payload    String
      )
      ENGINE = MergeTree()
      ORDER BY (event_date, user_id)
      ```
  - `clickhouse_settings`（object，选填）
    - 如：
      ```json
      { "wait_end_of_query": 1 }
      ```
- **返回结构（示例）**
  ```json
  {
    "success": true,
    "message": "Statement executed successfully."
  }
  ```
  失败时包含：
  ```json
  {
    "success": false,
    "message": "Execute statement failed.",
    "error": "error message ..."
  }
  ```

### 5. 批量插入工具：`clickhouse-insert-rows`

- **定义文件**：`src/tools/clickhouse.ts` → `clickhouseInsertTool`
- **用途**：向指定表批量插入多行 JSON 数据（`JSONEachRow` 风格）。
- **参数**
  - `connection`（credential_id，必填）
  - `table`（string，必填）
    - 支持：`table` 或 `db.table`
  - `rows`（array<object>，必填）
    - 每个数组元素是一行，例如：
      ```json
      [
        { "event_date": "2025-01-01", "user_id": 1, "payload": "{\"foo\":\"bar\"}" },
        { "event_date": "2025-01-01", "user_id": 2, "payload": "{\"foo\":\"baz\"}" }
      ]
      ```
  - `columns`（object，选填）
    - 用于控制插入列，内部直接传给 `client.insert` 的 `columns` 参数：
    - 仅插入部分列：
      ```json
      { "include": ["event_date", "user_id"] }
      ```
      （注意：在实际实现中是直接传给 `columns`，因此推荐使用如下低阶形式：）
      ```json
      ["event_date", "user_id"]
      ```
    - 排除部分列（使用原始 `except` 结构）：
      ```json
      { "except": ["payload"] }
      ```
- **返回结构（示例）**
  ```json
  {
    "success": true,
    "message": "Rows inserted successfully.",
    "inserted_count": 2
  }
  ```
  失败时包含：
  ```json
  {
    "success": false,
    "message": "Insert rows failed.",
    "error": "error message ..."
  }
  ```

---

### 6. 会话与查询标识（session_id / query_id）

以下工具支持可选参数 `session_id` 和 `query_id`，用于会话复用和查询追踪：

- `clickhouse-query-json`
- `clickhouse-exec`
- `clickhouse-insert-rows`

---

通过以上 Credential + 四个 Tool，Atomemo 工作流可以覆盖：连通性检查、通用查询、DDL/管理操作、结构化批量写入，以及会话与查询标识控制。
