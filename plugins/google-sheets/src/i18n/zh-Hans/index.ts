import type { Translation } from "../i18n-types"

const zh_Hans = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Google Sheets",
  PLUGIN_DESCRIPTION: "读取、写入和管理 Google Sheets 电子表格。",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Google Sheets OAuth 2.0",
  CREDENTIAL_DESCRIPTION: "用于访问 Google Sheets API 的 OAuth 2.0 凭证。",
  CREDENTIAL_CLIENT_ID_DISPLAY_NAME: "客户端 ID",
  CREDENTIAL_CLIENT_ID_HINT:
    "在 https://console.cloud.google.com 创建 OAuth 2.0 凭证",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER: "来自 Google Cloud 的 OAuth 2.0 客户端 ID",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "客户端密钥",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "在 https://console.cloud.google.com 创建 OAuth 2.0 凭证",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER:
    "来自 Google Cloud 的 OAuth 2.0 客户端密钥",

  // Common parameters
  PARAM_CREDENTIAL_LABEL: "凭证",
  PARAM_SPREADSHEET_ID_LABEL: "电子表格 ID",
  PARAM_SPREADSHEET_ID_HINT: "Google Sheets 电子表格的 ID（可在 URL 中找到）。",
  PARAM_SPREADSHEET_ID_PLACEHOLDER:
    "例如 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  PARAM_RANGE_LABEL: "范围",
  PARAM_RANGE_HINT: "A1 表示法的范围（例如 Sheet1!A1:D10）。",
  PARAM_RANGE_PLACEHOLDER: "例如 Sheet1!A1:D10",
  PARAM_MAJOR_DIMENSION_LABEL: "主维度",
  PARAM_VALUE_RENDER_OPTION_LABEL: "值渲染选项",
  PARAM_VALUE_INPUT_OPTION_LABEL: "值输入选项",
  PARAM_VALUE_INPUT_OPTION_HINT:
    "RAW：原样存储值。USER_ENTERED：像用户输入一样解析值。",
  PARAM_VALUES_LABEL: "值",
  PARAM_VALUES_HINT: '二维 JSON 数组。例如 [["名称","年龄"],["Alice",30]]',
  PARAM_VALUES_PLACEHOLDER: '[[\"value1\",\"value2\"],[\"value3\",\"value4\"]]',

  // Read Rows
  READ_ROWS_TOOL_DISPLAY_NAME: "读取行",
  READ_ROWS_TOOL_DESCRIPTION: "从 Google Sheets 电子表格的指定范围读取值。",

  // Update Rows
  UPDATE_ROWS_TOOL_DISPLAY_NAME: "更新行",
  UPDATE_ROWS_TOOL_DESCRIPTION: "向 Google Sheets 电子表格的指定范围写入值。",

  // Append Rows
  APPEND_ROWS_TOOL_DISPLAY_NAME: "追加行",
  APPEND_ROWS_TOOL_DESCRIPTION:
    "在 Google Sheets 电子表格的表格最后一行之后追加数据行。",
  PARAM_APPEND_RANGE_HINT: "用于搜索表格边界的范围，数据将追加到表格之后。",
  PARAM_APPEND_RANGE_PLACEHOLDER: "例如 Sheet1!A:D",
  PARAM_INSERT_DATA_OPTION_LABEL: "插入数据选项",
  PARAM_INSERT_DATA_OPTION_HINT:
    "INSERT_ROWS：插入新行。OVERWRITE：覆盖现有数据。",
  PARAM_APPEND_VALUES_HINT:
    '要追加的行的二维 JSON 数组。例如 [["Alice",30],["Bob",25]]',

  // Clear Values
  CLEAR_VALUES_TOOL_DISPLAY_NAME: "清除值",
  CLEAR_VALUES_TOOL_DESCRIPTION:
    "清除 Google Sheets 电子表格中指定范围的所有值。",

  // Create Spreadsheet
  CREATE_SPREADSHEET_TOOL_DISPLAY_NAME: "创建电子表格",
  CREATE_SPREADSHEET_TOOL_DESCRIPTION: "创建一个新的 Google Sheets 电子表格。",
  PARAM_TITLE_LABEL: "标题",
  PARAM_TITLE_HINT: "新电子表格的标题。",
  PARAM_TITLE_PLACEHOLDER: "例如 我的新电子表格",
  PARAM_SHEET_TITLES_LABEL: "工作表名称（可选）",
  PARAM_SHEET_TITLES_HINT:
    "用逗号分隔的工作表名称列表。留空则使用默认单个工作表。",
  PARAM_SHEET_TITLES_PLACEHOLDER: "例如 Sheet1, Sheet2, Data",

  // Get Spreadsheet Info
  GET_SPREADSHEET_INFO_TOOL_DISPLAY_NAME: "获取电子表格信息",
  GET_SPREADSHEET_INFO_TOOL_DESCRIPTION:
    "获取 Google Sheets 电子表格的元数据和属性。",
  PARAM_INCLUDE_GRID_DATA_LABEL: "包含网格数据",
  PARAM_INCLUDE_GRID_DATA_HINT: "是否在响应中包含完整的网格数据（单元格值）。",

  // Copy Sheet
  COPY_SHEET_TOOL_DISPLAY_NAME: "复制工作表",
  COPY_SHEET_TOOL_DESCRIPTION:
    "将一个工作表从一个电子表格复制到另一个电子表格。",
  PARAM_SHEET_ID_LABEL: "工作表 ID",
  PARAM_SHEET_ID_HINT: "要复制的工作表数字 ID（在工作表 URL 中为 gid=xxx）。",
  PARAM_SOURCE_SPREADSHEET_ID_HINT: "包含要复制工作表的源电子表格 ID。",
  PARAM_DESTINATION_SPREADSHEET_ID_LABEL: "目标电子表格 ID",
  PARAM_DESTINATION_SPREADSHEET_ID_HINT: "要将工作表复制到的目标电子表格 ID。",

  // Batch Get Values
  BATCH_GET_VALUES_TOOL_DISPLAY_NAME: "批量获取值",
  BATCH_GET_VALUES_TOOL_DESCRIPTION:
    "一次从 Google Sheets 电子表格的多个范围读取值。",
  PARAM_RANGES_LABEL: "范围列表",
  PARAM_RANGES_HINT:
    "用逗号分隔的 A1 表示法范围。例如 Sheet1!A1:B2, Sheet2!C1:D5",
  PARAM_RANGES_PLACEHOLDER: "例如 Sheet1!A1:B10, Sheet2!A1:C5",
} satisfies Translation

export default zh_Hans
