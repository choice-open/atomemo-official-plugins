# Atomemo Plugin — Google Docs

通过 Google Docs 官方 API 与 OAuth2，在 Atomemo 中创建、读取并批量更新文档。

## Docs

- [Google Docs API 模块与工具清单](./docs/google-docs-api-modules.md)

## Tools

- `create-document`: 创建文档
- `get-document`: 读取文档
- `batch-update-document`: 批量更新文档（透传 Google Docs `requests[]`）

### Tool Docs

- `src/tools/docs/create-document-skill.md`
- `src/tools/docs/get-document-skill.md`
- `src/tools/docs/batch-update-document-skill.md`

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