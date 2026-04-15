import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseTasklistDeleteQuery } from "./task.zod"
import tasklist_deleteSkill from "./tasklist-delete-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "tasklist_delete",
  module: "task",
  name: "删除清单",
  method: "DELETE",
  path: "/open-apis/task/v2/tasklists/:tasklist_guid",
}

export const feishuTasklistDeleteTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Delete tasklist",
    zh_Hans: "删除清单",
  },
  description: {
    en_US: "This API is used to delete a tasklist.",
    zh_Hans: "本接口用于删除清单。",
  },
  skill: tasklist_deleteSkill,
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
      name: "tasklist_guid",
      type: "string",
      required: true,
      display_name: { en_US: "Tasklist GUID", zh_Hans: "清单 GUID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"tasklist_guid">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseTasklistDeleteQuery({})
    const body = {}
    const pathParams = {
      tasklist_guid: readRequiredStringParam(p, "tasklist_guid"),
    }
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    })
  },
}
