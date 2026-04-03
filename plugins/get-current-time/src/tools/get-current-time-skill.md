# Get Current Time Tool Documentation

## Tool

- **Name**: `get-current-time`
- **Purpose**: Returns the current date and time, optionally in a specified IANA timezone and output format.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `timezone` | `string` | `false` | `input` | IANA timezone; empty uses the system default. | `"Asia/Shanghai"` |
| `format` | `string` | `false` | `select` | Primary `current_time` shape: `iso`, `locale`, `unix`, or `custom`. Default `iso`. | `"iso"` |
| `format_pattern` | `string` | `false` | `input` | When `format` is `custom`, pattern with `yyyy`, `yy`, `MM`, `dd`, `HH`, `mm`, `ss`, `SSS`. | `"yyyy-MM-dd HH:mm:ss"` |

## Tool Input Example

```json
{
  "parameters": {
    "timezone": "America/New_York",
    "format": "custom",
    "format_pattern": "yyyy-MM-dd HH:mm:ss"
  }
}
```

## Tool Output Example

```json
{
  "current_time": "2026-04-03 14:30:00.123",
  "format": "custom",
  "format_pattern": "yyyy-MM-dd HH:mm:ss",
  "iso": "2026-04-03T18:30:00.123Z",
  "locale": "4/3/2026, 2:30:00 PM",
  "unix": 1743700200,
  "timezone": "America/New_York"
}
```

When `format` is not `custom`, `format_pattern` is omitted from the output. On failure, the tool may return `{ "error": "..." }`.
