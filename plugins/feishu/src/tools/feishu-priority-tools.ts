import * as lark from "@larksuiteoapi/node-sdk"
import type {
  PropertyCredentialId,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"

type LarkClientLike = {
  contact: {
    user: Record<string, (payload?: unknown) => Promise<unknown>>
    department: Record<string, (payload?: unknown) => Promise<unknown>>
  }
  im: {
    message: Record<string, (payload?: unknown) => Promise<unknown>>
    image: Record<string, (payload?: unknown) => Promise<unknown>>
    file: Record<string, (payload?: unknown) => Promise<unknown>>
  }
  calendar: {
    calendar: Record<string, (payload?: unknown) => Promise<unknown>>
    event: Record<string, (payload?: unknown) => Promise<unknown>>
  }
}

type ToolFactoryOptions = {
  clientFactory?: (appId: string, appSecret: string) => LarkClientLike
}

const credentialParameter: PropertyCredentialId<"credentialId"> = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "feishu-app-credential",
  display_name: {
    en_US: "Credential",
    zh_Hans: "凭证",
  },
  required: true,
  ui: {
    component: "credential-select",
  },
}

function getObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {}
  }
  return input as Record<string, unknown>
}

function parseJsonObjectString(input: unknown, fieldName: string): Record<string, unknown> {
  const text = String(input ?? "").trim()
  if (!text) {
    return {}
  }
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`Parameter \`${fieldName}\` must be a JSON object string`)
    }
    return parsed as Record<string, unknown>
  } catch (error) {
    throw new Error(
      `Invalid JSON for parameter \`${fieldName}\`: ${(error as Error).message}`,
    )
  }
}

function hasKeys(input: Record<string, unknown>): boolean {
  return Object.keys(input).length > 0
}

function parseJsonValueString(input: string, fieldName: string): unknown {
  try {
    return JSON.parse(input)
  } catch (error) {
    throw new Error(`Invalid JSON for field \`${fieldName}\`: ${(error as Error).message}`)
  }
}

function parseTypedValue(
  input: string,
  valueType: "string" | "json" | "number" | "boolean",
  fieldName: string,
): unknown {
  if (valueType === "json") {
    return parseJsonValueString(input, fieldName)
  }
  if (valueType === "number") {
    const parsed = Number(input)
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid number for field \`${fieldName}\``)
    }
    return parsed
  }
  if (valueType === "boolean") {
    const lower = input.toLowerCase()
    if (lower === "true") {
      return true
    }
    if (lower === "false") {
      return false
    }
    throw new Error(`Invalid boolean for field \`${fieldName}\`, use true/false`)
  }
  return input
}

function expectNestedString(
  payload: Record<string, unknown>,
  section: "params" | "path" | "data",
  key: string,
): void {
  const part = getObject(payload[section])
  const value = String(part[key] ?? "").trim()
  if (!value) {
    throw new Error(`VALIDATION_ERROR: Missing required field: ${section}.${key}`)
  }
}

function expectNestedArray(
  payload: Record<string, unknown>,
  section: "params" | "path" | "data",
  key: string,
): void {
  const part = getObject(payload[section])
  const value = part[key]
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`VALIDATION_ERROR: Missing required field: ${section}.${key}`)
  }
}

function expectAtLeastOneNestedField(
  payload: Record<string, unknown>,
  section: "params" | "path" | "data",
  keys: string[],
): void {
  const part = getObject(payload[section])
  for (const key of keys) {
    const value = part[key]
    if (typeof value === "string" && value.trim()) {
      return
    }
    if (Array.isArray(value) && value.length > 0) {
      return
    }
    if (value && typeof value === "object") {
      return
    }
  }
  throw new Error(
    `VALIDATION_ERROR: Missing required field: ${section}.${keys.join(" or ")}`,
  )
}

function createFeishuClient(appId: string, appSecret: string): LarkClientLike {
  return new lark.Client({
    appId,
    appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
  }) as unknown as LarkClientLike
}

