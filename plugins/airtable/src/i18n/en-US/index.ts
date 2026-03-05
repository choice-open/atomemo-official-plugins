import type { BaseTranslation } from "../i18n-types"

const en_US = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Airtable",
  PLUGIN_DESCRIPTION:
    "Work with Airtable bases and records. List bases, retrieve schema, and create, read, search, update, upsert, and delete records.",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Airtable Personal Access Token",
  CREDENTIAL_DESCRIPTION:
    "Personal Access Token used to authenticate Airtable API requests.",
  CREDENTIAL_API_KEY_DISPLAY_NAME: "Personal Access Token",
  CREDENTIAL_API_KEY_HINT:
    "Create your token at https://airtable.com/create/tokens. Ensure it has the required scopes for the operations you want to perform.",
  CREDENTIAL_API_KEY_PLACEHOLDER:
    "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

  // Shared params
  PARAM_CREDENTIAL_LABEL: "Airtable Credential",
  PARAM_BASE_ID_LABEL: "Base ID",
  PARAM_BASE_ID_HINT:
    "Required. Base ID from the base URL, Help → API documentation, or Get Many Bases. Format: app followed by 14 alphanumeric characters (e.g. appXXXXXXXXXXXXXX).",
  PARAM_BASE_ID_PLACEHOLDER: "appXXXXXXXXXXXXXX",
  PARAM_TABLE_LABEL: "Table",
  PARAM_TABLE_HINT:
    "Required. Table name or table ID. Use the name as shown in the base, or the table ID (e.g. tblXXXXXXXXXXXXXX) from Get Base Schema.",
  PARAM_TABLE_PLACEHOLDER: "tblXXXXXXXXXXXXXX or Table Name",
  PARAM_RECORD_ID_LABEL: "Record ID",
  PARAM_RECORD_ID_HINT:
    "Required. Record ID format: rec + 14 alphanumeric characters (e.g. recXXXXXXXXXXXXXX). Find it in List/Search results as id, in the record URL, or right‑click record → Copy record link.",
  PARAM_RECORD_ID_PLACEHOLDER: "recXXXXXXXXXXXXXX",
  PARAM_FIELDS_LABEL: "Fields",
  PARAM_FIELDS_HINT:
    'Required. JSON object: keys = field names (use names, not field IDs). Values: text, number, single select (string), checkbox (boolean), date (ISO 8601). Linked records: array of record IDs, e.g. "Project": ["recXXX"]. Collaborator: user ID or email per Airtable docs. With Typecast on, strings are converted to field types and linked records can use primary field value.',
  PARAM_TYPECAST_LABEL: "Typecast",
  PARAM_TYPECAST_HINT:
    'When enabled, Airtable converts string values to the field type (e.g. "5" → number, "true" → checkbox) and can resolve linked records by primary field value instead of record ID. Disable when sending already-typed values to avoid unintended conversion.',
  PARAM_RETURN_ALL_LABEL: "Return All",
  PARAM_LIMIT_LABEL: "Limit",
  PARAM_LIMIT_HINT:
    "When Return All is off: max number of items to return (1–100). When Return All is on, the API uses offset-based pagination and all pages are fetched automatically.",

  // List Bases
  LIST_BASES_DISPLAY_NAME: "Get Many Bases",
  LIST_BASES_DESCRIPTION:
    "Return a list of all bases accessible to the authenticated user. Uses the List bases API: offset-based pagination when Return All is on; limit 1–100 when off. Optionally filter by permission level.",
  LIST_BASES_PERMISSION_LEVEL_LABEL: "Permission Level Filter",
  LIST_BASES_PERMISSION_LEVEL_HINT:
    "Optional. Filter results by your permission on each base: None, Read only, Commenter, Creator, or Editor. Leave empty to return all bases regardless of permission level.",

  // Get Base Schema
  GET_BASE_SCHEMA_DISPLAY_NAME: "Get Base Schema",
  GET_BASE_SCHEMA_DESCRIPTION:
    "Retrieve the schema for a specific base. Response includes all tables (id, name, primaryFieldId) and their fields (id, name, type, description, options). Base ID is required (e.g. appXXXXXXXXXXXXXX); find it in the base URL or Help → API documentation.",

  // Create Record
  CREATE_RECORD_DISPLAY_NAME: "Create A Record",
  CREATE_RECORD_DESCRIPTION: "Create a new record in an Airtable table.",

  // Get Record
  GET_RECORD_DISPLAY_NAME: "Get A Record",
  GET_RECORD_DESCRIPTION:
    "Retrieve a single record from an Airtable table by base_id, table (name or id), and record_id. Required: base_id, table, record_id.",

  // Search Records
  SEARCH_RECORDS_DISPLAY_NAME: "Search Records",
  SEARCH_RECORDS_DESCRIPTION:
    "List and filter records (List records API). Supports filterByFormula, view, fields[], sort, and pagination (pageSize up to 100, maxRecords when Limit is set).",
  SEARCH_FILTER_FORMULA_LABEL: "Filter By Formula",
  SEARCH_FILTER_FORMULA_HINT:
    "Optional. Airtable filterByFormula; only records where the formula result is non-zero, non-empty, and not #Error! are returned. Use field names in curly braces. With View, results are limited to that view then filtered. Request URL length limit (~16k characters) applies. See https://airtable.com/developers/web/api/list-records#query-filterbyformula",
  SEARCH_FILTER_FORMULA_PLACEHOLDER: "",
  SEARCH_VIEW_LABEL: "View",
  SEARCH_VIEW_HINT:
    "Optional. View name or ID. Restricts results to records in that view. If Sort is set, it overrides the view sort order. Leave empty for table default.",
  SEARCH_OUTPUT_FIELDS_LABEL: "Output Fields",
  SEARCH_OUTPUT_FIELDS_HINT:
    "Optional. Field names or IDs to return (fields[]); reduces payload. Leave empty to return all fields.",
  SEARCH_SORT_LABEL: "Sort",
  SEARCH_SORT_FIELD_LABEL: "Field",
  SEARCH_SORT_FIELD_HINT:
    "Field name or ID for sort (sort[0][field], sort[0][direction]). Add multiple rules for secondary sort (asc/desc).",
  SEARCH_SORT_DIRECTION_LABEL: "Direction",

  // Update Record
  UPDATE_RECORD_DISPLAY_NAME: "Update Record",
  UPDATE_RECORD_DESCRIPTION:
    "Update an existing record in an Airtable table by its record ID.",

  // Upsert Record
  UPSERT_RECORD_DISPLAY_NAME: "Create or Update A Record",
  UPSERT_RECORD_DESCRIPTION:
    "Create or update a record based on matching field values. If a record with matching field values is found, it will be updated; otherwise, a new record will be created.",
  UPSERT_FIELDS_TO_MERGE_ON_LABEL: "Fields to Merge On",
  UPSERT_FIELDS_TO_MERGE_ON_HINT:
    "Field names used to identify an existing record for merging. If a record with matching field values exists, it will be updated; otherwise a new record will be created.",
  UPSERT_FIELDS_TO_MERGE_ON_PLACEHOLDER: "Add field name",
  UPSERT_UPDATE_ALL_MATCHES_LABEL: "Update All Matches",
  UPSERT_UPDATE_ALL_MATCHES_HINT:
    "Whether to update all records matching the field values. If disabled, only the first match will be updated.",

  // Delete Record
  DELETE_RECORD_DISPLAY_NAME: "Delete A Record",
  DELETE_RECORD_DESCRIPTION:
    "Delete a record from an Airtable table. Required: base_id, table (name or id), record_id. Returns id and deleted as per the API.",

  // Errors (shared)
  ERROR_MISSING_CREDENTIAL:
    "Missing Airtable credential. Please select a valid Airtable credential.",
  ERROR_BASE_ID_REQUIRED: "base_id is required.",
  ERROR_TABLE_REQUIRED: "table is required.",
  ERROR_RECORD_ID_REQUIRED: "record_id is required.",

  // List Bases – permission level options
  LIST_BASES_PERMISSION_NONE: "None",
  LIST_BASES_PERMISSION_READ: "Read only",
  LIST_BASES_PERMISSION_COMMENT: "Commenter",
  LIST_BASES_PERMISSION_CREATE: "Creator",
  LIST_BASES_PERMISSION_EDIT: "Editor",

  // Search Records – sort direction options
  SEARCH_SORT_ASC: "ASC",
  SEARCH_SORT_DESC: "DESC",
} satisfies BaseTranslation

export default en_US
