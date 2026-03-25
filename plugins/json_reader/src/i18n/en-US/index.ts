import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "JSON Reader",
  PLUGIN_DESCRIPTION:
    "Read a file and parse it as a JSON object, with BOM header support",
  READ_JSON_TOOL_DISPLAY_NAME: "Read JSON",
  READ_JSON_TOOL_DESCRIPTION:
    "Parse a file_ref as JSON object. Automatically handles BOM headers and encoding detection.",
  FILE_DISPLAY_NAME: "File",
  FILE_HINT: "The file to parse as JSON",
} satisfies BaseTranslation

export default en_US
