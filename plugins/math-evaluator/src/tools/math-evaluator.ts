import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import * as math from "mathjs"
import { t } from "../i18n/i18n-node"

function toSerializable(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean"
  )
    return value
  if (Array.isArray(value)) return value.map(toSerializable)
  const v = value as { toArray?: () => unknown; toJSON?: () => unknown }
  if (typeof v.toArray === "function") return v.toArray()
  if (typeof v.toJSON === "function") return v.toJSON()
  try {
    return JSON.parse(JSON.stringify(value, math.replacer()))
  } catch {
    return String(value)
  }
}

export const mathEvaluatorTool = {
  name: "math-evaluator",
  display_name: t("MATH_EVALUATOR_DISPLAY_NAME"),
  description: t("MATH_EVALUATOR_DESCRIPTION"),
  icon: "🔢",
  parameters: [
    {
      name: "expression",
      type: "string",
      required: true,
      display_name: t("EXPRESSION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("EXPRESSION_HINT"),
        placeholder: t("EXPRESSION_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const expression = args.parameters.expression as string
    if (!expression || typeof expression !== "string") {
      return {
        success: false,
        error: "Expression is required",
        result: null,
        expression: "",
      }
    }

    try {
      const result = math.evaluate(expression)
      return {
        success: true,
        result: toSerializable(result) as JsonValue,
        expression,
        error: null,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        error: message,
        result: null,
        expression,
      }
    }
  },
} satisfies ToolDefinition
