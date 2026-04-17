# Google Drive Atomemo Plugin

[Google Drive](https://workspace.google.com/products/drive/) stores files, folders, and shared-drive content across Google Workspace and personal Google accounts. This plugin connects Atomemo to the [Google Drive API](https://developers.google.com/drive/api) so you can download files from Drive into Atomemo or upload existing Atomemo files into My Drive or a shared drive folder.

The plugin uses Atomemo-managed OAuth 2.0 credentials. It supports Drive file lookup via list, URL, or raw ID, and handles Google Workspace export behavior when downloading Docs-native files.

## Tools

| Tool | Description | API Reference |
| --- | --- | --- |
| **Download File** (`google-drive-download-file`) | Download a Drive file into Atomemo as a `file_ref`. For Google Docs-native files, the plugin exports them to a supported format first. | [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads) |
| **Upload File** (`google-drive-upload-file`) | Upload an existing Atomemo file to Google Drive, optionally to a specific shared drive or parent folder. | [Upload file data](https://developers.google.com/drive/api/v3/manage-uploads) |

## Credential

Configure one `Google_Drive_OAuth2` credential with:

- `client_id` required Google OAuth 2.0 Client ID
- `client_secret` required Google OAuth 2.0 Client Secret
- `access_token` managed by Atomemo during OAuth
- `refresh_token` managed by Atomemo during OAuth
- `expires_at` managed by Atomemo during OAuth refresh

## Authentication Setup

### 1. Create a Google Cloud Project

1. Open the [Google Cloud Console](https://console.cloud.google.com/)
2. Create or choose a project
3. Enable the Google Drive API for that project

### 2. Create an OAuth 2.0 Client

1. In Google Cloud, open `APIs & Services -> Credentials`
2. Create an **OAuth 2.0 Client ID**
3. Use an application type compatible with your Atomemo deployment flow
4. Add the Atomemo redirect URI when prompted by the OAuth client configuration

### 3. Configure the Atomemo Credential

Create a `Google_Drive_OAuth2` credential in Atomemo:

- **Client ID**: your Google OAuth client ID
- **Client Secret**: your Google OAuth client secret

Then run the built-in OAuth authorization flow inside Atomemo so the credential can store and refresh tokens automatically.

### Scope Note

The current plugin code requests the Google Drive scope `https://www.googleapis.com/auth/drive.readonly` during OAuth. That scope is appropriate for download and export operations.

However, this same plugin also exposes an upload tool. Because uploads typically require a write-capable Drive scope such as `drive` or `drive.file`, you should treat upload support as subject to your deployed scope configuration. This README documents the tool because it exists in the plugin, but it does not claim that the current default OAuth scope is sufficient for every upload scenario.

For official scope guidance, see [Choose Google Drive API scopes](https://developers.google.com/drive/api/guides/api-specific-auth).

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
