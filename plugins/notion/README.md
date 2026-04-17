# Notion Atomemo Plugin

[Notion](https://www.notion.com/) is a collaborative workspace for notes, docs, databases, and internal knowledge. This plugin connects Atomemo to the [Notion API](https://developers.notion.com/reference) so you can search shared content, inspect database schemas, query entries, create pages, append content blocks, and update database-backed pages from inside Atomemo.

The plugin is built for practical workspace automation. A typical flow is: search for a page or data source, inspect its schema, query matching entries, then create or update pages with structured properties and rich block content.

## Tools

### Pages and Content

| Tool | Description | API Reference |
| --- | --- | --- |
| **Create Notion Page** (`notion-create-page`) | Create a standalone page under an existing parent page, with optional title, icon, and body content. | [Create a page](https://developers.notion.com/reference/post-page) |
| **Retrieve Notion Page** (`notion-get-page`) | Retrieve one page's metadata and property values. This reads properties, not the page body. | [Retrieve a page](https://developers.notion.com/reference/retrieve-a-page) |
| **Get Notion Block Child Blocks** (`notion-get-child-blocks`) | Read the child blocks for a page or block, with pagination or `return_all` support. | [Retrieve block children](https://developers.notion.com/reference/get-block-children) |
| **Notion Append Blocks** (`notion-append-blocks`) | Append paragraphs, headings, lists, toggles, media blocks, and other supported child blocks to an existing page or block. | [Append block children](https://developers.notion.com/reference/patch-block-children) |

### Databases / Data Sources

| Tool | Description | API Reference |
| --- | --- | --- |
| **Get Notion Database** (`notion-get-database`) | Retrieve the schema for a Notion database/data source so you can inspect properties before querying or writing. | [Retrieve a data source](https://developers.notion.com/reference/retrieve-a-data-source) |
| **Query Notion Data Source** (`notion-query-data-source`) | Query pages in a database/data source with filters, sorts, pagination, and optional property selection. | [Query a data source](https://developers.notion.com/reference/query-a-data-source) |
| **Notion Create Page in Database** (`notion-create-page-in-database`) | Create a new database entry with typed property values and optional child blocks. | [Create a page](https://developers.notion.com/reference/post-page) |
| **Notion Update Page in Database** (`notion-update-page-in-database`) | Update the properties of an existing database-backed page. | [Update page](https://developers.notion.com/reference/patch-page) |

### Search

| Tool | Description | API Reference |
| --- | --- | --- |
| **Search Notion Pages** (`notion-search-pages`) | Search shared Notion pages by title text, with optional query and filter behavior. | [Search by title](https://developers.notion.com/reference/post-search) |
| **Search Notion Databases** (`notion-search-databases`) | Search shared Notion databases/data sources by title text so you can discover the right target before querying. | [Search by title](https://developers.notion.com/reference/post-search) |

Note: modern Notion API docs often use the term `data source` for the table-like structure inside a database. The plugin keeps some legacy `database` wording in tool names, but the runtime behavior aligns with the current data source APIs.

## Credential

Configure one `notion` credential with:

- `api_key` required Notion integration token

The token should be an internal integration secret from your Notion integration settings. In practice, these secrets commonly start with `ntn_` or `secret_`.

## Authentication Setup

This plugin uses a Notion internal integration token. You do not need OAuth for the current plugin credential shape.

### 1. Create a Notion Integration

1. Open the [Notion integrations dashboard](https://developers.notion.com/docs/create-a-notion-integration)
2. Click `+ New integration`
3. Choose the workspace that should own the integration
4. Copy the integration secret from the integration's configuration page

### 2. Configure the Atomemo Credential

Create a `notion` credential in Atomemo:

- **API Key**: your Notion integration token

### 3. Share Content with the Integration

Notion integrations can only access pages and data sources that have explicitly been shared with them.

1. Open the target page or database in Notion
2. Open the page menu
3. Choose `Add connections`
4. Select your integration
5. Confirm access for the page and any child content you expect the plugin to manage

If a tool returns `404` or permission-related errors, the first thing to verify is whether the page or data source has actually been shared with the integration.

For official setup guidance, see [Build your first integration](https://developers.notion.com/docs/create-a-notion-integration) and the [Notion API overview](https://developers.notion.com/guides/get-started/getting-started).

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
