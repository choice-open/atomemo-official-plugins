import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createClient } from "@clickhouse/client"

type ClickHouseCredential = {
  url: string
  username?: string
  password?: string
  database?: string
}

type ToolResult = {
  success: boolean
  message: string
  error: string | null
  // use `any` here to satisfy ToolDefinition JSON shape,
  // while still keeping a consistent envelope for all tools
  data: any
}

const MAX_ROWS_LIMIT = 100_000

const SSRF_BLOCKED_HOSTS = new Set([
  "169.254.169.254", // AWS/GCP/Azure metadata
  "metadata",
  "metadata.google",
  "metadata.google.internal",
  "100.100.100.200", // Alibaba Cloud metadata
])

function validateClickHouseUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "URL must use http or https protocol"
    }
    const host = parsed.hostname.toLowerCase()
    if (SSRF_BLOCKED_HOSTS.has(host)) {
      return "URL host is not allowed for security reasons"
    }
    return null
  } catch {
    return "Invalid URL format"
  }
}

function safeParseJson<T>(
  raw: string | undefined,
  fallback: T,
): { ok: true; value: T } | { ok: false; error: string } {
  if (!raw || raw.trim() === "") return { ok: true, value: fallback }
  try {
    return { ok: true, value: JSON.parse(raw) as T }
  } catch {
    return { ok: false, error: "Invalid JSON format" }
  }
}

function getClickHouseClient(cred: ClickHouseCredential) {
  const { url, username, password, database } = cred
  const urlError = validateClickHouseUrl(url)
  if (urlError) {
    throw new Error(urlError)
  }
  return createClient({
    url,
    username: username || "default",
    password: password ?? "",
    database: database || "default",
  })
}

const credentialParam = {
  name: "connection",
  type: "credential_id" as const,
  required: true,
  display_name: {
    en_US: "ClickHouse Connection",
    zh_Hans: "ClickHouse 连接",
  },
  credential_name: "clickhouse-connection",
}