type CreateSdkToolInput = {
  name: string
  skill?: string
  displayNameZh: string
  displayNameEn: string
  descriptionZh: string
  descriptionEn: string
  uiFields?: Array<{
    name: string
    displayNameZh: string
    displayNameEn: string
    target: "params" | "path" | "data"
    key: string
    valueType?: "string" | "json" | "number" | "boolean"
    required?: boolean
    placeholder?: string
  }>
  validatePayload?: (payload: Record<string, unknown>) => void
  invokeSdk: (client: LarkClientLike, payload: Record<string, unknown>) => Promise<unknown>
}

export function createFeishuSdkTool(
  input: CreateSdkToolInput,
  options: ToolFactoryOptions = {},
): ToolDefinition {
  const factory = options.clientFactory ?? createFeishuClient
  const skill = input.skill ?? input.name.replace(/^feishu_/, "").replaceAll("_", ".")
  const dynamicFields = (input.uiFields ?? []).map((field) => ({
    name: field.name,
    type: "string" as const,
    required: field.required ?? false,
    display_name: {
      en_US: field.displayNameEn,
      zh_Hans: field.displayNameZh,
    },
    ui: {
      component: "input" as const,
      width: "full" as const,
      support_expression: true,
      placeholder: {
        en_US: field.placeholder ?? "",
        zh_Hans: field.placeholder ?? "",
      },
    },
  }))

  return {
    name: input.name,
    skill,
    display_name: {
      en_US: input.displayNameEn,
      zh_Hans: input.displayNameZh,
    },
    description: {
      en_US: input.descriptionEn,
      zh_Hans: input.descriptionZh,
    },
    icon: "🧰",
    parameters: [
      credentialParameter,
      ...dynamicFields,
      {
        name: "payload_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "SDK Payload JSON",
          zh_Hans: "SDK 请求参数 JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          hint: {
            en_US:
              "Optional full SDK payload. If set, it overrides params_json/path_json/data_json.",
            zh_Hans:
              "可选完整 SDK payload。填写后将覆盖 params_json/path_json/data_json。",
          },
          placeholder: {
            en_US: '{"params":{},"path":{},"data":{}}',
            zh_Hans: '{"params":{},"path":{},"data":{}}',
          },
        },
      },
      {
        name: "params_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "params JSON",
          zh_Hans: "params JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          placeholder: {
            en_US: '{"user_id_type":"open_id","page_size":50}',
            zh_Hans: '{"user_id_type":"open_id","page_size":50}',
          },
        },
      },
      {
        name: "path_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "path JSON",
          zh_Hans: "path JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          placeholder: {
            en_US: '{"user_id":"ou_xxx","calendar_id":"cal_xxx","event_id":"evt_xxx"}',
            zh_Hans: '{"user_id":"ou_xxx","calendar_id":"cal_xxx","event_id":"evt_xxx"}',
          },
        },
      },
      {
        name: "data_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "data JSON",
          zh_Hans: "data JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          placeholder: {
            en_US: '{"name":"demo","summary":"meeting","receive_id":"ou_xxx"}',
            zh_Hans: '{"name":"demo","summary":"meeting","receive_id":"ou_xxx"}',
          },
        },
      },
    ],
    async invoke({ args }) {
      const parameters = getObject(args.parameters)
      const credentials = getObject(args.credentials)

      const credentialId = String(parameters.credentialId ?? "").trim()
      if (!credentialId) {
        throw new Error("Missing credentialId")
      }

      const credential = getObject(credentials[credentialId])
      const appId = String(credential.app_id ?? "").trim()
      const appSecret = String(credential.app_secret ?? "").trim()
      if (!appId || !appSecret) {
        throw new Error("Selected credential is invalid: missing app_id or app_secret")
      }

      const payloadFromFull = parseJsonObjectString(parameters.payload_json, "payload_json")
      const paramsObject = parseJsonObjectString(parameters.params_json, "params_json")
      const pathObject = parseJsonObjectString(parameters.path_json, "path_json")
      const dataObject = parseJsonObjectString(parameters.data_json, "data_json")
      for (const field of input.uiFields ?? []) {
        const value = String(parameters[field.name] ?? "").trim()
        if ((field.required ?? false) && !value) {
          throw new Error(`Parameter \`${field.name}\` is required`)
        }
        if (!value) {
          continue
        }
        const parsedValue = parseTypedValue(
          value,
          field.valueType ?? "string",
          field.name,
        )
        if (field.target === "params") {
          paramsObject[field.key] = parsedValue
        } else if (field.target === "path") {
          pathObject[field.key] = parsedValue
        } else {
          dataObject[field.key] = parsedValue
        }
      }
      const payload = hasKeys(payloadFromFull)
        ? payloadFromFull
        : {
            ...(hasKeys(paramsObject) ? { params: paramsObject } : {}),
            ...(hasKeys(pathObject) ? { path: pathObject } : {}),
            ...(hasKeys(dataObject) ? { data: dataObject } : {}),
          }
      input.validatePayload?.(payload)
      const client = factory(appId, appSecret)
      const response = await input.invokeSdk(client, payload)

      return {
        message: `Feishu API invoked successfully: ${input.name}`,
        tool: input.name,
        payload_raw: JSON.stringify(payload),
        response_raw: JSON.stringify(response),
      }
    },
  } satisfies ToolDefinition
}

