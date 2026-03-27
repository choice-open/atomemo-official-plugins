# Batch Update Document Tool Documentation

## Tool

- **Name**: `batch-update-document`
- **Purpose**: Applies one or more Google Docs update requests atomically.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `google_credential` | `credential_id` | `true` | credential picker | Google OAuth2 credential bound to `google-docs-oauth2`. | `"google_credential"` |
| `document_id` | `string` | `true` | `input` | Target document ID. | `"1AbCdEfGhIjKlMnOp"` |
| `operation` | `string` | `false` | `select` | Request build mode: `raw_json`, `insert_text`, `replace_all_text`, `update_text_style`. | `"insert_text"` |
| `requests_json` | `string` | `false` | `textarea` | Raw JSON array of Docs requests when `operation=raw_json`. | `"[{\"insertText\":{\"location\":{\"index\":1},\"text\":\"Hello\"}}]"` |
| `write_control_json` | `string` | `false` | `textarea` | Optional write control JSON object. | `"{\"requiredRevisionId\":\"AAABBB\"}"` |

## Structured Mode Examples

### insert_text

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "insert_text",
    "insert_text": "Hello Atomemo",
    "insert_index": 1
  }
}
```

### replace_all_text

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "replace_all_text",
    "replace_contains_text": "{{name}}",
    "replace_text": "Leo"
  }
}
```

## Raw JSON Mode Example

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "raw_json",
    "requests_json": "[{\"insertText\":{\"location\":{\"index\":1},\"text\":\"Hello\\n\"}}]"
  }
}
```