export const clickhousePingTool = {
  name: "clickhouse-ping",
  display_name: {
    en_US: "ClickHouse Ping",
    zh_Hans: "ClickHouse 连通性检查",
  },
  description: {
    en_US: "Check the health of a ClickHouse instance using the JS client.",
    zh_Hans: "使用 clickhouse-js 检查 ClickHouse 实例的连通性和健康状态。",
  },
  icon: "🩺",
  parameters: [
    credentialParam,
    {
      name: "use_select_mode",
      type: "boolean",
      required: false,
      default: false,
      display_name: {
        en_US: "Use SELECT ping (web-friendly)",
        zh_Hans: "使用 SELECT 方式 ping（适合 Web 环境）",
      },
      ui: {
        component: "switch",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const credential_id = parameters.connection
    const cred = credentials?.[credential_id] as ClickHouseCredential | undefined
    if (!cred) {
      const result: ToolResult = {
        success: false,
        message: "ClickHouse credential is missing.",
        error: "missing_credential",
        data: null,
      }
      return result
    }
    let client
    try {
      client = getClickHouseClient(cred)
    } catch (err) {
      return {
        success: false,
        message: "Invalid ClickHouse URL.",
        error: String(err),
        data: null,
      } satisfies ToolResult
    }
    try {
      const pingResult = await client.ping({
        select: Boolean(args.parameters.use_select_mode),
      })
      await client.close()
      const error =
        !pingResult.success && "error" in pingResult
          ? String(pingResult.error)
          : pingResult.success
            ? null
            : "Unknown error"
      const result: ToolResult = {
        success: pingResult.success,
        message: pingResult.success
          ? "Ping ClickHouse successfully."
          : "Ping ClickHouse failed.",
        error,
        data: {
          success: pingResult.success,
          error,
        },
      }
      return result
    } catch (error) {
      await client.close()
      const result: ToolResult = {
        success: false,
        message: "Ping ClickHouse failed with exception.",
        error: String(error),
        data: null,
      }
      return result
    }
  },
} satisfies ToolDefinition

export const clickhouseQueryJsonTool = {
  name: "clickhouse-query-json",
  display_name: {
    en_US: "ClickHouse Query (JSON)",
    zh_Hans: "ClickHouse 查询（JSON）",
  },
  description: {
    en_US: "Run a SELECT query against ClickHouse and return JSONEachRow data.",
    zh_Hans: "对 ClickHouse 执行 SELECT 查询，并以 JSONEachRow 形式返回结果。",
  },
  icon: "🔍",
  parameters: [
    credentialParam,
    {
      name: "query",
      type: "string",
      required: true,
      display_name: {
        en_US: "SQL Query",
        zh_Hans: "SQL 查询语句",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "Use {name:Type} placeholders + query_params for user input to prevent SQL injection.",
          zh_Hans: "对用户输入使用 {name:Type} 占位符配合 query_params，可防止 SQL 注入。",
        },
      },
    },
    {
      name: "query_params",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query Parameters",
        zh_Hans: "查询参数",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "JSON object matching {name:Type} placeholders in query. E.g. {\"id\": 42} for {id:UInt64}",
          zh_Hans: "与 query 中 {name:Type} 占位符对应的 JSON 对象。如 {\"id\": 42} 对应 {id:UInt64}",
        },
        placeholder: {
          en_US: '{"id": 42, "name": "foo"}',
          zh_Hans: '{"id": 42, "name": "foo"}',
        },
      },
    },
    {
      name: "clickhouse_settings",
      type: "string",
      required: false,
      display_name: {
        en_US: "ClickHouse Settings",
        zh_Hans: "ClickHouse 设置",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "JSON object for query-level settings. E.g. {\"max_execution_time\": 30}",
          zh_Hans: "查询级设置的 JSON 对象。如 {\"max_execution_time\": 30}",
        },
        placeholder: {
          en_US: '{"max_execution_time": 30}',
          zh_Hans: '{"max_execution_time": 30}',
        },
      },
    },
    {
      name: "max_rows",
      type: "number",
      required: false,
      default: 1000,
      display_name: {
        en_US: "Max Rows",
        zh_Hans: "最大行数",
      },
      ui: {
        component: "number-input",
      },
    },
    {
      name: "session_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Session ID",
        zh_Hans: "会话 ID",
      },
      ui: { component: "input", width: "full" },
    },
    {
      name: "query_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query ID",
        zh_Hans: "查询 ID",
      },
      ui: { component: "input", width: "full" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const credential_id = parameters.connection
    const cred = credentials?.[credential_id] as ClickHouseCredential | undefined
    if (!cred) {
      const result: ToolResult = {
        success: false,
        message: "ClickHouse credential is missing.",
        error: "missing_credential",
        data: null,
      }
      return result
    }
    let client
    try {
      client = getClickHouseClient(cred)
    } catch (err) {
      return {
        success: false,
        message: "Invalid ClickHouse URL.",
        error: String(err),
        data: null,
      } satisfies ToolResult
    }
    const queryParamsParsed = safeParseJson<Record<string, unknown> | undefined>(
      args.parameters.query_params as string | undefined,
      undefined,
    )
    if (!queryParamsParsed.ok) {
      return {
        success: false,
        message: "Invalid JSON in query_params.",
        error: queryParamsParsed.error,
        data: null,
      } satisfies ToolResult
    }
    const settingsParsed = safeParseJson<Record<string, unknown> | undefined>(
      args.parameters.clickhouse_settings as string | undefined,
      undefined,
    )
    if (!settingsParsed.ok) {
      return {
        success: false,
        message: "Invalid JSON in clickhouse_settings.",
        error: settingsParsed.error,
        data: null,
      } satisfies ToolResult
    }
    const max_rows = args.parameters.max_rows as number | undefined
    const effectiveMaxRows = Math.min(
      Math.max(1, max_rows ?? 1000),
      MAX_ROWS_LIMIT,
    )
    try {
      const { query } = args.parameters
      const query_params = queryParamsParsed.value
      const clickhouse_settings = settingsParsed.value

      const session_id = args.parameters.session_id as string | undefined
      const query_id = args.parameters.query_id as string | undefined
      const resultSet = await client.query({
        query,
        format: "JSONEachRow",
        query_params,
        session_id,
        query_id,
        clickhouse_settings: {
          max_result_rows: String(effectiveMaxRows),
          ...(clickhouse_settings ?? {}),
        },
      })
      const rows = (await resultSet.json()) as Array<Record<string, unknown>>
      await client.close()
      const data = {
        row_count: rows.length,
        rows,
      }
      const result: ToolResult = {
        success: true,
        message: "Query ClickHouse successfully.",
        error: null,
        data,
      }
      return result
    } catch (error) {
      await client.close()
      const result: ToolResult = {
        success: false,
        message: "Query ClickHouse failed.",
        error: String(error),
        data: null,
      }
      return result
    }
  },
} satisfies ToolDefinition

