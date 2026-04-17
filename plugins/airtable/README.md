# Airtable Atomemo Plugin

[Airtable](https://www.airtable.com/) combines spreadsheet-style collaboration with relational database structure. This plugin connects Atomemo to Airtable's Web API so you can list accessible bases, retrieve base schema, search records, fetch a specific record, create records, update records, and delete records from inside Atomemo.

The plugin is built for operational workflows where you need both metadata and data access. A typical sequence is: list bases, inspect the schema for a base, search records in a target table, then create or update records using dynamic field mappings derived from the table structure.

## Tools

### Bases and Schema

| Tool | Description | API Reference |
| --- | --- | --- |
| **Get Many Bases** (`airtable-list-bases`) | List Airtable bases available to the credential, with optional permission-level filtering. | [List bases](https://airtable.com/developers/web/api/list-bases) |
| **Get Base Schema** (`airtable-get-base-schema`) | Retrieve table, field, and view schema for a base. Useful before building field mappings or searches. | [Get base schema](https://airtable.com/developers/web/api/get-base-schema) |

### Records

| Tool | Description | API Reference |
| --- | --- | --- |
| **Get A Record** (`airtable-get-record`) | Fetch a single record by base, table, and record ID. | [Get record](https://airtable.com/developers/web/api/get-record) |
| **Search Records** (`airtable-search-records`) | Search records in a table with optional `filter_by_formula`, view scoping, output field selection, sorting, and pagination behavior. | [List records](https://airtable.com/developers/web/api/list-records) |
| **Create A Record** (`airtable-create-record`) | Create a record in an Airtable table using a dynamic field mapper. | [Create records](https://airtable.com/developers/web/api/create-records) |
| **Update Record** (`airtable-update-record`) | Update an existing record by ID, with optional Airtable `typecast` behavior. | [Update record](https://airtable.com/developers/web/api/update-record) |
| **Delete A Record** (`airtable-delete-record`) | Delete a record by record ID. | [Delete record](https://airtable.com/developers/web/api/delete-record) |

## Credential

Configure one `airtable` credential with:

- `api_key` required Airtable personal access token

The plugin uses Airtable Personal Access Tokens rather than legacy API keys.

## Authentication Setup

### 1. Create a Personal Access Token

1. Open the Airtable developer hub
2. Create a new personal access token
3. Grant the token access to the bases you want Atomemo to read or write
4. Add the scopes required for your workflow

For example:

- base and record read scopes for listing bases, reading schema, and retrieving/searching records
- record write scopes for creating, updating, and deleting records
- schema read scope for base schema inspection

Official setup guide: [Creating Personal Access Tokens](https://support.airtable.com/docs/how-do-i-get-my-api-key-)

### 2. Configure the Atomemo Credential

Create an `airtable` credential in Atomemo:

- **Personal Access Token**: your Airtable PAT

### 3. Confirm Resource IDs and Permissions

Airtable base, table, field, and record IDs can all matter in automation-heavy workflows. If you need to verify them manually, see [Finding Airtable IDs](https://support.airtable.com/docs/finding-airtable-ids).

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
