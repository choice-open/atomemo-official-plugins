export type FeishuApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

/** 各 tool 文件内与飞书 HTTP 接口一一对应的元数据（id、path、method 等） */
export type FeishuApiFunction = {
  /** 主标识：语义化 snake_case */
  id: string
  /** 与文档「功能索引」序号一致的兼容别名，例如 f001 */
  legacy_id: string
  module: "contact" | "im" | "calendar" | "task" | "approval"
  name: string
  method: FeishuApiMethod
  path: string
}
