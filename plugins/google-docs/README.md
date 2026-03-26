# Atomemo Plugin - google-docs

## Docs

- [Google Docs API 模块与工具清单](./docs/google-docs-api-modules.md)

## Tools

- `create-document`: 创建文档
- `get-document`: 读取文档
- `batch-update-document`: 批量更新文档（透传 Google Docs `requests[]`）

## Usage Examples

### 1) create-document

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "title": "项目周报"
  }
}
```

### 2) get-document

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "include_tabs_content": true
  }
}
```

### 3) batch-update-document

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "requests_json": "[{\"insertText\":{\"location\":{\"index\":1},\"text\":\"Hello Atomemo\\n\"}}]"
  }
}
```

## Development

- Install dependencies:

```bash
bun install
```

- Run the unit tests:

```bash
bun run test
```

- Build the library:

```bash
bun run build
```