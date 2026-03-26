# Demo Tool Documentation

## Tool

- **Name**: `demo-tool`
- **Purpose**: Returns a test message using the provided location value.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `location` | `string` | `true` | `input` | Location text provided by the user. Supports expressions. | `"Singapore"` |

## Tool Input Example

```json
{
 "parameters": {
   "location": "Singapore"
  }
}
```

## Tool Output Example

```json
{
  "message": "Testing the plugin with location: Singapore"
}
```
