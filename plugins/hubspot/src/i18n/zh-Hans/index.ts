import type { Translation } from "../i18n-types"

const zh_Hans = {
  // ── 插件 ──────────────────────────────────────────────────────
  PLUGIN_DISPLAY_NAME: "HubSpot",
  PLUGIN_DESCRIPTION: "集成 HubSpot CRM — 管理联系人、公司、交易、工单等。",

  // ── 凭证 ─────────────────────────────────────────────────────
  CREDENTIAL_OAUTH2_DISPLAY_NAME: "HubSpot OAuth2",
  CREDENTIAL_OAUTH2_DESCRIPTION: "使用 OAuth2 对 HubSpot 进行身份验证。",
  CREDENTIAL_OAUTH2_CLIENT_ID_LABEL: "客户端 ID",
  CREDENTIAL_OAUTH2_CLIENT_ID_PLACEHOLDER:
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  CREDENTIAL_OAUTH2_CLIENT_ID_HINT: "HubSpot 应用设置中的客户端 ID。",
  CREDENTIAL_OAUTH2_CLIENT_SECRET_LABEL: "客户端密钥",
  CREDENTIAL_OAUTH2_CLIENT_SECRET_HINT: "HubSpot 应用设置中的客户端密钥。",

  // ── 共享参数 ───────────────────────────────────────────────────
  PARAM_OAUTH2_CREDENTIAL_LABEL: "HubSpot OAuth2 凭证",
  PARAM_OBJECT_TYPE_LABEL: "对象类型",
  PARAM_OBJECT_TYPE_HINT:
    "CRM 对象类型（例如 contacts、companies、deals、tickets、line_items、products 或自定义对象类型）。",
  PARAM_OBJECT_TYPE_PLACEHOLDER: "contacts",
  PARAM_OBJECT_ID_LABEL: "对象 ID",
  PARAM_OBJECT_ID_HINT: "HubSpot 对象的 ID。",
  PARAM_OBJECT_ID_PLACEHOLDER: "12345",
  PARAM_PROPERTIES_LABEL: "属性",
  PARAM_PROPERTIES_HINT: "要在对象上设置的属性。字段从 HubSpot 模式动态发现。",
  PARAM_PROPERTIES_EMPTY_NOTICE: "请选择对象类型以加载可用属性。",
  PARAM_SEARCH_QUERY_LABEL: "搜索查询",
  PARAM_SEARCH_QUERY_HINT:
    "用于搜索对象的文本查询。在默认可搜索属性中进行搜索。",
  PARAM_SEARCH_QUERY_PLACEHOLDER: "john@example.com",
  PARAM_FILTER_GROUPS_LABEL: "筛选器组",
  PARAM_FILTER_GROUPS_HINT:
    "高级搜索的筛选器组。组之间为 OR 关系；组内筛选器为 AND 关系。",
  PARAM_FILTERS_LABEL: "筛选器",
  PARAM_FILTER_PROPERTY_NAME_LABEL: "属性名称",
  PARAM_FILTER_OPERATOR_LABEL: "运算符",
  PARAM_FILTER_VALUE_LABEL: "值",
  FILTER_OP_EQ: "等于",
  FILTER_OP_NEQ: "不等于",
  FILTER_OP_LT: "小于",
  FILTER_OP_LTE: "小于或等于",
  FILTER_OP_GT: "大于",
  FILTER_OP_GTE: "大于或等于",
  FILTER_OP_CONTAINS: "包含",
  FILTER_OP_NOT_CONTAINS: "不包含",
  FILTER_OP_HAS_PROPERTY: "具有属性",
  FILTER_OP_NOT_HAS_PROPERTY: "不具有属性",
  PARAM_LIMIT_LABEL: "限制数量",
  PARAM_LIMIT_HINT: "返回结果的最大数量。",
  PARAM_RETURN_PROPERTIES_LABEL: "返回属性",
  PARAM_RETURN_PROPERTIES_HINT: "响应中包含的属性列表，以逗号分隔。",
  PARAM_RETURN_ASSOCIATIONS_LABEL: "返回关联",
  PARAM_RETURN_ASSOCIATIONS_HINT:
    "要包含的关联类型列表，以逗号分隔（例如 contacts、companies）。",
  PARAM_UPSERT_LABEL: "创建或更新（Upsert）",
  PARAM_UPSERT_HINT: "启用后，如果对象不存在则创建。需要 ID 属性。",
  PARAM_ID_PROPERTY_LABEL: "ID 属性",
  PARAM_ID_PROPERTY_HINT:
    "用作 upsert 唯一标识符的属性（例如联系人的 email）。",
  PARAM_ID_PROPERTY_PLACEHOLDER: "email",

  // ── CRM > 联系人 ────────────────────────────────────────────
  CREATE_CONTACT_DISPLAY_NAME: "创建联系人",
  CREATE_CONTACT_DESCRIPTION: "在 HubSpot CRM 中创建新联系人。",
  GET_CONTACT_DISPLAY_NAME: "获取联系人",
  GET_CONTACT_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取联系人。",
  UPDATE_CONTACT_DISPLAY_NAME: "更新联系人",
  UPDATE_CONTACT_DESCRIPTION:
    "更新 HubSpot CRM 中的联系人。支持通过邮箱进行 upsert。",
  FIND_CONTACT_DISPLAY_NAME: "查找联系人",
  FIND_CONTACT_DESCRIPTION: "使用筛选器或文本查询在 HubSpot CRM 中搜索联系人。",

  // ── CRM > 公司 ─────────────────────────────────────────────
  CREATE_COMPANY_DISPLAY_NAME: "创建公司",
  CREATE_COMPANY_DESCRIPTION: "在 HubSpot CRM 中创建新公司。",
  GET_COMPANY_DISPLAY_NAME: "获取公司",
  GET_COMPANY_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取公司。",
  UPDATE_COMPANY_DISPLAY_NAME: "更新公司",
  UPDATE_COMPANY_DESCRIPTION:
    "更新 HubSpot CRM 中的公司。支持通过域名进行 upsert。",
  FIND_COMPANY_DISPLAY_NAME: "查找公司",
  FIND_COMPANY_DESCRIPTION: "使用筛选器或文本查询在 HubSpot CRM 中搜索公司。",

  // ── CRM > 交易 ─────────────────────────────────────────────
  CREATE_DEAL_DISPLAY_NAME: "创建交易",
  CREATE_DEAL_DESCRIPTION: "在 HubSpot CRM 中创建新交易。",
  GET_DEAL_DISPLAY_NAME: "获取交易",
  GET_DEAL_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取交易。",
  UPDATE_DEAL_DISPLAY_NAME: "更新交易",
  UPDATE_DEAL_DESCRIPTION: "更新 HubSpot CRM 中的交易。",
  FIND_DEAL_DISPLAY_NAME: "查找交易",
  FIND_DEAL_DESCRIPTION: "使用筛选器或文本查询在 HubSpot CRM 中搜索交易。",

  // ── CRM > 工单 ─────────────────────────────────────────────
  CREATE_TICKET_DISPLAY_NAME: "创建工单",
  CREATE_TICKET_DESCRIPTION: "在 HubSpot CRM 中创建新工单。",
  GET_TICKET_DISPLAY_NAME: "获取工单",
  GET_TICKET_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取工单。",
  UPDATE_TICKET_DISPLAY_NAME: "更新工单",
  UPDATE_TICKET_DESCRIPTION: "更新 HubSpot CRM 中的工单。",
  FIND_TICKET_DISPLAY_NAME: "查找工单",
  FIND_TICKET_DESCRIPTION: "使用筛选器或文本查询在 HubSpot CRM 中搜索工单。",

  // ── CRM > 行项目 ──────────────────────────────────────────
  CREATE_LINE_ITEM_DISPLAY_NAME: "创建行项目",
  CREATE_LINE_ITEM_DESCRIPTION: "在 HubSpot CRM 中创建新行项目。",
  GET_LINE_ITEM_DISPLAY_NAME: "获取行项目",
  GET_LINE_ITEM_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取行项目。",
  UPDATE_LINE_ITEM_DISPLAY_NAME: "更新行项目",
  UPDATE_LINE_ITEM_DESCRIPTION: "更新 HubSpot CRM 中的行项目。",
  FIND_LINE_ITEM_DISPLAY_NAME: "查找行项目",
  FIND_LINE_ITEM_DESCRIPTION:
    "使用筛选器或文本查询在 HubSpot CRM 中搜索行项目。",

  // ── CRM > 产品 ─────────────────────────────────────────────
  CREATE_PRODUCT_DISPLAY_NAME: "创建产品",
  CREATE_PRODUCT_DESCRIPTION: "在 HubSpot CRM 中创建新产品。",
  GET_PRODUCT_DISPLAY_NAME: "获取产品",
  GET_PRODUCT_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取产品。",
  UPDATE_PRODUCT_DISPLAY_NAME: "更新产品",
  UPDATE_PRODUCT_DESCRIPTION: "更新 HubSpot CRM 中的产品。",
  FIND_PRODUCT_DISPLAY_NAME: "查找产品",
  FIND_PRODUCT_DESCRIPTION: "使用筛选器或文本查询在 HubSpot CRM 中搜索产品。",

  // ── CRM > 对象（通用）────────────────────────────────────────
  CREATE_CRM_OBJECT_DISPLAY_NAME: "创建 CRM 对象",
  CREATE_CRM_OBJECT_DESCRIPTION: "在 HubSpot CRM 中创建任何类型的新对象。",
  GET_CRM_OBJECT_DISPLAY_NAME: "获取 CRM 对象",
  GET_CRM_OBJECT_DESCRIPTION: "通过 ID 从 HubSpot CRM 获取任何类型的对象。",
  UPDATE_CRM_OBJECT_DISPLAY_NAME: "更新 CRM 对象",
  UPDATE_CRM_OBJECT_DESCRIPTION: "更新 HubSpot CRM 中任何类型的对象。",
  DELETE_CRM_OBJECT_DISPLAY_NAME: "删除 CRM 对象",
  DELETE_CRM_OBJECT_DESCRIPTION: "从 HubSpot CRM 中删除任何类型的对象。",
  FIND_CRM_OBJECT_DISPLAY_NAME: "查找 CRM 对象",
  FIND_CRM_OBJECT_DESCRIPTION: "在 HubSpot CRM 中搜索任何类型的对象。",

  // ── CRM > 关联 ─────────────────────────────────────────────
  CREATE_ASSOCIATIONS_DISPLAY_NAME: "创建关联",
  CREATE_ASSOCIATIONS_DESCRIPTION: "在 HubSpot CRM 对象之间创建关联。",
  REMOVE_ASSOCIATIONS_DISPLAY_NAME: "移除关联",
  REMOVE_ASSOCIATIONS_DESCRIPTION: "移除 HubSpot CRM 对象之间的关联。",
  FIND_ASSOCIATIONS_DISPLAY_NAME: "查找关联",
  FIND_ASSOCIATIONS_DESCRIPTION: "查找 HubSpot CRM 对象之间的关联。",
  PARAM_FROM_OBJECT_TYPE_LABEL: "源对象类型",
  PARAM_FROM_OBJECT_TYPE_HINT:
    "源对象类型（例如 contacts、companies、deals）。",
  PARAM_TO_OBJECT_TYPE_LABEL: "目标对象类型",
  PARAM_TO_OBJECT_TYPE_HINT:
    "目标对象类型（例如 contacts、companies、deals）。",
  PARAM_FROM_OBJECT_ID_LABEL: "源对象 ID",
  PARAM_FROM_OBJECT_ID_HINT: "源对象的 ID。",
  PARAM_TO_OBJECT_ID_LABEL: "目标对象 ID",
  PARAM_TO_OBJECT_ID_HINT: "目标对象的 ID。",
  PARAM_ASSOCIATION_INPUTS_LABEL: "关联对",
  PARAM_ASSOCIATION_INPUTS_HINT: "要关联或取消关联的对象 ID 对。",
  PARAM_FROM_ID_LABEL: "源 ID",
  PARAM_TO_ID_LABEL: "目标 ID",
  PARAM_FROM_IDS_LABEL: "源对象 ID 列表",
  PARAM_FROM_IDS_HINT: "要查找关联的源对象 ID，以逗号分隔。",

  // ── CRM > 所有者 ──────────────────────────────────────────
  GET_OWNER_BY_EMAIL_DISPLAY_NAME: "通过邮箱获取所有者",
  GET_OWNER_BY_EMAIL_DESCRIPTION: "通过邮箱地址获取 HubSpot 所有者信息。",
  GET_OWNER_BY_ID_DISPLAY_NAME: "通过 ID 获取所有者",
  GET_OWNER_BY_ID_DESCRIPTION: "通过 ID 获取 HubSpot 所有者信息。",
  PARAM_OWNER_EMAIL_LABEL: "所有者邮箱",
  PARAM_OWNER_EMAIL_HINT: "HubSpot 所有者的邮箱地址。",
  PARAM_OWNER_EMAIL_PLACEHOLDER: "owner@company.com",
  PARAM_OWNER_ID_LABEL: "所有者 ID",
  PARAM_OWNER_ID_HINT: "HubSpot 所有者的 ID。",
  PARAM_OWNER_ID_PLACEHOLDER: "12345678",

  // ── CRM > 管道 ─────────────────────────────────────────────
  GET_PIPELINE_STAGE_DETAILS_DISPLAY_NAME: "获取管道阶段详情",
  GET_PIPELINE_STAGE_DETAILS_DESCRIPTION:
    "获取 HubSpot 对象类型的管道和阶段详情。",
  PARAM_PIPELINE_OBJECT_TYPE_LABEL: "管道对象类型",
  PARAM_PIPELINE_OBJECT_TYPE_HINT:
    "要获取管道的对象类型（例如 deals、tickets）。",

  // ── CRM > 列表（分段）────────────────────────────────────────
  CREATE_LIST_DISPLAY_NAME: "创建列表（分段）",
  CREATE_LIST_DESCRIPTION: "在 HubSpot 中创建新的静态或动态列表。",
  ADD_CONTACT_TO_LIST_DISPLAY_NAME: "添加联系人到列表",
  ADD_CONTACT_TO_LIST_DESCRIPTION: "将一个或多个联系人添加到 HubSpot 列表。",
  REMOVE_CONTACT_FROM_LIST_DISPLAY_NAME: "从列表中移除联系人",
  REMOVE_CONTACT_FROM_LIST_DESCRIPTION:
    "从 HubSpot 列表中移除一个或多个联系人。",
  PARAM_LIST_NAME_LABEL: "列表名称",
  PARAM_LIST_NAME_HINT: "要创建的列表名称。",
  PARAM_LIST_NAME_PLACEHOLDER: "我的自定义列表",
  PARAM_LIST_OBJECT_TYPE_ID_LABEL: "对象类型 ID",
  PARAM_LIST_OBJECT_TYPE_ID_HINT: "列表的对象类型（例如 0-1 表示联系人）。",
  PARAM_LIST_PROCESSING_TYPE_LABEL: "处理类型",
  PARAM_LIST_PROCESSING_TYPE_HINT:
    "列表是 MANUAL（静态）还是 SNAPSHOT（动态）。",
  LIST_PROCESSING_TYPE_MANUAL: "手动（静态）",
  LIST_PROCESSING_TYPE_SNAPSHOT: "快照（动态）",
  PARAM_LIST_ID_LABEL: "列表 ID",
  PARAM_LIST_ID_HINT: "列表的 ID。",
  PARAM_LIST_ID_PLACEHOLDER: "12345",
  PARAM_CONTACT_IDS_LABEL: "联系人 ID",
  PARAM_CONTACT_IDS_HINT: "要添加或移除的联系人 ID，以逗号分隔。",

  // ── CRM > 互动 ─────────────────────────────────────────────
  CREATE_ENGAGEMENT_DISPLAY_NAME: "创建互动",
  CREATE_ENGAGEMENT_DESCRIPTION:
    "在 HubSpot 中创建互动（通话、邮件、会议、任务或备注）。",
  PARAM_ENGAGEMENT_TYPE_LABEL: "互动类型",
  PARAM_ENGAGEMENT_TYPE_HINT: "要创建的互动类型。",
  ENGAGEMENT_TYPE_CALL: "通话",
  ENGAGEMENT_TYPE_EMAIL: "邮件",
  ENGAGEMENT_TYPE_MEETING: "会议",
  ENGAGEMENT_TYPE_TASK: "任务",
  ENGAGEMENT_TYPE_NOTE: "备注",
  PARAM_ENGAGEMENT_PROPERTIES_LABEL: "互动属性",
  PARAM_ENGAGEMENT_PROPERTIES_HINT: "互动的属性。字段因互动类型而异。",

  // ── 营销 > 表单 ────────────────────────────────────────────
  CREATE_FORM_SUBMISSION_DISPLAY_NAME: "创建表单提交",
  CREATE_FORM_SUBMISSION_DESCRIPTION: "向 HubSpot 表单提交数据。",
  PARAM_PORTAL_ID_LABEL: "Portal ID",
  PARAM_PORTAL_ID_HINT: "您的 HubSpot 门户（账号）ID。",
  PARAM_PORTAL_ID_PLACEHOLDER: "12345678",
  PARAM_FORM_GUID_LABEL: "表单 GUID",
  PARAM_FORM_GUID_HINT: "表单的唯一标识符。",
  PARAM_FORM_GUID_PLACEHOLDER: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  PARAM_FORM_FIELDS_LABEL: "表单字段",
  PARAM_FORM_FIELDS_HINT: "表单字段名称和值的键值对。",

  // ── 营销 > 邮件订阅 ───────────────────────────────────────
  REMOVE_EMAIL_SUBSCRIPTION_DISPLAY_NAME: "移除邮件订阅",
  REMOVE_EMAIL_SUBSCRIPTION_DESCRIPTION:
    "从 HubSpot 订阅类型中取消订阅邮箱地址。",
  UPDATE_SUBSCRIPTION_PREFERENCES_DISPLAY_NAME: "更新联系人订阅偏好",
  UPDATE_SUBSCRIPTION_PREFERENCES_DESCRIPTION:
    "更新 HubSpot 中联系人的邮件订阅偏好。",
  PARAM_EMAIL_ADDRESS_LABEL: "邮箱地址",
  PARAM_EMAIL_ADDRESS_HINT: "要更新订阅的邮箱地址。",
  PARAM_EMAIL_ADDRESS_PLACEHOLDER: "contact@example.com",
  PARAM_SUBSCRIPTION_ID_LABEL: "订阅 ID",
  PARAM_SUBSCRIPTION_ID_HINT: "订阅类型的 ID。",
  PARAM_SUBSCRIPTION_STATUSES_LABEL: "订阅状态",
  PARAM_SUBSCRIPTION_STATUSES_HINT: "订阅 ID 及其订阅状态列表。",
  PARAM_SUBSCRIPTION_STATUS_ID_LABEL: "订阅类型 ID",
  PARAM_SUBSCRIPTION_STATUS_SUBSCRIBED_LABEL: "已订阅",
  PARAM_LEGAL_BASIS_LABEL: "法律依据",
  PARAM_LEGAL_BASIS_HINT: "更新订阅的法律依据（例如 CONSENT_WITH_NOTICE）。",
  PARAM_LEGAL_BASIS_EXPLANATION_LABEL: "法律依据说明",
  PARAM_LEGAL_BASIS_EXPLANATION_HINT: "订阅变更的法律依据说明。",

  // ── 营销 > 社交 ────────────────────────────────────────────
  CREATE_SOCIAL_MESSAGE_DISPLAY_NAME: "创建社交媒体消息",
  CREATE_SOCIAL_MESSAGE_DESCRIPTION: "通过 HubSpot 创建和安排社交媒体消息。",
  PARAM_SOCIAL_CHANNEL_GUID_LABEL: "频道 GUID",
  PARAM_SOCIAL_CHANNEL_GUID_HINT: "社交媒体频道的唯一标识符。",
  PARAM_SOCIAL_CONTENT_LABEL: "消息内容",
  PARAM_SOCIAL_CONTENT_HINT: "社交媒体消息的内容。",
  PARAM_SOCIAL_CONTENT_PLACEHOLDER: "看看我们的新产品！",

  // ── 自动化 > 工作流 ───────────────────────────────────────
  ADD_CONTACT_TO_WORKFLOW_DISPLAY_NAME: "添加联系人到工作流",
  ADD_CONTACT_TO_WORKFLOW_DESCRIPTION:
    "通过邮箱将联系人注册到 HubSpot 工作流。",
  PARAM_WORKFLOW_ID_LABEL: "工作流 ID",
  PARAM_WORKFLOW_ID_HINT: "要注册联系人的工作流 ID。",
  PARAM_WORKFLOW_ID_PLACEHOLDER: "12345678",
  PARAM_WORKFLOW_CONTACT_EMAIL_LABEL: "联系人邮箱",
  PARAM_WORKFLOW_CONTACT_EMAIL_HINT: "要注册的联系人邮箱地址。",

  // ── CMS > 博客 ─────────────────────────────────────────────
  CREATE_BLOG_POST_DISPLAY_NAME: "创建 COS 博客文章",
  CREATE_BLOG_POST_DESCRIPTION: "在 HubSpot CMS 中创建新的博客文章。",
  PARAM_BLOG_POST_NAME_LABEL: "文章标题",
  PARAM_BLOG_POST_NAME_HINT: "博客文章的标题。",
  PARAM_BLOG_POST_NAME_PLACEHOLDER: "我的新博客文章",
  PARAM_BLOG_CONTENT_GROUP_ID_LABEL: "博客 ID（内容组）",
  PARAM_BLOG_CONTENT_GROUP_ID_HINT: "要发布到的博客 ID。",
  PARAM_BLOG_POST_BODY_LABEL: "文章正文",
  PARAM_BLOG_POST_BODY_HINT: "博客文章的 HTML 正文。",
  PARAM_BLOG_POST_SLUG_LABEL: "Slug",
  PARAM_BLOG_POST_SLUG_HINT: "博客文章的 URL slug。",
  PARAM_BLOG_POST_STATE_LABEL: "状态",
  PARAM_BLOG_POST_STATE_HINT: "博客文章的发布状态。",
  OPTION_DRAFT: "草稿",
  OPTION_PUBLISHED: "已发布",
  PARAM_BLOG_POST_META_DESCRIPTION_LABEL: "Meta 描述",
  PARAM_BLOG_POST_META_DESCRIPTION_HINT: "用于 SEO 的 Meta 描述。",

  // ── 事件 ──────────────────────────────────────────────────
  CREATE_ENTERPRISE_EVENT_DISPLAY_NAME: "创建企业事件",
  CREATE_ENTERPRISE_EVENT_DESCRIPTION: "向 HubSpot 发送自定义行为事件。",
  PARAM_EVENT_NAME_LABEL: "事件名称",
  PARAM_EVENT_NAME_HINT: "事件定义的内部名称。",
  PARAM_EVENT_NAME_PLACEHOLDER: "pe12345_my_event",
  PARAM_EVENT_EMAIL_LABEL: "联系人邮箱",
  PARAM_EVENT_EMAIL_HINT: "要关联事件的联系人邮箱。",
  PARAM_EVENT_PROPERTIES_LABEL: "事件属性",
  PARAM_EVENT_PROPERTIES_HINT: "自定义事件属性的键值对。",

  // ── 文件 ──────────────────────────────────────────────────
  GET_FILE_PUBLIC_URL_DISPLAY_NAME: "获取文件公开 URL",
  GET_FILE_PUBLIC_URL_DESCRIPTION: "获取 HubSpot 中文件的公开 URL。",
  UPLOAD_FILE_DISPLAY_NAME: "上传文件",
  UPLOAD_FILE_DESCRIPTION: "将文件上传到 HubSpot 文件管理器。",
  PARAM_FILE_ID_LABEL: "文件 ID",
  PARAM_FILE_ID_HINT: "文件的 ID。",
  PARAM_FILE_ID_PLACEHOLDER: "12345678",
  PARAM_FILE_NAME_LABEL: "文件名",
  PARAM_FILE_NAME_HINT: "上传文件的名称。",
  PARAM_FILE_NAME_PLACEHOLDER: "document.pdf",
  PARAM_FILE_CONTENT_LABEL: "文件内容",
  PARAM_FILE_CONTENT_HINT: "要上传的文件内容（base64 编码）。",
  PARAM_FILE_FOLDER_ID_LABEL: "文件夹 ID",
  PARAM_FILE_FOLDER_ID_HINT: "要上传到的文件夹 ID（可选）。",
  PARAM_FILE_ACCESS_LABEL: "访问级别",
  PARAM_FILE_ACCESS_HINT: "文件的访问级别。",
  OPTION_PRIVATE: "私有",
  OPTION_PUBLIC_INDEXABLE: "公开（可索引）",
  OPTION_PUBLIC_NOT_INDEXABLE: "公开（不可索引）",

  // ── 错误 ──────────────────────────────────────────────────
  ERROR_MISSING_CREDENTIAL: "缺少 HubSpot 凭证。请提供 HubSpot OAuth2 凭证。",
} satisfies Translation

export default zh_Hans
