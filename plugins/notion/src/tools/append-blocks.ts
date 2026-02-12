import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import type { AppendBlockChildrenParameters } from "@notionhq/client";
import { t } from "../i18n/i18n-node";
import { blocksProperty } from "./_shared-parameters/blocks";
import { notionCredentialParameter } from "./_shared-parameters/credential";
import type { ExcludedNames } from "./_shared-parameters/excluded-names";

type ParametersNames =
  | Exclude<keyof AppendBlockChildrenParameters, ExcludedNames>
  | "notionClient";

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    name: "block_id",
    type: "string",
    required: true,
    ui: { component: "input", support_expression: true },
    display_name: t("APPEND_BLOCKS_BLOCK_ID_DISPLAY_NAME"),
    ai: {
      llm_description: t("APPEND_BLOCKS_BLOCK_ID_LLM_DESCRIPTION"),
    },
  },
  blocksProperty,
  {
    name: "after",
    type: "string",
    required: false,
    ui: { component: "input", support_expression: true },
    display_name: t("APPEND_BLOCKS_AFTER_DISPLAY_NAME"),
    ai: {
      llm_description: t("APPEND_BLOCKS_AFTER_LLM_DESCRIPTION"),
    },
  },
];

export const appendBlocksTool: ToolDefinition = {
  name: "notion-append-blocks",
  display_name: t("APPEND_BLOCKS_TOOL_DISPLAY_NAME"),
  description: t("APPEND_BLOCKS_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async () => ({
    error: "Not implemented",
  }),
};
