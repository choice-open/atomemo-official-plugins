import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  invokeFeishuOpenApi,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import { parseTasklistListQuery } from "./task.zod";
import tasklist_listSkill from "./tasklist-list-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "tasklist_list",
  module: "task",
  name: "获取清单列表",
  method: "GET",
  path: "/open-apis/task/v2/tasklists",
};

export const feishuTasklistListTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List tasklists",
    zh_Hans: "获取清单列表",
  },
  description: {
    en_US: "This API is used to list tasklists.",
    zh_Hans: "本接口用于获取清单列表。",
  },
  skill: tasklist_listSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "page_size",
      type: "integer",
      required: false,
      display_name: { en_US: "Page Size", zh_Hans: "分页大小" },
      ui: {
        component: "number-input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"page_size">,
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: { en_US: "Page Token", zh_Hans: "分页游标" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"page_token">,
    {
      name: "user_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" },
      ui: {
        component: "input",
        placeholder: {
          en_US: "open_id | union_id | user_id",
          zh_Hans: "open_id | union_id | user_id",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"user_id_type">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const optionalString = (key: string): string | undefined => {
      const raw = p[key];
      if (typeof raw !== "string") return undefined;
      const trimmed = raw.trim();
      return trimmed === "" ? undefined : trimmed;
    };
    const pageSizeRaw = optionalString("page_size");
    const pageSize =
      pageSizeRaw && Number.isInteger(Number(pageSizeRaw))
        ? Number(pageSizeRaw)
        : undefined;
    const pageToken = optionalString("page_token");
    const userIdType = optionalString("user_id_type");
    const queryParams = parseTasklistListQuery({
      ...(pageSize !== undefined ? { page_size: pageSize } : {}),
      ...(pageToken ? { page_token: pageToken } : {}),
      ...(userIdType ? { user_id_type: userIdType } : {}),
    });
    const body = {};
    const pathParams = {};
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    });
  },
};
