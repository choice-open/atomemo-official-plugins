import type { Translation } from "../i18n-types"

const zh_Hans = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Airtable",
  PLUGIN_DESCRIPTION:
    "操作 Airtable 数据库和记录。列出数据库、获取表结构，以及创建、读取、搜索、更新、增改和删除记录。",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Airtable 个人访问令牌",
  CREDENTIAL_DESCRIPTION: "用于鉴权 Airtable API 请求的个人访问令牌。",
  CREDENTIAL_API_KEY_DISPLAY_NAME: "个人访问令牌",
  CREDENTIAL_API_KEY_HINT:
    "在 https://airtable.com/create/tokens 创建令牌，并确保具有所需操作的权限范围。",
  CREDENTIAL_API_KEY_PLACEHOLDER:
    "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

  // Shared params
  PARAM_CREDENTIAL_LABEL: "Airtable 凭证",
  PARAM_BASE_ID_LABEL: "数据库 ID",
  PARAM_BASE_ID_HINT:
    "必填。Base ID 来自 base 链接、帮助 → API 文档或「获取多个数据库」。格式：app 加 14 位字母数字（如 appXXXXXXXXXXXXXX）。",
  PARAM_BASE_ID_PLACEHOLDER: "appXXXXXXXXXXXXXX",
  PARAM_BASE_ID_MODE_LIST_LABEL: "从可访问的数据库中选择",
  PARAM_BASE_ID_MODE_LIST_PLACEHOLDER: "按数据库名称搜索或选择数据库",
  PARAM_BASE_ID_MODE_URL_PLACEHOLDER: "https://airtable.com/appXXXXXXXXXXXXXX",
  PARAM_BASE_ID_MODE_ID_LABEL: "输入数据库 ID",
  PARAM_TABLE_LABEL: "表",
  PARAM_TABLE_HINT:
    "表名称或表 ID。可使用 base 中显示的表名，或从 base 结构中获取的 ID（如 tblXXXXXXXXXXXXXX）。",
  PARAM_TABLE_PLACEHOLDER: "tblXXXXXXXXXXXXXX 或表名称",
  PARAM_TABLE_MODE_LIST_LABEL: "从数据库中的表里选择",
  PARAM_TABLE_MODE_LIST_PLACEHOLDER: "按表名称搜索或选择表",
  PARAM_TABLE_MODE_URL_PLACEHOLDER:
    "https://airtable.com/appXXXXXXXXXXXXXX/tblXXXXXXXXXXXXXX",
  PARAM_TABLE_MODE_ID_LABEL: "输入表名或表 ID",
  PARAM_RECORD_ID_LABEL: "记录 ID",
  PARAM_RECORD_ID_HINT:
    "必填。记录 ID 格式：rec 加 14 位字母数字（如 recXXXXXXXXXXXXXX）。可从列表/搜索结果的 id、记录链接或右键记录 → 复制记录链接获取。",
  PARAM_RECORD_ID_PLACEHOLDER: "recXXXXXXXXXXXXXX",
  PARAM_RECORD_ID_MODE_LIST_PLACEHOLDER: "按主字段值搜索或选择记录",
  PARAM_RECORD_ID_MODE_URL_PLACEHOLDER:
    "https://airtable.com/appXXXXXXXXXXXXXX/tblXXXXXXXXXXXXXX/viwXXXXXXXXXXXXXX/recXXXXXXXXXXXXXX",
  PARAM_FIELDS_LABEL: "字段",
  PARAM_FIELDS_HINT:
    "必填。JSON 对象：键为字段名称（用名称勿用 ID）。值类型：文本、数字、单选、复选框、日期（ISO 8601）；链接记录为记录 ID 数组；协作者为 Airtable 文档中的用户 ID 或邮箱。开启 Typecast 时字符串会按字段类型转换，链接可按主字段值填写。",
  PARAM_FIELDS_EMPTY_BASE_NOTICE:
    "请先选择数据库，再加载可用的 Airtable 字段。",
  PARAM_FIELDS_EMPTY_TABLE_NOTICE: "请先选择表，再加载可用的 Airtable 字段。",
  PARAM_TYPECAST_LABEL: "自动类型转换",
  PARAM_TYPECAST_HINT:
    "启用后，Airtable 会将字符串转为对应类型（例如 '5' 转为数字、'true' 转为复选框），链接记录可用主字段值解析。若已传入正确类型可关闭以避免意外转换。",
  PARAM_RETURN_ALL_LABEL: "返回全部",
  PARAM_LIMIT_LABEL: "数量限制",
  PARAM_LIMIT_HINT:
    "未勾选「返回全部」时：最多返回条数（1–100）。勾选「返回全部」时使用 offset 分页并自动请求所有页。",

  // List Bases
  LIST_BASES_DISPLAY_NAME: "获取多个数据库",
  LIST_BASES_DESCRIPTION:
    "返回当前认证用户可访问的所有数据库（List bases API）。勾选「返回全部」时使用 offset 分页；不勾选时限制 1–100 条。可按权限级别筛选。",
  LIST_BASES_PERMISSION_LEVEL_LABEL: "权限级别筛选",
  LIST_BASES_PERMISSION_LEVEL_HINT:
    "可选。按你的权限筛选数据库：无、仅读、评论者、创建者或编辑者。留空则返回所有有权限的数据库。",

  // Get Base Schema
  GET_BASE_SCHEMA_DISPLAY_NAME: "获取 base 结构",
  GET_BASE_SCHEMA_DESCRIPTION:
    "获取指定 base 的结构。返回所有表（id、name、primaryFieldId）及其字段（id、name、type、description、options）。Base ID 必填（如 appXXXXXXXXXXXXXX），可在 base 链接或帮助 → API 文档中查看。",

  // Create Record
  CREATE_RECORD_DISPLAY_NAME: "创建一条记录",
  CREATE_RECORD_DESCRIPTION: "在 Airtable 表中创建新记录。",

  // Get Record
  GET_RECORD_DISPLAY_NAME: "获取一条记录",
  GET_RECORD_DESCRIPTION:
    "通过 base_id、表（名称或 id）和 record_id 获取单条记录。必填：base_id、table、record_id。",

  // Search Records
  SEARCH_RECORDS_DISPLAY_NAME: "搜索记录",
  SEARCH_RECORDS_DESCRIPTION:
    "列出并筛选记录（List records API）。支持 filterByFormula、view、fields[]、sort；分页为 pageSize 最多 100，设置数量限制时使用 maxRecords。",
  SEARCH_FILTER_FORMULA_LABEL: "过滤公式",
  SEARCH_FILTER_FORMULA_HINT:
    "可选。Airtable filterByFormula；仅当公式结果非 0、非空且不为 #Error! 时返回记录。字段名用花括号。与视图同用时先限制视图再按公式筛选。注意请求 URL 长度限制（约 16k 字符）。详见 https://airtable.com/developers/web/api/list-records#query-filterbyformula",
  SEARCH_FILTER_FORMULA_PLACEHOLDER: "",
  SEARCH_VIEW_LABEL: "视图",
  SEARCH_VIEW_HINT:
    "可选。视图名称或 ID，将结果限制在该视图内。若设置排序会覆盖视图排序。留空使用表默认。",
  SEARCH_OUTPUT_FIELDS_LABEL: "输出字段",
  SEARCH_OUTPUT_FIELDS_HINT:
    "可选。要返回的字段名称或 ID（fields[]），可减少返回数据。留空则返回全部字段。",
  SEARCH_SORT_LABEL: "排序",
  SEARCH_SORT_FIELD_LABEL: "字段",
  SEARCH_SORT_FIELD_HINT:
    "排序字段名称或 ID（sort[0][field]、sort[0][direction]）。可添加多条规则实现多级排序（升序/降序）。",
  SEARCH_SORT_DIRECTION_LABEL: "方向",

  // Update Record
  UPDATE_RECORD_DISPLAY_NAME: "更新记录",
  UPDATE_RECORD_DESCRIPTION: "通过记录 ID 更新 Airtable 表中的现有记录。",

  // Upsert Record
  UPSERT_RECORD_DISPLAY_NAME: "增改记录",
  UPSERT_RECORD_DESCRIPTION:
    "根据匹配字段值创建或更新记录。如果找到匹配字段值的记录则更新，否则创建新记录。",
  UPSERT_FIELDS_TO_MERGE_ON_LABEL: "合并依据字段",
  UPSERT_FIELDS_TO_MERGE_ON_HINT:
    "用于识别现有记录的字段名称。如果找到具有匹配字段值的记录，则更新该记录；否则创建新记录。",
  UPSERT_FIELDS_TO_MERGE_ON_PLACEHOLDER: "添加字段名称",
  UPSERT_UPDATE_ALL_MATCHES_LABEL: "更新所有匹配项",
  UPSERT_UPDATE_ALL_MATCHES_HINT:
    "是否更新所有匹配字段值的记录。如果禁用，则只更新第一个匹配项。",

  // Delete Record
  DELETE_RECORD_DISPLAY_NAME: "删除一条记录",
  DELETE_RECORD_DESCRIPTION:
    "从 Airtable 表中删除记录。必填：base_id、table（名称或 id）、record_id。返回 API 规定的 id 与 deleted。",

  // Errors (shared)
  ERROR_MISSING_CREDENTIAL:
    "未选择 Airtable 凭证，请选择有效的 Airtable 凭证。",
  ERROR_BASE_ID_REQUIRED: "base_id 为必填项。",
  ERROR_TABLE_REQUIRED: "table 为必填项。",
  ERROR_RECORD_ID_REQUIRED: "record_id 为必填项。",

  // List Bases – permission level options
  LIST_BASES_PERMISSION_NONE: "无",
  LIST_BASES_PERMISSION_READ: "仅读",
  LIST_BASES_PERMISSION_COMMENT: "评论者",
  LIST_BASES_PERMISSION_CREATE: "创建者",
  LIST_BASES_PERMISSION_EDIT: "编辑者",

  // Search Records – sort direction options
  SEARCH_SORT_ASC: "升序",
  SEARCH_SORT_DESC: "降序",
} satisfies Translation

export default zh_Hans
