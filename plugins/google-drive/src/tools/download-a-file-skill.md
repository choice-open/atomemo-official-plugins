# Download File Tool Documentation

## Tool

- **Name**: `google-drive-download-file`
- **Purpose**: Downloads a file from Google Drive and returns it as an Atomemo `file_ref`.

## Parameters

| Name            | Type               | Required | UI Component                           | Description                                                                             | Example                               |
| --------------- | ------------------ | -------- | -------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| `credential_id` | `credential_id`    | `true`   | `credential-select`                    | Credential ID for `Google_Drive_OAuth2`.                                                | `"cred_xxx"`                          |
| `file_id`       | `resource_locator` | `true`   | resource locator (`list`, `url`, `id`) | Google Drive file ID. You can search, paste a Drive/Docs URL, or enter the raw file ID. | `"1yfPKl0o0f9oVUBc-r-g5vPaom9qS5QdR"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "example-credential-id",
    "file_id": {
      "__type__": "resource_locator",
      "cached_result_label": "example.txt",
      "cached_result_url": "https://drive.google.com/file/d/example-file-id/view?usp=drivesdk",
      "mode_name": "list",
      "value": "example-file-id"
    }
  }
}
```

## Tool Output Example

```json
{
  "__type__": "file_ref",
  "source": "mem",
  "filename": "example.txt",
  "content": "YSxiCjEsMg==",
  "mime_type": "text/plain",
  "extension": "txt",
  "size": 7,
  "res_key": null,
  "remote_url": null
}
```
