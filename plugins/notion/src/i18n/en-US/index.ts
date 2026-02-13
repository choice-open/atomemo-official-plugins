import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Notion",
  PLUGIN_DESCRIPTION: "Integrate Notion in Atomemo",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Notion Credential",
  CREDENTIAL_LLM_DESCRIPTION:
    "Credential used to authenticate requests to the Notion API.",

  // Icon
  ICON_DISPLAY_NAME: "Icon",
  ICON_LLM_DESCRIPTION: "The icon for the page (emoji or external URL)",

  // Sort
  SORT_DISPLAY_NAME: "Sort",
  SORT_LLM_DESCRIPTION:
    "Optional sort applied to results. Notion search supports sorting by last_edited_time.",
  SORT_DIRECTION_DISPLAY_NAME: "Sort by Direction",
  SORT_DIRECTION_OPTION_ASCENDING: "Ascending",
  SORT_DIRECTION_OPTION_DESCENDING: "Descending",
  SORT_ENABLE_DISPLAY_NAME: "Enable Sort",
  SORT_ENABLE_HINT: "Whether to enable sorting of results.",
  SORT_ENABLE_LLM_DESCRIPTION:
    "A boolean indicating whether to enable sorting of results. Default is false.",

  // Page Size
  PAGE_SIZE_DISPLAY_NAME: "Page Size",
  PAGE_SIZE_LLM_DESCRIPTION:
    "Number of results per page (1-100). Defaults to 100.",
  RETURN_ALL_DISPLAY_NAME: "Return All",
  RETURN_ALL_HINT: "Whether to return all results, ignoring page size.",
  RETURN_ALL_LLM_DESCRIPTION:
    "A boolean indicating whether to return all results, ignoring the page size. Default is false.",

  // Page ID
  PAGE_ID_DISPLAY_NAME: "Page ID",
  PAGE_ID_LLM_DESCRIPTION:
    "The ID of the Notion page to retrieve. Accepts dashed or non-dashed UUID formats.",

  // Simplify Output
  SIMPLIFY_OUTPUT_DISPLAY_NAME: "Simplify Output",
  SIMPLIFY_OUTPUT_HINT:
    "Whether to simplify the output to only include key values. Default is off, returning the full API response.",
  SIMPLIFY_OUTPUT_LLM_DESCRIPTION:
    "A boolean indicating whether to simplify the output to only include key values. Default is false.",

  // Get Page
  GET_PAGE_FILTER_PROPERTIES_DISPLAY_NAME: "Filter Properties (IDs or names)",
  GET_PAGE_FILTER_PROPERTIES_LLM_DESCRIPTION:
    "Optional list of page property value IDs or property names to include in the response. Use to limit returned properties. Example: ['iAk8','Title'].",
  GET_PAGE_TOOL_DISPLAY_NAME: "Retrieve Notion Page",
  GET_PAGE_TOOL_DESCRIPTION: "Retrieve a Notion page by ID.",

  // Get Child Blocks
  GET_CHILD_BLOCKS_BLOCK_ID_DISPLAY_NAME: "Block ID",
  GET_CHILD_BLOCKS_BLOCK_ID_LLM_DESCRIPTION:
    "The ID of the parent block whose child blocks will be retrieved.",
  GET_CHILD_BLOCKS_TOOL_DISPLAY_NAME: "Get Notion Block Child Blocks",
  GET_CHILD_BLOCKS_TOOL_DESCRIPTION:
    "Retrieve child blocks for a Notion block.",

  // Search Databases
  SEARCH_DATABASES_FILTER_LLM_DESCRIPTION:
    "Filter is fixed to return only databases (data sources).",
  SEARCH_DATABASES_QUERY_DISPLAY_NAME: "Query",
  SEARCH_DATABASES_QUERY_LLM_DESCRIPTION:
    "Search term to filter databases (data sources) by title. If omitted, returns all.",
  SEARCH_DATABASES_TOOL_DISPLAY_NAME: "Search Notion Databases",
  SEARCH_DATABASES_TOOL_DESCRIPTION:
    "Search Notion databases (data sources) by text query.",

  // Search Pages
  SEARCH_PAGES_FILTER_LLM_DESCRIPTION: "Filter is fixed to return only pages.",
  SEARCH_PAGES_QUERY_DISPLAY_NAME: "Search Text",
  SEARCH_PAGES_QUERY_LLM_DESCRIPTION:
    "Search term to filter pages by title or content. If omitted, returns all accessible pages.",
  SEARCH_PAGES_ENABLE_FILTER_DISPLAY_NAME: "Enable Filter",
  SEARCH_PAGES_FILTERS_DISPLAY_NAME: "Filters",
  SEARCH_PAGES_FILTERS_HINT:
    'The value of the property to filter the results by. Possible values are limited to either "page" or "data_source"',
  SEARCH_PAGES_TOOL_DISPLAY_NAME: "Search Notion Pages",
  SEARCH_PAGES_TOOL_DESCRIPTION: "Search Notion pages by text query.",

  // Get Database
  GET_DATABASE_DATABASE_ID_DISPLAY_NAME: "Database ID",
  GET_DATABASE_DATABASE_ID_LLM_DESCRIPTION:
    "The ID of the Notion database to retrieve.",
  GET_DATABASE_TOOL_DISPLAY_NAME: "Get Notion Database",
  GET_DATABASE_TOOL_DESCRIPTION: "Retrieve a Notion database by ID.",

  // Update Page
  UPDATE_PAGE_TOOL_DISPLAY_NAME: "Notion Update Page in Database",
  UPDATE_PAGE_TOOL_DESCRIPTION:
    "Update properties or archive a Notion page in a database.",

  // Append Blocks
  APPEND_BLOCKS_BLOCK_ID_DISPLAY_NAME: "Block ID",
  APPEND_BLOCKS_BLOCK_ID_LLM_DESCRIPTION:
    "The ID of the parent block to append children to",
  APPEND_BLOCKS_AFTER_DISPLAY_NAME: "After",
  APPEND_BLOCKS_AFTER_LLM_DESCRIPTION:
    "The ID of the existing block that the new blocks should be appended after",
  APPEND_BLOCKS_TOOL_DISPLAY_NAME: "Notion Append Blocks",
  APPEND_BLOCKS_TOOL_DESCRIPTION:
    "Append child blocks to an existing Notion block.",

  // Create Page in Database
  CREATE_PAGE_IN_DATABASE_PARENT_ID_DISPLAY_NAME: "Parent Data Source ID",
  CREATE_PAGE_IN_DATABASE_PARENT_ID_LLM_DESCRIPTION:
    "The ID of the parent data source (database) where the new page will be created.",
  CREATE_PAGE_IN_DATABASE_TOOL_DISPLAY_NAME: "Notion Create Page in Database",
  CREATE_PAGE_IN_DATABASE_TOOL_DESCRIPTION:
    "Create a new page inside a Notion database (data source).",

  // Create Page
  CREATE_PAGE_PARENT_PAGE_ID_DISPLAY_NAME: "Parent Page ID",
  CREATE_PAGE_PARENT_PAGE_ID_LLM_DESCRIPTION:
    "The ID of the parent page where the new page will be created.",
  CREATE_PAGE_TOOL_DISPLAY_NAME: "Notion Create Page",
  CREATE_PAGE_TOOL_DESCRIPTION: "Create a new Notion page under a parent page.",

  // Query Database
  QUERY_DATABASE_DATA_SOURCE_ID_DISPLAY_NAME: "Data Source ID",
  QUERY_DATABASE_DATA_SOURCE_ID_LLM_DESCRIPTION:
    "The ID of the Notion data source (database or wiki) to query.",
  QUERY_DATABASE_FILTER_PROPERTIES_DISPLAY_NAME:
    "Filter Properties (IDs or names)",
  QUERY_DATABASE_FILTER_PROPERTIES_LLM_DESCRIPTION:
    "Optional list of property IDs or names to include in the response. Helps limit returned properties.",
  QUERY_DATABASE_SORTS_DISPLAY_NAME: "Sorts",
  QUERY_DATABASE_SORTS_LLM_DESCRIPTION:
    "Optional sort rules. Each rule can target a property or a timestamp (created_time or last_edited_time).",
  QUERY_DATABASE_SORT_RULE_DISPLAY_NAME: "Sort rule",
  QUERY_DATABASE_SORT_RULE_PROPERTY_DISPLAY_NAME: "Property",
  QUERY_DATABASE_SORT_RULE_PROPERTY_LLM_DESCRIPTION:
    "Database property ID or name to sort by (omit if using timestamp).",
  QUERY_DATABASE_SORT_RULE_TIMESTAMP_DISPLAY_NAME: "Timestamp",
  QUERY_DATABASE_SORT_RULE_TIMESTAMP_LLM_DESCRIPTION:
    "Timestamp to sort by when not using a property field.",
  QUERY_DATABASE_SORT_RULE_DIRECTION_DISPLAY_NAME: "Direction",
  QUERY_DATABASE_SORT_RULE_DIRECTION_LLM_DESCRIPTION: "Sort direction.",
  QUERY_DATABASE_FILTER_DISPLAY_NAME: "Filter",
  QUERY_DATABASE_FILTER_LLM_DESCRIPTION:
    "Optional filter using and/or groups or property/timestamp filters. Follow Notion data source filter syntax.",
  QUERY_DATABASE_TOOL_DISPLAY_NAME: "Query Notion Data Source",
  QUERY_DATABASE_TOOL_DESCRIPTION:
    "Query a Notion database (data source) with filters and sorts.",

  // Blocks - Heading
  BLOCKS_HEADING_IS_TOGGLEABLE_HINT:
    "Whether the heading can be toggled to show/hide nested content",
  BLOCKS_URL_HINT: "URL of the external resource to embed or link to",

  // Blocks - Types
  BLOCKS_PARAGRAPH_DISPLAY_NAME: "Paragraph",
  BLOCKS_HEADING_1_DISPLAY_NAME: "Heading 1",
  BLOCKS_HEADING_2_DISPLAY_NAME: "Heading 2",
  BLOCKS_HEADING_3_DISPLAY_NAME: "Heading 3",
  BLOCKS_BULLETED_LIST_DISPLAY_NAME: "Bulleted List",
  BLOCKS_NUMBERED_LIST_DISPLAY_NAME: "Numbered List",
  BLOCKS_QUOTE_DISPLAY_NAME: "Quote",
  BLOCKS_TO_DO_DISPLAY_NAME: "To Do",
  BLOCKS_TO_DO_CHECKED_HINT: "Whether the to-do item is checked/completed",
  BLOCKS_TOGGLE_DISPLAY_NAME: "Toggle",
  BLOCKS_TEMPLATE_DISPLAY_NAME: "Template",
  BLOCKS_CALLOUT_DISPLAY_NAME: "Callout",
  BLOCKS_CALLOUT_ICON_HINT:
    "Type of icon: 'emoji' for emoji characters or 'external' for image files",
  BLOCKS_CODE_DISPLAY_NAME: "Code",
  BLOCKS_CODE_LANGUAGE_HINT:
    "Programming language for syntax highlighting (e.g., javascript, python, java)",
  BLOCKS_CODE_CAPTION_HINT:
    "Optional caption text displayed below the code block",
  BLOCKS_EQUATION_DISPLAY_NAME: "Equation",
  BLOCKS_EQUATION_EXPRESSION_HINT:
    "KaTeX-compatible mathematical expression (e.g., e=mc^2)",
  BLOCKS_BREADCRUMB_DISPLAY_NAME: "Breadcrumb",
  BLOCKS_DIVIDER_DISPLAY_NAME: "Divider",
  BLOCKS_TABLE_OF_CONTENTS_DISPLAY_NAME: "Table of Contents",
  BLOCKS_EMBED_DISPLAY_NAME: "Embed",
  BLOCKS_BOOKMARK_DISPLAY_NAME: "Bookmark",
  BLOCKS_IMAGE_DISPLAY_NAME: "Image",
  BLOCKS_VIDEO_DISPLAY_NAME: "Video",
  BLOCKS_PDF_DISPLAY_NAME: "PDF",
  BLOCKS_FILE_DISPLAY_NAME: "File",
  BLOCKS_AUDIO_DISPLAY_NAME: "Audio",
  BLOCKS_LINK_TO_PAGE_DISPLAY_NAME: "Link to Page",
  BLOCKS_LINK_TO_PAGE_PAGE_ID_HINT: "UUID of the Notion page to link to",
  BLOCKS_SYNCED_BLOCK_DISPLAY_NAME: "Synced Block",
  BLOCKS_SYNCED_BLOCK_BLOCK_ID_HINT:
    "UUID of the original synced block to reference",
  BLOCKS_COLUMN_LIST_DISPLAY_NAME: "Column List",
  BLOCKS_COLUMN_DISPLAY_NAME: "Column",
  BLOCKS_COLUMN_WIDTH_RATIO_HINT:
    "Relative width of this column (0-1, defaults to equal widths)",
  BLOCKS_TABLE_DISPLAY_NAME: "Table",
  BLOCKS_TABLE_TABLE_WIDTH_HINT:
    "Number of columns in the table (cannot be changed after creation)",
  BLOCKS_TABLE_HAS_COLUMN_HEADER_HINT:
    "Whether the first row appears visually distinct as a header",
  BLOCKS_TABLE_HAS_ROW_HEADER_HINT:
    "Whether the first column appears visually distinct as a header",
  BLOCKS_TABLE_ROW_DISPLAY_NAME: "Table Row",
  BLOCKS_TABLE_ROW_CELLS_HINT:
    "Array of cell contents in horizontal display order",
  BLOCKS_CHILDREN_DISPLAY_NAME: "Content Blocks",
  BLOCKS_CHILDREN_HINT:
    "Array of Notion content blocks (paragraphs, headings, lists, images, etc.) to add as nested content within the page.",
  BLOCKS_CHILDREN_LLM_DESCRIPTION:
    "Array of block objects to add as content to the page",

  // Page Properties
  PAGE_PROPERTIES_VALUE_DISPLAY_NAME: "Property value",
  PAGE_PROPERTIES_VALUE_HINT:
    "Select the property type that matches the database schema, then provide the value in that shape.",
  PAGE_PROPERTIES_TITLE_DISPLAY_NAME: "Title",
  PAGE_PROPERTIES_TITLE_HINT:
    "Rich text fragments for the page title; at least one text node is required. Supports text, mentions, and equations.",
  PAGE_PROPERTIES_RICH_TEXT_DISPLAY_NAME: "Rich text",
  PAGE_PROPERTIES_RICH_TEXT_HINT:
    "Rich text array for non-title text properties. Supports text, mentions, and equations.",
  PAGE_PROPERTIES_NUMBER_DISPLAY_NAME: "Number",
  PAGE_PROPERTIES_NUMBER_HINT:
    "Numeric value; format follows the database field settings.",
  PAGE_PROPERTIES_URL_DISPLAY_NAME: "URL",
  PAGE_PROPERTIES_URL_HINT: "Full URL including protocol.",
  PAGE_PROPERTIES_SELECT_DISPLAY_NAME: "Select",
  PAGE_PROPERTIES_SELECT_HINT:
    "Use an existing option name; new options are created if the integration has access.",
  PAGE_PROPERTIES_MULTI_SELECT_DISPLAY_NAME: "Multi-select",
  PAGE_PROPERTIES_MULTI_SELECT_HINT:
    "Array of option names; new options may be created if permitted.",
  PAGE_PROPERTIES_PEOPLE_DISPLAY_NAME: "People",
  PAGE_PROPERTIES_PEOPLE_HINT:
    "Array of user or group objects; IDs must reference Notion users or groups shared with the database.",
  PAGE_PROPERTIES_EMAIL_DISPLAY_NAME: "Email",
  PAGE_PROPERTIES_EMAIL_HINT: "Valid email address string.",
  PAGE_PROPERTIES_PHONE_NUMBER_DISPLAY_NAME: "Phone number",
  PAGE_PROPERTIES_PHONE_NUMBER_HINT: "Unformatted phone number string.",
  PAGE_PROPERTIES_DATE_DISPLAY_NAME: "Date",
  PAGE_PROPERTIES_DATE_HINT:
    "ISO 8601 date/time; include end for date ranges and time_zone for timezone-aware dates.",
  PAGE_PROPERTIES_CHECKBOX_DISPLAY_NAME: "Checkbox",
  PAGE_PROPERTIES_CHECKBOX_HINT: "Boolean value to check or uncheck the box.",
  PAGE_PROPERTIES_RELATION_DISPLAY_NAME: "Relation",
  PAGE_PROPERTIES_RELATION_HINT:
    "Array of page IDs that the relation points to; source database must be shared with the integration.",
  PAGE_PROPERTIES_FILES_DISPLAY_NAME: "Files",
  PAGE_PROPERTIES_FILES_HINT:
    "Array of files; each item can be external, uploaded, or a hosted file reference with expiry_time.",
  PAGE_PROPERTIES_STATUS_DISPLAY_NAME: "Status",
  PAGE_PROPERTIES_STATUS_HINT: "Status option name from the database workflow.",
  PAGE_PROPERTIES_PLACE_DISPLAY_NAME: "Location",
  PAGE_PROPERTIES_PLACE_HINT:
    "Geographic location with coordinates; latitude and longitude are required.",
  PAGE_PROPERTIES_PROPERTIES_DISPLAY_NAME: "Page Properties",
  PAGE_PROPERTIES_PROPERTIES_LLM_DESCRIPTION:
    "Property values for the new page. Each key should match a property name in the database schema.",
} satisfies BaseTranslation

export default en_US
