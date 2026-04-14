export type FeishuApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** 各 tool 文件内与飞书 HTTP 接口一一对应的元数据（id、path、method 等） */
export type FeishuApiFunction = {
  /** 主标识：语义化 snake_case */
  id: string;
  module: "contact" | "im" | "calendar" | "task" | "approval" | "organization";
  name: string;
  method: FeishuApiMethod;
  path: string;
};

export type FeishuApiFunctionV2 = {
  id: string;
  module: "contact_v2";
  name: string;
  method: FeishuApiMethod;
  path: string;
};
