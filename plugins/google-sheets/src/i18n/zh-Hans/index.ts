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
    "打开 Google Cloud 控制台 → API 和服务 → 凭据 → 创建凭据 → OAuth 客户端 ID。选择「桌面应用」或「网页应用」；在项目中启用 Google Sheets API；把 Atomemo/插件授权流程里提供的重定向 URI 填进客户端。客户端 ID 通常形如：数字-xxx.apps.googleusercontent.com。",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER:
    "例如 123456789-abc.apps.googleusercontent.com",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "客户端密钥",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "与上述客户端 ID 同时生成，请当作密码保管，勿提交到公开仓库。若在云端轮换过密钥，请在此更新并视情况重新授权。",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER: "例如 GOCSPX-xxxxxxxxxxxx",

  // Common parameters
  PARAM_CREDENTIAL_LABEL: "凭证",
  PARAM_SPREADSHEET_ID_LABEL: "电子表格 ID",
  PARAM_SPREADSHEET_ID_HINT:
    "在浏览器中打开表格，从地址栏复制 /d/ 与 /edit（或 /edit#gid=…）之间的长字符串即为电子表格 ID。示例：https://docs.google.com/spreadsheets/d/此处为ID/edit",
  PARAM_SPREADSHEET_ID_PLACEHOLDER:
    "例如 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  PARAM_RANGE_LABEL: "范围",
  PARAM_RANGE_HINT:
    "A1 表示法：可选工作表名 + ! + 单元格区域。示例：Sheet1!A1:D10（矩形区域）、Sheet1!A2:A（从第 2 行起整列）、Sheet1（整张表，按默认规则）。表名含空格或特殊字符时需加单引号：'一季度销售'!B2:E20。",
  PARAM_RANGE_PLACEHOLDER: "例如 Sheet1!A1:D10 或 '我的工作表'!A:C",
  PARAM_MAJOR_DIMENSION_LABEL: "主维度",
  PARAM_MAJOR_DIMENSION_HINT:
    "ROWS：内层数组表示一行（表格常用）。COLUMNS：内层数组表示一列。影响读取接口返回的二维数组如何组织。",
  PARAM_VALUE_RENDER_OPTION_LABEL: "值渲染选项",
  PARAM_VALUE_RENDER_OPTION_HINT:
    "FORMATTED_VALUE：与界面显示一致（默认）。UNFORMATTED_VALUE：原始数字/日期，不含显示格式。FORMULA：若单元格为公式则返回如 =SUM(A1:A10) 的公式文本。",
  PARAM_VALUE_INPUT_OPTION_LABEL: "值输入选项",
  PARAM_VALUE_INPUT_OPTION_HINT:
    'RAW：按字符串原样写入（例如 "1-2" 保持为文本）。USER_ENTERED：像在表格里手工输入一样解析——数字、日期、以 = 开头的字符串会按公式处理（默认）。',
  PARAM_VALUES_LABEL: "值",
  PARAM_VALUES_HINT:
    'JSON 二维数组：外层为行，内层为单元格。更新（Update）时行列数应与范围一致。示例：[["姓名","分数"],["小艾",95]]；混合类型 [["SKU",12,true]]。',
  PARAM_VALUES_PLACEHOLDER: '例如 [["姓名","年龄"],["Alice",30],["Bob",25]]',

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
  PARAM_APPEND_RANGE_HINT:
    "API 会在该范围内查找最后一行有数据的行，并在其后追加。应覆盖表格全部列（与每行 values 的列数一致），例如 Sheet1!A:F、数据!B:E。范围过窄可能误判表格末尾。",
  PARAM_APPEND_RANGE_PLACEHOLDER: "例如 Sheet1!A:D 或 订单!B:G",
  PARAM_INSERT_DATA_OPTION_LABEL: "插入数据选项",
  PARAM_INSERT_DATA_OPTION_HINT:
    "INSERT_ROWS：插入新行并下移已有行（下方有数据时更安全）。OVERWRITE：不插入行，直接往后写——若与已有区域重叠可能覆盖单元格。",
  PARAM_APPEND_VALUES_HINT:
    '每个内层数组为一行新数据，列数应与表头/表格列一致。示例：[["Eve","eve@ex.com",1],["Dan","dan@ex.com",2]]；单行 [["2025-03-26",42.5]]。',

  // Clear Values
  CLEAR_VALUES_TOOL_DISPLAY_NAME: "清除值",
  CLEAR_VALUES_TOOL_DESCRIPTION:
    "清除 Google Sheets 电子表格中指定范围的所有值。",

  // Create Spreadsheet
  CREATE_SPREADSHEET_TOOL_DISPLAY_NAME: "创建电子表格",
  CREATE_SPREADSHEET_TOOL_DESCRIPTION: "创建一个新的 Google Sheets 电子表格。",
  PARAM_TITLE_LABEL: "标题",
  PARAM_TITLE_HINT:
    "会显示在云端硬盘和表格标题栏。示例：FY2025 预算表、团队花名册-一季度。",
  PARAM_TITLE_PLACEHOLDER: "例如 FY2025 预算跟踪表",
  PARAM_SHEET_TITLES_LABEL: "工作表名称（可选）",
  PARAM_SHEET_TITLES_HINT:
    "逗号分隔的工作表标签名，按从左到右顺序创建。留空则只有一个默认工作表。示例：汇总,原始数据,归档。名称本身勿含逗号（若需要可在创建后到 Sheets 里重命名）。",
  PARAM_SHEET_TITLES_PLACEHOLDER: "例如 汇总, 原始数据, 归档",

  // Get Spreadsheet Info
  GET_SPREADSHEET_INFO_TOOL_DISPLAY_NAME: "获取电子表格信息",
  GET_SPREADSHEET_INFO_TOOL_DESCRIPTION:
    "获取 Google Sheets 电子表格的元数据和属性。",
  PARAM_INCLUDE_GRID_DATA_LABEL: "包含网格数据",
  PARAM_INCLUDE_GRID_DATA_HINT:
    "开启后响应会包含单元格内容，大表可能非常庞大。关闭（默认）仅返回标题、sheetId、行列规模等元数据，更轻、更快。",

  // Copy Sheet
  COPY_SHEET_TOOL_DISPLAY_NAME: "复制工作表",
  COPY_SHEET_TOOL_DESCRIPTION:
    "将一个工作表从一个电子表格复制到另一个电子表格。",
  PARAM_SHEET_ID_LABEL: "工作表 ID",
  PARAM_SHEET_ID_HINT:
    "API 使用的数字 sheetId。在浏览器中打开对应标签页，地址栏 #gid= 后的数字通常即为该工作表 ID（例如 ...#gid=1234567890 则填 1234567890）。第一个工作表常为 0；不确定可用「获取电子表格信息」核对。",
  PARAM_SHEET_ID_PLACEHOLDER: "例如 0 或 URL 中的 gid（如 1234567890）",
  PARAM_SOURCE_SPREADSHEET_ID_HINT:
    "含有待复制工作表的源表格，与「电子表格 ID」相同：URL 中 /d/ 与 /edit 之间的字符串。示例：https://docs.google.com/spreadsheets/d/源表格ID/edit",
  PARAM_DESTINATION_SPREADSHEET_ID_LABEL: "目标电子表格 ID",
  PARAM_DESTINATION_SPREADSHEET_ID_HINT:
    "已有表格，复制结果会作为新标签页加入其中。你的账号需要编辑权限。若工作表重名，新标签名可能会自动加后缀。",

  // Batch Get Values
  BATCH_GET_VALUES_TOOL_DISPLAY_NAME: "批量获取值",
  BATCH_GET_VALUES_TOOL_DESCRIPTION:
    "一次从 Google Sheets 电子表格的多个范围读取值。",
  PARAM_RANGES_LABEL: "范围列表",
  PARAM_RANGES_HINT:
    "一次请求多个区域，用英文逗号分隔；逗号后空格可有可无。每个区域均为 A1 表示法。示例：Sheet1!A1:C10,Sheet2!A1:C10；整列示例：'一月'!B:B,'二月'!B:B（带空格的工作表名加单引号）。",
  PARAM_RANGES_PLACEHOLDER: "例如 Sheet1!A1:B10, Sheet2!A1:C5, '销售Q1'!D2:F99",

  // Clear-values — range field
  PARAM_CLEAR_RANGE_HINT:
    "仅清除单元格的值，保留格式、批注与数据验证。A1 规则与「读取行」相同。示例：Sheet1!C2:C500（列的一段）、数据!A1:Z200（矩形块）。",
} satisfies Translation

export default zh_Hans
