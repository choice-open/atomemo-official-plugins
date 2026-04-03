# ClickHouse Ping Tool Documentation

## Tool

- **Name**: `clickhouse-ping`
- **Purpose**: Checks connectivity and health of a ClickHouse server using the official JS client (`ping`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `connection` | `credential_id` | `true` | credential picker | ClickHouse connection credential (`clickhouse-connection`). | `"my_connection"` |
| `use_select_mode` | `boolean` | `false` | `switch` | When `true`, uses a SELECT-based ping (often better behind HTTP gateways). | `true` |

## Tool Input Example

```json
{
  "parameters": {
    "connection": "my_connection",
    "use_select_mode": false
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "message": "Ping ClickHouse successfully.",
  "error": null,
  "data": {
    "success": true,
    "error": null
  }
}
```