export const clickhouseExecTool = {
  name: "clickhouse-exec",
  display_name: {
    en_US: "ClickHouse Exec (DDL / Command)",
    zh_Hans: "ClickHouse 执行（DDL/命令）",
  },
  description: {
    en_US: "Execute DDL or other non-SELECT statements against ClickHouse.",
    zh_Hans: "在 ClickHouse 上执行 DDL 或其它非 SELECT 语句。",
  },
  icon: "⚙️",
  parameters: [
    credentialParam,
    {
      name: "statement",
      type: "string",
      required: true,
      display_name: {
        en_US: "SQL Statement",
        zh_Hans: "SQL 语句",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "Controlled by workflow author only. Do not pass untrusted user input directly.",
          zh_Hans: "仅由工作流作者控制，勿直接传入不可信用户输入。",
        },
      },
    },
    {
      name: "clickhouse_settings",
      type: "string",
      required: false,
      display_name: {
        en_US: "ClickHouse Settings",
        zh_Hans: "ClickHouse 设置",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "JSON object for statement-level settings. E.g. {\"wait_end_of_query\": 1}",
          zh_Hans: "语句级设置的 JSON 对象。如 {\"wait_end_of_query\": 1}",
        },
        placeholder: {
          en_US: '{"wait_end_of_query": 1}',
          zh_Hans: '{"wait_end_of_query": 1}',
        },
      },
    },
    {
      name: "session_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Session ID",
        zh_Hans: "会话 ID",
      },
      ui: { component: "input", width: "full" },
    },
    {
      name: "query_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query ID",
        zh_Hans: "查询 ID",
      },
      ui: { component: "input", width: "full" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const credential_id = parameters.connection
    const cred = credentials?.[credential_id] as ClickHouseCredential | undefined
    if (!cred) {
      const result: ToolResult = {
        success: false,
        message: "ClickHouse credential is missing.",
        error: "missing_credential",
        data: null,
      }
      return result
    }
    let client
    try {
      client = getClickHouseClient(cred)
    } catch (err) {
      return {
        success: false,
        message: "Invalid ClickHouse URL.",
        error: String(err),
        data: null,
      } satisfies ToolResult
    }
    const settingsParsed = safeParseJson<Record<string, unknown> | undefined>(
      args.parameters.clickhouse_settings as string | undefined,
      undefined,
    )
    if (!settingsParsed.ok) {
      return {
        success: false,
        message: "Invalid JSON in clickhouse_settings.",
        error: settingsParsed.error,
        data: null,
      } satisfies ToolResult
    }
    try {
      const { statement } = args.parameters
      const clickhouse_settings = settingsParsed.value

      const session_id = args.parameters.session_id as string | undefined
      const query_id = args.parameters.query_id as string | undefined
      await client.command({
        query: statement,
        clickhouse_settings: clickhouse_settings as Record<
          string,
          string | number | boolean | undefined
        >,
        session_id,
        query_id,
      })
      await client.close()
      const result: ToolResult = {
        success: true,
        message: "Statement executed successfully.",
        error: null,
        data: null,
      }
      return result
    } catch (error) {
      await client.close()
      const result: ToolResult = {
        success: false,
        message: "Execute statement failed.",
        error: String(error),
        data: null,
      }
      return result
    }
  },
} satisfies ToolDefinition

