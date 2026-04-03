# ClickHouse Exec (DDL / Command) Tool Documentation

## Tool

- **Name**: `clickhouse-exec`
- **Purpose**: Executes **non-SELECT** statements (DDL, mutations, etc.) via `command`. Intended for workflow-controlled SQL only—do not pass untrusted end-user input directly.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `connection` | `credential_id` | `true` | credential picker | ClickHouse connection credential (`clickhouse-connection`). | `"my_connection"` |
| `statement` | `string` | `true` | `textarea` | SQL statement to execute (DDL or command). | `"CREATE TABLE IF NOT EXISTS my_db.t (id UInt64) ENGINE = MergeTree ORDER BY id"` |
| `clickhouse_settings` | `string` | `false` | `textarea` | JSON object of statement-level ClickHouse settings. | `"{\"wait_end_of_query\": 1}"` |
| `session_id` | `string` | `false` | `input` | Optional session id. | `"sess-1"` |
| `query_id` | `string` | `false` | `input` | Optional query id. | `"q-ddl-1"` |

## Tool Input Example

```json
{
  "parameters": {
    "connection": "my_connection",
    "statement": "OPTIMIZE TABLE my_db.events FINAL",
    "clickhouse_settings": "{\"wait_end_of_query\": 1}"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "message": "Statement executed successfully.",
  "error": null,
  "data": null
}
```