const userCreateTool = createFeishuSdkTool({
  name: "feishu_contact_user_create",
  displayNameEn: "Feishu Contact User Create",
  displayNameZh: "飞书创建员工",
  descriptionEn: "Create employee by contact.user.create",
  descriptionZh: "使用 contact.user.create 创建员工",
  uiFields: [
    {
      name: "name",
      displayNameEn: "Name",
      displayNameZh: "姓名",
      target: "data",
      key: "name",
      required: true,
      placeholder: "张三",
    },
    {
      name: "mobile",
      displayNameEn: "Mobile",
      displayNameZh: "手机号",
      target: "data",
      key: "mobile",
      placeholder: "13800000000",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "name")
  },
  invokeSdk: (client, payload) => client.contact.user.create(payload),
})

const userUpdateTool = createFeishuSdkTool({
  name: "feishu_contact_user_update",
  displayNameEn: "Feishu Contact User Update",
  displayNameZh: "飞书更新员工信息",
  descriptionEn: "Update employee by contact.user.patch",
  descriptionZh: "使用 contact.user.patch 更新员工信息",
  uiFields: [
    {
      name: "user_id",
      displayNameEn: "User ID",
      displayNameZh: "用户 ID",
      target: "path",
      key: "user_id",
      required: true,
      placeholder: "ou_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "user_id")
  },
  invokeSdk: (client, payload) => client.contact.user.patch(payload),
})

const userResignTool = createFeishuSdkTool({
  name: "feishu_contact_user_resign",
  displayNameEn: "Feishu Contact User Resign",
  displayNameZh: "飞书离职员工",
  descriptionEn: "Delete user by contact.user.delete",
  descriptionZh: "使用 contact.user.delete 执行员工离职",
  uiFields: [
    {
      name: "user_id",
      displayNameEn: "User ID",
      displayNameZh: "用户 ID",
      target: "path",
      key: "user_id",
      required: true,
      placeholder: "ou_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "user_id")
  },
  invokeSdk: (client, payload) => client.contact.user.delete(payload),
})

const userBatchGetTool = createFeishuSdkTool({
  name: "feishu_contact_user_batch_get",
  displayNameEn: "Feishu Contact User Batch Get",
  displayNameZh: "飞书批量获取员工信息",
  descriptionEn: "Batch get users by contact.user.batch",
  descriptionZh: "使用 contact.user.batch 批量获取员工信息",
  uiFields: [
    {
      name: "user_id_type",
      displayNameEn: "User ID Type",
      displayNameZh: "用户 ID 类型",
      target: "params",
      key: "user_id_type",
      placeholder: "open_id / user_id / union_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "user_ids")
  },
  invokeSdk: (client, payload) => client.contact.user.batch(payload),
})

const userListTool = createFeishuSdkTool({
  name: "feishu_contact_user_list",
  displayNameEn: "Feishu Contact User List",
  displayNameZh: "飞书批量获取员工列表",
  descriptionEn: "List users by contact.user.list",
  descriptionZh: "使用 contact.user.list 获取员工列表",
  uiFields: [
    {
      name: "department_id",
      displayNameEn: "Department ID",
      displayNameZh: "部门 ID",
      target: "params",
      key: "department_id",
      placeholder: "0",
    },
    {
      name: "page_size",
      displayNameEn: "Page Size",
      displayNameZh: "分页大小",
      target: "params",
      key: "page_size",
      valueType: "number",
      placeholder: "50",
    },
    {
      name: "fetch_child",
      displayNameEn: "Fetch Child Departments",
      displayNameZh: "递归拉取子部门",
      target: "params",
      key: "fetch_child",
      valueType: "boolean",
      placeholder: "true / false",
    },
  ],
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.contact.user.list(payload),
})

const userSearchTool = createFeishuSdkTool({
  name: "feishu_contact_user_search",
  displayNameEn: "Feishu Contact User Search",
  displayNameZh: "飞书搜索员工信息",
  descriptionEn: "Search users by contact.user.batchGetId",
  descriptionZh: "使用 contact.user.batchGetId 搜索员工信息",
  uiFields: [
    {
      name: "emails_json",
      displayNameEn: "Emails(JSON Array)",
      displayNameZh: "邮箱数组(JSON)",
      target: "data",
      key: "emails",
      valueType: "json",
      placeholder: "[\"user@example.com\",\"user2@example.com\"]",
    },
    {
      name: "mobiles_json",
      displayNameEn: "Mobiles(JSON Array)",
      displayNameZh: "手机号数组(JSON)",
      target: "data",
      key: "mobiles",
      valueType: "json",
      placeholder: "[\"13800000000\"]",
    },
  ],
  validatePayload: (payload) => {
    expectAtLeastOneNestedField(payload, "data", ["emails", "mobiles"])
  },
  invokeSdk: (client, payload) => client.contact.user.batchGetId(payload),
})

const departmentCreateTool = createFeishuSdkTool({
  name: "feishu_contact_department_create",
  displayNameEn: "Feishu Contact Department Create",
  displayNameZh: "飞书创建部门",
  descriptionEn: "Create department by contact.department.create",
  descriptionZh: "使用 contact.department.create 创建部门",
  uiFields: [
    {
      name: "department_name",
      displayNameEn: "Department Name",
      displayNameZh: "部门名称",
      target: "data",
      key: "name",
      required: true,
      placeholder: "研发部",
    },
    {
      name: "parent_department_id",
      displayNameEn: "Parent Department ID",
      displayNameZh: "父部门 ID",
      target: "data",
      key: "parent_department_id",
      placeholder: "0",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "name")
  },
  invokeSdk: (client, payload) => client.contact.department.create(payload),
})

const departmentUpdateTool = createFeishuSdkTool({
  name: "feishu_contact_department_update",
  displayNameEn: "Feishu Contact Department Update",
  displayNameZh: "飞书更新部门",
  descriptionEn: "Update department by contact.department.patch",
  descriptionZh: "使用 contact.department.patch 更新部门",
  uiFields: [
    {
      name: "department_id",
      displayNameEn: "Department ID",
      displayNameZh: "部门 ID",
      target: "path",
      key: "department_id",
      required: true,
      placeholder: "od-xxx",
    },
    {
      name: "department_name",
      displayNameEn: "Department Name",
      displayNameZh: "部门名称",
      target: "data",
      key: "name",
      placeholder: "研发一部",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "department_id")
  },
  invokeSdk: (client, payload) => client.contact.department.patch(payload),
})

const departmentDeleteTool = createFeishuSdkTool({
  name: "feishu_contact_department_delete",
  displayNameEn: "Feishu Contact Department Delete",
  displayNameZh: "飞书删除部门",
  descriptionEn: "Delete department by contact.department.delete",
  descriptionZh: "使用 contact.department.delete 删除部门",
  uiFields: [
    {
      name: "department_id",
      displayNameEn: "Department ID",
      displayNameZh: "部门 ID",
      target: "path",
      key: "department_id",
      required: true,
      placeholder: "od-xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "department_id")
  },
  invokeSdk: (client, payload) => client.contact.department.delete(payload),
})

const departmentBatchGetTool = createFeishuSdkTool({
  name: "feishu_contact_department_batch_get",
  displayNameEn: "Feishu Contact Department Batch Get",
  displayNameZh: "飞书批量获取部门信息",
  descriptionEn: "Batch get departments by contact.department.batch",
  descriptionZh: "使用 contact.department.batch 批量获取部门信息",
  uiFields: [
    {
      name: "department_id_type",
      displayNameEn: "Department ID Type",
      displayNameZh: "部门 ID 类型",
      target: "params",
      key: "department_id_type",
      placeholder: "department_id / open_department_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "department_ids")
  },
  invokeSdk: (client, payload) => client.contact.department.batch(payload),
})

const departmentListTool = createFeishuSdkTool({
  name: "feishu_contact_department_list",
  displayNameEn: "Feishu Contact Department List",
  displayNameZh: "飞书获取部门列表",
  descriptionEn: "List departments by contact.department.list",
  descriptionZh: "使用 contact.department.list 获取部门列表",
  uiFields: [
    {
      name: "parent_department_id",
      displayNameEn: "Parent Department ID",
      displayNameZh: "父部门 ID",
      target: "params",
      key: "parent_department_id",
      placeholder: "0",
    },
    {
      name: "fetch_child",
      displayNameEn: "Fetch Child Departments",
      displayNameZh: "递归拉取子部门",
      target: "params",
      key: "fetch_child",
      valueType: "boolean",
      placeholder: "true / false",
    },
  ],
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.contact.department.list(payload),
})

const departmentSearchTool = createFeishuSdkTool({
  name: "feishu_contact_department_search",
  displayNameEn: "Feishu Contact Department Search",
  displayNameZh: "飞书搜索部门",
  descriptionEn: "Search departments by contact.department.search",
  descriptionZh: "使用 contact.department.search 搜索部门",
  uiFields: [
    {
      name: "department_name",
      displayNameEn: "Department Name",
      displayNameZh: "部门名称",
      target: "data",
      key: "query",
      placeholder: "研发",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "query")
  },
  invokeSdk: (client, payload) => client.contact.department.search(payload),
})

const messageSendTool = createFeishuSdkTool({
  name: "feishu_im_message_send",
  displayNameEn: "Feishu IM Message Send",
  displayNameZh: "飞书发送消息",
  descriptionEn: "Send message by im.message.create",
  descriptionZh: "使用 im.message.create 发送消息",
  uiFields: [
    {
      name: "receive_id_type",
      displayNameEn: "Receive ID Type",
      displayNameZh: "接收者 ID 类型",
      target: "params",
      key: "receive_id_type",
      required: true,
      placeholder: "open_id / user_id / union_id / chat_id / email",
    },
    {
      name: "receive_id",
      displayNameEn: "Receive ID",
      displayNameZh: "接收者 ID",
      target: "data",
      key: "receive_id",
      required: true,
      placeholder: "ou_xxx",
    },
    {
      name: "msg_type",
      displayNameEn: "Message Type",
      displayNameZh: "消息类型",
      target: "data",
      key: "msg_type",
      required: true,
      placeholder: "text",
    },
    {
      name: "content",
      displayNameEn: "Message Content(JSON String)",
      displayNameZh: "消息内容(JSON 字符串)",
      target: "data",
      key: "content",
      required: true,
      placeholder: "{\"text\":\"hello\"}",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "params", "receive_id_type")
    expectNestedString(payload, "data", "receive_id")
    expectNestedString(payload, "data", "msg_type")
    expectNestedString(payload, "data", "content")
  },
  invokeSdk: (client, payload) => client.im.message.create(payload),
})

const messageBatchSendTool = createFeishuSdkTool({
  name: "feishu_im_message_batch_send",
  displayNameEn: "Feishu IM Message Batch Send",
  displayNameZh: "飞书批量发送消息",
  descriptionEn: "Batch send message by im.message.forward",
  descriptionZh: "使用 im.message.forward 批量发送消息",
  uiFields: [
    {
      name: "message_id",
      displayNameEn: "Message ID",
      displayNameZh: "消息 ID",
      target: "path",
      key: "message_id",
      required: true,
      placeholder: "om_xxx",
    },
    {
      name: "to_ids_json",
      displayNameEn: "Target IDs(JSON Array)",
      displayNameZh: "目标接收者 ID 数组(JSON)",
      target: "data",
      key: "to_ids",
      valueType: "json",
      placeholder: "[\"ou_xxx\",\"ou_yyy\"]",
    },
    {
      name: "receive_id_type",
      displayNameEn: "Receive ID Type",
      displayNameZh: "接收者 ID 类型",
      target: "params",
      key: "receive_id_type",
      placeholder: "open_id / user_id / union_id / chat_id / email",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "message_id")
  },
  invokeSdk: (client, payload) => client.im.message.forward(payload),
})

const imageUploadTool = createFeishuSdkTool({
  name: "feishu_im_image_upload",
  displayNameEn: "Feishu IM Image Upload",
  displayNameZh: "飞书上传图片",
  descriptionEn: "Upload image by im.image.create",
  descriptionZh: "使用 im.image.create 上传图片",
  validatePayload: (payload) => {
    expectAtLeastOneNestedField(payload, "data", ["image", "image_key"])
  },
  invokeSdk: (client, payload) => client.im.image.create(payload),
})

const imageDownloadTool = createFeishuSdkTool({
  name: "feishu_im_image_download",
  displayNameEn: "Feishu IM Image Download",
  displayNameZh: "飞书下载图片",
  descriptionEn: "Download image by im.image.get",
  descriptionZh: "使用 im.image.get 下载图片",
  uiFields: [
    {
      name: "image_key",
      displayNameEn: "Image Key",
      displayNameZh: "图片 Key",
      target: "path",
      key: "image_key",
      required: true,
      placeholder: "img_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "image_key")
  },
  invokeSdk: (client, payload) => client.im.image.get(payload),
})

const fileUploadTool = createFeishuSdkTool({
  name: "feishu_im_file_upload",
  displayNameEn: "Feishu IM File Upload",
  displayNameZh: "飞书上传文件",
  descriptionEn: "Upload file by im.file.create",
  descriptionZh: "使用 im.file.create 上传文件",
  validatePayload: (payload) => {
    expectAtLeastOneNestedField(payload, "data", ["file", "file_name", "file_type"])
  },
  invokeSdk: (client, payload) => client.im.file.create(payload),
})

const fileDownloadTool = createFeishuSdkTool({
  name: "feishu_im_file_download",
  displayNameEn: "Feishu IM File Download",
  displayNameZh: "飞书下载文件",
  descriptionEn: "Download file by im.file.get",
  descriptionZh: "使用 im.file.get 下载文件",
  uiFields: [
    {
      name: "file_key",
      displayNameEn: "File Key",
      displayNameZh: "文件 Key",
      target: "path",
      key: "file_key",
      required: true,
      placeholder: "file_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "file_key")
  },
  invokeSdk: (client, payload) => client.im.file.get(payload),
})

const calendarSharedCreateTool = createFeishuSdkTool({
  name: "feishu_calendar_shared_create",
  displayNameEn: "Feishu Calendar Shared Create",
  displayNameZh: "飞书创建共享日历",
  descriptionEn: "Create shared calendar by calendar.calendar.create",
  descriptionZh: "使用 calendar.calendar.create 创建共享日历",
  uiFields: [
    {
      name: "summary",
      displayNameEn: "Calendar Summary",
      displayNameZh: "日历标题",
      target: "data",
      key: "summary",
      required: true,
      placeholder: "团队日历",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "summary")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.create(payload),
})

const calendarSharedDeleteTool = createFeishuSdkTool({
  name: "feishu_calendar_shared_delete",
  displayNameEn: "Feishu Calendar Shared Delete",
  displayNameZh: "飞书删除共享日历",
  descriptionEn: "Delete shared calendar by calendar.calendar.delete",
  descriptionZh: "使用 calendar.calendar.delete 删除共享日历",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.delete(payload),
})

const calendarPrimaryGetTool = createFeishuSdkTool({
  name: "feishu_calendar_primary_get",
  displayNameEn: "Feishu Calendar Primary Get",
  displayNameZh: "飞书查询主日历信息",
  descriptionEn: "Get primary calendar by calendar.calendar.primary",
  descriptionZh: "使用 calendar.calendar.primary 查询主日历信息",
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.calendar.calendar.primary(payload),
})

const calendarPrimaryBatchGetTool = createFeishuSdkTool({
  name: "feishu_calendar_primary_batch_get",
  displayNameEn: "Feishu Calendar Primary Batch Get",
  displayNameZh: "飞书批量获取主日历信息",
  descriptionEn: "Batch get primary calendars by calendar.calendar.primarys",
  descriptionZh: "使用 calendar.calendar.primarys 批量获取主日历信息",
  uiFields: [
    {
      name: "user_id_type",
      displayNameEn: "User ID Type",
      displayNameZh: "用户 ID 类型",
      target: "params",
      key: "user_id_type",
      placeholder: "open_id / user_id / union_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "user_ids")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.primarys(payload),
})

const calendarGetTool = createFeishuSdkTool({
  name: "feishu_calendar_get",
  displayNameEn: "Feishu Calendar Get",
  displayNameZh: "飞书查询日历信息",
  descriptionEn: "Get calendar by calendar.calendar.get",
  descriptionZh: "使用 calendar.calendar.get 查询日历信息",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.get(payload),
})

const calendarBatchGetTool = createFeishuSdkTool({
  name: "feishu_calendar_batch_get",
  displayNameEn: "Feishu Calendar Batch Get",
  displayNameZh: "飞书批量查询日历信息",
  descriptionEn: "Batch get calendars by calendar.calendar.mget",
  descriptionZh: "使用 calendar.calendar.mget 批量查询日历信息",
  uiFields: [
    {
      name: "calendar_ids_json",
      displayNameEn: "Calendar IDs(JSON Array)",
      displayNameZh: "日历 ID 数组(JSON)",
      target: "data",
      key: "calendar_ids",
      valueType: "json",
      placeholder: "[\"cal_xxx\",\"cal_yyy\"]",
    },
    {
      name: "calendar_id_type",
      displayNameEn: "Calendar ID Type",
      displayNameZh: "日历 ID 类型",
      target: "params",
      key: "calendar_id_type",
      placeholder: "calendar_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "calendar_ids")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.mget(payload),
})

const calendarListTool = createFeishuSdkTool({
  name: "feishu_calendar_list",
  displayNameEn: "Feishu Calendar List",
  displayNameZh: "飞书查询日历列表",
  descriptionEn: "List calendars by calendar.calendar.list",
  descriptionZh: "使用 calendar.calendar.list 查询日历列表",
  uiFields: [
    {
      name: "page_size",
      displayNameEn: "Page Size",
      displayNameZh: "分页大小",
      target: "params",
      key: "page_size",
      valueType: "number",
      placeholder: "50",
    },
  ],
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.calendar.calendar.list(payload),
})

const calendarUpdateTool = createFeishuSdkTool({
  name: "feishu_calendar_update",
  displayNameEn: "Feishu Calendar Update",
  displayNameZh: "飞书更新日历信息",
  descriptionEn: "Update calendar by calendar.calendar.patch",
  descriptionZh: "使用 calendar.calendar.patch 更新日历信息",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.patch(payload),
})

const calendarSearchTool = createFeishuSdkTool({
  name: "feishu_calendar_search",
  displayNameEn: "Feishu Calendar Search",
  displayNameZh: "飞书搜索日历",
  descriptionEn: "Search calendars by calendar.calendar.search",
  descriptionZh: "使用 calendar.calendar.search 搜索日历",
  uiFields: [
    {
      name: "query",
      displayNameEn: "Query",
      displayNameZh: "搜索关键词",
      target: "data",
      key: "query",
      required: true,
      placeholder: "团队",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "query")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.search(payload),
})

const eventCreateTool = createFeishuSdkTool({
  name: "feishu_calendar_event_create",
  displayNameEn: "Feishu Calendar Event Create",
  displayNameZh: "飞书创建日程",
  descriptionEn: "Create event by calendar.event.create",
  descriptionZh: "使用 calendar.event.create 创建日程",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
    {
      name: "summary",
      displayNameEn: "Event Summary",
      displayNameZh: "日程标题",
      target: "data",
      key: "summary",
      required: true,
      placeholder: "项目例会",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "data", "summary")
  },
  invokeSdk: (client, payload) => client.calendar.event.create(payload),
})

const eventDeleteTool = createFeishuSdkTool({
  name: "feishu_calendar_event_delete",
  displayNameEn: "Feishu Calendar Event Delete",
  displayNameZh: "飞书删除日程",
  descriptionEn: "Delete event by calendar.event.delete",
  descriptionZh: "使用 calendar.event.delete 删除日程",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
    {
      name: "event_id",
      displayNameEn: "Event ID",
      displayNameZh: "日程 ID",
      target: "path",
      key: "event_id",
      required: true,
      placeholder: "evt_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "path", "event_id")
  },
  invokeSdk: (client, payload) => client.calendar.event.delete(payload),
})

const eventUpdateTool = createFeishuSdkTool({
  name: "feishu_calendar_event_update",
  displayNameEn: "Feishu Calendar Event Update",
  displayNameZh: "飞书更新日程",
  descriptionEn: "Update event by calendar.event.patch",
  descriptionZh: "使用 calendar.event.patch 更新日程",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
    {
      name: "event_id",
      displayNameEn: "Event ID",
      displayNameZh: "日程 ID",
      target: "path",
      key: "event_id",
      required: true,
      placeholder: "evt_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "path", "event_id")
  },
  invokeSdk: (client, payload) => client.calendar.event.patch(payload),
})

const eventGetTool = createFeishuSdkTool({
  name: "feishu_calendar_event_get",
  displayNameEn: "Feishu Calendar Event Get",
  displayNameZh: "飞书获取日程",
  descriptionEn: "Get event by calendar.event.get",
  descriptionZh: "使用 calendar.event.get 获取日程",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
    {
      name: "event_id",
      displayNameEn: "Event ID",
      displayNameZh: "日程 ID",
      target: "path",
      key: "event_id",
      required: true,
      placeholder: "evt_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "path", "event_id")
  },
  invokeSdk: (client, payload) => client.calendar.event.get(payload),
})

const eventListTool = createFeishuSdkTool({
  name: "feishu_calendar_event_list",
  displayNameEn: "Feishu Calendar Event List",
  displayNameZh: "飞书获取日程列表",
  descriptionEn: "List events by calendar.event.list",
  descriptionZh: "使用 calendar.event.list 获取日程列表",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
    {
      name: "page_size",
      displayNameEn: "Page Size",
      displayNameZh: "分页大小",
      target: "params",
      key: "page_size",
      valueType: "number",
      placeholder: "50",
    },
    {
      name: "ignore_cancelled",
      displayNameEn: "Ignore Cancelled",
      displayNameZh: "忽略已取消日程",
      target: "params",
      key: "ignore_cancelled",
      valueType: "boolean",
      placeholder: "true / false",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
  },
  invokeSdk: (client, payload) => client.calendar.event.list(payload),
})

const eventSearchTool = createFeishuSdkTool({
  name: "feishu_calendar_event_search",
  displayNameEn: "Feishu Calendar Event Search",
  displayNameZh: "飞书搜索日程",
  descriptionEn: "Search events by calendar.event.search",
  descriptionZh: "使用 calendar.event.search 搜索日程",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
    {
      name: "query",
      displayNameEn: "Query",
      displayNameZh: "搜索关键词",
      target: "data",
      key: "query",
      required: true,
      placeholder: "例会",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "data", "query")
  },
  invokeSdk: (client, payload) => client.calendar.event.search(payload),
})

export const priorityFeishuTools: ToolDefinition[] = [
  userCreateTool,
  userUpdateTool,
  userResignTool,
  userBatchGetTool,
  userListTool,
  userSearchTool,
  departmentCreateTool,
  departmentUpdateTool,
  departmentDeleteTool,
  departmentBatchGetTool,
  departmentListTool,
  departmentSearchTool,
  messageSendTool,
  messageBatchSendTool,
  imageUploadTool,
  imageDownloadTool,
  fileUploadTool,
  fileDownloadTool,
  calendarSharedCreateTool,
  calendarSharedDeleteTool,
  calendarPrimaryGetTool,
  calendarPrimaryBatchGetTool,
  calendarGetTool,
  calendarBatchGetTool,
  calendarListTool,
  calendarUpdateTool,
  calendarSearchTool,
  eventCreateTool,
  eventDeleteTool,
  eventUpdateTool,
  eventGetTool,
  eventListTool,
  eventSearchTool,
]
