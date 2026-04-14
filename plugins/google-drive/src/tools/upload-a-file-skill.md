# Upload File Tool Documentation

## Tool

- **Name**: `google-drive-upload-file`
- **Purpose**: Uploads an existing Atomemo file to Google Drive, optionally into a shared drive or folder.

## Parameters

| Name            | Type               | Required | UI Component                           | Description                                                                                                                                                | Example                                           |
| --------------- | ------------------ | -------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `credential_id` | `credential_id`    | `true`   | `credential-select`                    | Credential ID for `Google_Drive_OAuth2`.                                                                                                                   | `"cred_xxx"`                                      |
| `file`          | `file_ref`         | `true`   | file picker                            | Existing Atomemo file to upload to Google Drive.                                                                                                           | `{"__type__":"file_ref","filename":"report.pdf"}` |
| `file_name`     | `string`           | `false`  | `input`                                | Optional custom filename. If omitted, the original filename is used. If a new name omits the original extension, the extension is preserved automatically. | `"Quarterly Report"`                              |
| `drive_id`      | `resource_locator` | `false`  | resource locator (`list`, `url`, `id`) | Optional shared drive ID that determines where the upload is created.                                                                                      | `"0AxxxxxxxxxxxxxxxxxPVA"`                        |
| `folder_id`     | `resource_locator` | `false`  | resource locator (`list`, `url`, `id`) | Optional Google Drive folder ID. When provided, the file is uploaded into that folder.                                                                     | `"1AbCdEfGhIjKlMnOp"`                             |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "example-credential-id",
    "drive_id": {
      "__type__": "resource_locator",
      "cached_result_label": null,
      "cached_result_url": null,
      "mode_name": "list",
      "value": null
    },
    "file": {
      "size": 7,
      "filename": "example.txt",
      "extension": "txt",
      "source": "oss",
      "content": null,
      "__type__": "file_ref",
      "res_key": "example-res-key",
      "remote_url": null,
      "mime_type": "text/plain"
    },
    "file_name": "Example File",
    "folder_id": {
      "__type__": "resource_locator",
      "cached_result_label": "Example Folder",
      "cached_result_url": "https://drive.google.com/drive/folders/example-folder-id",
      "mode_name": "list",
      "value": "example-folder-id"
    }
  }
}
```

## Tool Output Example

```json
{
  "id": "example-file-id",
  "name": "Example File.txt",
  "mimeType": "text/plain",
  "parents": ["example-folder-id"],
  "webContentLink": "https://drive.google.com/uc?id=example-file-id&export=download",
  "webViewLink": "https://drive.google.com/file/d/example-file-id/view?usp=drivesdk",
  "createdTime": "2026-01-01T00:00:00.000Z",
  "modifiedTime": "2026-01-01T00:00:00.000Z",
  "size": "7"
}
```