export const clickhouseInsertTool = {
  name: "clickhouse-insert-rows",
  display_name: {
    en_US: "ClickHouse Insert Rows",
    zh_Hans: "ClickHouse 插入行数据",
  },
  description: {
    en_US: "Insert JSONEachRow style rows into a ClickHouse table.",
    zh_Hans: "向 ClickHouse 表中插入 JSONEachRow 风格的多行数据。",
  },
  icon: "📥",
  parameters: [
    credentialParam,
    {
      name: "table",
      type: "string",
      required: true,
      display_name: {
        en_US: "Table Name",
        zh_Hans: "表名",
      },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "Table name or db.table. E.g. events or my_db.events",
          zh_Hans: "表名或 db.table 全限定名。如 events 或 my_db.events",
        },
        placeholder: {
          en_US: "events",
          zh_Hans: "events",
        },
      },
    },
    {
      name: "rows",
      type: "string",
      required: true,
      display_name: {
        en_US: "Rows",
        zh_Hans: "行数据",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "JSON array of row objects. Each object = one row. E.g. [{\"id\":1,\"name\":\"a\"}]",
          zh_Hans: "行对象的 JSON 数组，每个对象为一行。如 [{\"id\":1,\"name\":\"a\"}]",
        },
        placeholder: {
          en_US: '[{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}]',
          zh_Hans: '[{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}]',
        },
      },
    },
    {
      name: "columns",
      type: "string",
      required: false,
      display_name: {
        en_US: "Columns Include / Except",
        zh_Hans: "列包含 / 排除",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        hint: {
          en_US: "Optional. JSON array of column names to insert, e.g. [\"id\",\"name\"]",
          zh_Hans: "选填。要插入的列名 JSON 数组，如 [\"id\",\"name\"]",
        },
        placeholder: {
          en_US: '["id", "name"]',
          zh_Hans: '["id", "name"]',
        },
      },
    },
    {
      name: "session_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Session ID",
        zh_Hans: "会话 ID",
      },
      ui: { component: "input", width: "full" },
    },
    {
      name: "query_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query ID",
        zh_Hans: "查询 ID",
      },
      ui: { component: "input", width: "full" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const credential_id = parameters.connection
    const cred = credentials?.[credential_id] as ClickHouseCredential | undefined
    if (!cred) {
      const result: ToolResult = {
        success: false,
        message: "ClickHouse credential is missing.",
        error: "missing_credential",
        data: null,
      }
      return result
    }
    let client
    try {
      client = getClickHouseClient(cred)
    } catch (err) {
      return {
        success: false,
        message: "Invalid ClickHouse URL.",
        error: String(err),
        data: null,
      } satisfies ToolResult
    }
    const rowsParsed = safeParseJson<unknown>(args.parameters.rows as string, null)
    if (!rowsParsed.ok) {
      return {
        success: false,
        message: "Invalid JSON in rows.",
        error: rowsParsed.error,
        data: null,
      } satisfies ToolResult
    }
    const columnsParsed = safeParseJson<
      string[] | Record<string, unknown> | undefined
    >(args.parameters.columns as string | undefined, undefined)
    if (!columnsParsed.ok) {
      return {
        success: false,
        message: "Invalid JSON in columns.",
        error: columnsParsed.error,
        data: null,
      } satisfies ToolResult
    }
    const rows = Array.isArray(rowsParsed.value) ? rowsParsed.value : []
    try {
      const { table } = args.parameters
      const session_id = args.parameters.session_id as string | undefined
      const query_id = args.parameters.query_id as string | undefined
      const columns =
        columnsParsed.value === undefined ||
        (Array.isArray(columnsParsed.value) && columnsParsed.value.length === 0)
          ? undefined
          : columnsParsed.value
      await client.insert({
        table,
        values: rows,
        format: "JSONEachRow",
        columns: columns as Parameters<typeof client.insert>[0]["columns"],
        session_id,
        query_id,
      })
      await client.close()
      const data = {
        inserted_count: rows.length,
      }
      const result: ToolResult = {
        success: true,
        message: "Rows inserted successfully.",
        error: null,
        data,
      }
      return result
    } catch (error) {
      await client.close()
      const result: ToolResult = {
        success: false,
        message: "Insert rows failed.",
        error: String(error),
        data: null,
      }
      return result
    }
  },
} satisfies ToolDefinition
