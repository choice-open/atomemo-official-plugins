# Get Document Tool Documentation

## Tool

- **Name**: `get-document`
- **Purpose**: Retrieves the latest content and metadata of a Google Docs document.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `google_credential` | `credential_id` | `true` | credential picker | Google OAuth2 credential bound to `google-docs-oauth2`. | `"google_credential"` |
| `document_id` | `string` | `true` | `input` | Google Docs document ID from URL. | `"1AbCdEfGhIjKlMnOp"` |
| `include_tabs_content` | `boolean` | `false` | `switch` | Whether to return content in `tabs` field for multi-tab docs. | `true` |

## Tool Input Example

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "include_tabs_content": true
  }
}
```

## Tool Output Example

```json
{
  "documentId": "1AbCdEfGhIjKlMnOp",
  "title": "Project Weekly Report",
  "revisionId": "AAABBBCCC",
  "tabs": []
}
```
