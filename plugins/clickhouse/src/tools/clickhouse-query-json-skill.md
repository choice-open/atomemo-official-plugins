# ClickHouse Query (JSON) Tool Documentation

## Tool

- **Name**: `clickhouse-query-json`
- **Purpose**: Runs a **SELECT** (read) query and returns rows as **JSONEachRow** objects, with a hard cap on returned rows for safety.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `connection` | `credential_id` | `true` | credential picker | ClickHouse connection credential (`clickhouse-connection`). | `"my_connection"` |
| `query` | `string` | `true` | `textarea` | SQL **SELECT** statement. Prefer `{name:Type}` placeholders with `query_params` to avoid SQL injection. | `"SELECT * FROM events WHERE id = {id:UInt64} LIMIT 10"` |
| `query_params` | `string` | `false` | `textarea` | JSON object mapping placeholder names to values. | `"{\"id\": 42}"` |
| `clickhouse_settings` | `string` | `false` | `textarea` | JSON object of query-level ClickHouse settings (merged with enforced `max_result_rows`). | `"{\"max_execution_time\": 30}"` |
| `max_rows` | `number` | `false` | `number-input` | Maximum rows to return (clamped server-side, upper bound 100000; default 1000). | `500` |
| `session_id` | `string` | `false` | `input` | Optional session id for the query. | `"sess-1"` |
| `query_id` | `string` | `false` | `input` | Optional query id for tracing. | `"q-abc"` |

## Tool Input Example

```json
{
  "parameters": {
    "connection": "my_connection",
    "query": "SELECT id, name FROM my_db.events WHERE id = {id:UInt64} LIMIT 5",
    "query_params": "{\"id\": 1}",
    "clickhouse_settings": "{\"max_execution_time\": 30}",
    "max_rows": 100
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "message": "Query ClickHouse successfully.",
  "error": null,
  "data": {
    "row_count": 2,
    "rows": [
      { "id": 1, "name": "foo" },
      { "id": 2, "name": "bar" }
    ]
  }
}
```
