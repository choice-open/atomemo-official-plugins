import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import type { UpdatePageParameters } from "@notionhq/client";
import { t } from "../i18n/i18n-node";
import { notionCredentialParameter } from "./_shared-parameters/credential";
import { iconProperty } from "./_shared-parameters/icon";
import { pageIdProperty } from "./_shared-parameters/page-id";
import { pagePropertiesProperty } from "./_shared-parameters/page-properties/page-properties";
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output";

type ParametersNames =
  | Extract<
      keyof UpdatePageParameters,
      "page_id" | "properties" | "archived" | "icon"
    >
  | "api_key"
  | "simplify_output";

export const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  pageIdProperty,
  pagePropertiesProperty,
  iconProperty,
  simplifyOutputProperty,
];

export const updateAPageInADatabaseTool: ToolDefinition = {
  name: "notion-update-page-in-database",
  display_name: t("UPDATE_PAGE_TOOL_DISPLAY_NAME"),
  description: t("UPDATE_PAGE_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async () => ({
    error: "Not implemented",
  }),
};
