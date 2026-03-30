import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { searchRecords } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import { searchBasesMethod, searchTablesMethod } from "../_shared/methods"
import {
  baseTableScopeParams,
  listLimitParam,
  RETURN_ALL_PARAM_NAME,
  returnAllParam,
} from "../_shared/parameters"
import { resolveBaseId, resolveTable } from "../_shared/resolve"
import { getAirtableToken } from "../_shared/utils"
import searchRecordsSkill from "./search-records-skill.md" with { type: "text" }

export const searchRecordsTool = {
  name: "airtable-search-records",
  display_name: t("SEARCH_RECORDS_DISPLAY_NAME"),
  description: t("SEARCH_RECORDS_DESCRIPTION"),
  icon: "🔎",
  skill: searchRecordsSkill,

  parameters: [
    ...baseTableScopeParams,
    {
      name: "filter_by_formula",
      type: "string",
      required: false,
      display_name: t("SEARCH_FILTER_FORMULA_LABEL"),
      ai: {
        llm_description: t("SEARCH_FILTER_FORMULA_HINT"),
      },
      ui: {
        component: "textarea",
        hint: t("SEARCH_FILTER_FORMULA_HINT"),
        placeholder: t("SEARCH_FILTER_FORMULA_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    returnAllParam,
    listLimitParam,
    {
      name: "view",
      type: "string",
      required: false,
      display_name: t("SEARCH_VIEW_LABEL"),
      ai: {
        llm_description: t("SEARCH_VIEW_HINT"),
      },
      ui: {
        component: "input",
        hint: t("SEARCH_VIEW_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "output_fields",
      type: "array",
      required: false,
      display_name: t("SEARCH_OUTPUT_FIELDS_LABEL"),
      ai: {
        llm_description: t("SEARCH_OUTPUT_FIELDS_HINT"),
      },
      ui: {
        component: "tag-input",
        hint: t("SEARCH_OUTPUT_FIELDS_HINT"),
        support_expression: true,
      },
      items: { name: "field_name", type: "string" },
    },
    {
      name: "sort",
      type: "array",
      required: false,
      display_name: t("SEARCH_SORT_LABEL"),
      ui: { component: "array-section" },
      items: {
        type: "object",
        name: "sort_rule",
        properties: [
          {
            name: "field",
            type: "string",
            required: true,
            display_name: t("SEARCH_SORT_FIELD_LABEL"),
            ai: {
              llm_description: t("SEARCH_SORT_FIELD_HINT"),
            },
            ui: {
              component: "input",
              hint: t("SEARCH_SORT_FIELD_HINT"),
              support_expression: true,
            },
          },
          {
            name: "direction",
            type: "string",
            required: false,
            default: "asc",
            enum: ["asc", "desc"],
            display_name: t("SEARCH_SORT_DIRECTION_LABEL"),
            ai: {
              llm_description: t("SEARCH_SORT_DIRECTION_HINT"),
            },
            ui: {
              component: "select",
              options: [
                { label: t("SEARCH_SORT_ASC"), value: "asc" },
                { label: t("SEARCH_SORT_DESC"), value: "desc" },
              ],
              support_expression: true,
            },
          },
        ],
      },
    },
  ],
  locator_list: { ...searchBasesMethod, ...searchTablesMethod },
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) {
      throw new Error(
        "Missing Airtable credential. Please select a valid Airtable credential.",
      )
    }

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = resolveBaseId(p)
    const table = resolveTable(p)

    if (!baseId) throw new Error("base_id is required.")
    if (!table) throw new Error("table is required.")

    const filterByFormula =
      String(p["filter_by_formula"] ?? "").trim() || undefined
    const returnAll = p[RETURN_ALL_PARAM_NAME] !== false
    const limitRaw = p["limit"]
    const limitNum =
      typeof limitRaw === "number"
        ? limitRaw
        : typeof limitRaw === "string"
          ? Number(limitRaw)
          : NaN
    const limit =
      Number.isFinite(limitNum) && limitNum >= 1
        ? Math.min(100, Math.floor(limitNum))
        : 100
    const view = String(p["view"] ?? "").trim() || undefined

    const fields =
      Array.isArray(p["output_fields"]) &&
      (p["output_fields"] as string[]).length > 0
        ? (p["output_fields"] as string[]).filter(Boolean)
        : undefined

    const sortRaw = p["sort"]
    const sort = Array.isArray(sortRaw)
      ? sortRaw
          .filter(
            (s): s is { field: string; direction?: "asc" | "desc" } =>
              s && typeof s === "object" && typeof s.field === "string",
          )
          .map((s) => ({
            field: s.field,
            direction: (s.direction === "desc" ? "desc" : "asc") as
              | "asc"
              | "desc",
          }))
      : undefined

    const records = await searchRecords(token, baseId, table, {
      filterByFormula,
      returnAll,
      limit,
      sort,
      view,
      fields,
    })
    return { success: true, records, total: records.length } as any
  },
} satisfies ToolDefinition
