import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { GetDatabaseParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  getNotionClient,
  getSimplifyOutputFlag,
  handleNotionError,
  transformNotionOutput,
} from "./_shared/notion-helpers"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import type { ExcludedNames } from "./_shared-parameters/excluded-names"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"
import getADatabaseSkill from "./get-a-database-skill.md" with { type: "text" }

type ParametersNames =
  | Exclude<keyof GetDatabaseParameters, ExcludedNames>
  | "api_key"
  | "simplify_output"

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    name: "database_id",
    type: "string",
    required: true,
    display_name: t("GET_DATABASE_DATABASE_ID_DISPLAY_NAME"),
    ai: {
      llm_description: t("GET_DATABASE_DATABASE_ID_LLM_DESCRIPTION"),
    },
    ui: {
      component: "input",
      placeholder: {
        en_US: "e.g. a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      },
      support_expression: true,
    },
  },
  simplifyOutputProperty,
]

export const getADatabaseTool: ToolDefinition = {
  name: "notion-get-database",
  display_name: t("GET_DATABASE_TOOL_DISPLAY_NAME"),
  description: t("GET_DATABASE_TOOL_DESCRIPTION"),
  icon: "🎛️",
  skill: getADatabaseSkill,
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      throw new Error("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const databaseId =
      typeof rawParameters.database_id === "string"
        ? rawParameters.database_id
        : ""

    if (databaseId === "") {
      throw new Error("database_id is required")
    }

    const simplifyOutput = getSimplifyOutputFlag(rawParameters)
    try {
      const data = await client.databases.retrieve({
        database_id: databaseId,
      } satisfies GetDatabaseParameters)
      return transformNotionOutput(data, simplifyOutput)
    } catch (error) {
      return handleNotionError(error)
    }
  },
}
