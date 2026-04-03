# Create Document Tool Documentation

## Tool

- **Name**: `create-document`
- **Purpose**: Creates a new Google Docs document with the given title.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `google_credential` | `credential_id` | `true` | credential picker | Google OAuth2 credential bound to `google-docs-oauth2`. | `"google_credential"` |
| `title` | `string` | `true` | `input` | Title of the document to create. | `"Project Weekly Report"` |

## Tool Input Example

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "title": "Project Weekly Report"
  }
}
```

## Tool Output Example

```json
{
  "documentId": "1AbCdEfGhIjKlMnOp",
  "title": "Project Weekly Report"
}
```
