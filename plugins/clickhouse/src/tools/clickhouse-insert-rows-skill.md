# ClickHouse Insert Rows Tool Documentation

## Tool

- **Name**: `clickhouse-insert-rows`
- **Purpose**: Inserts multiple rows into a table using **JSONEachRow** encoding (each array element is one row object).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `connection` | `credential_id` | `true` | credential picker | ClickHouse connection credential (`clickhouse-connection`). | `"my_connection"` |
| `table` | `string` | `true` | `input` | Target table: bare name or `database.table`. | `"my_db.events"` |
| `rows` | `string` | `true` | `textarea` | JSON **array** of row objects. | `"[{\"id\":1,\"name\":\"a\"},{\"id\":2,\"name\":\"b\"}]"` |
| `columns` | `string` | `false` | `textarea` | Optional JSON array of column names to insert (subset / order). | `"[\"id\", \"name\"]"` |
| `session_id` | `string` | `false` | `input` | Optional session id. | `"sess-1"` |
| `query_id` | `string` | `false` | `input` | Optional query id. | `"q-ins-1"` |

## Tool Input Example

```json
{
  "parameters": {
    "connection": "my_connection",
    "table": "my_db.events",
    "rows": "[{\"id\": 10, \"name\": \"alpha\"}, {\"id\": 11, \"name\": \"beta\"}]",
    "columns": "[\"id\", \"name\"]"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "message": "Rows inserted successfully.",
  "error": null,
  "data": {
    "inserted_count": 2
  }
}
```
