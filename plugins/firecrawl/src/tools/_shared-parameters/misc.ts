import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"

// Custom Body
export const customBodyParameter: PropertyString<"customBody"> = {
  name: "customBody",
  type: "string",
  display_name: {
    en_US: "Request Body",
    zh_Hans_CN: "请求体",
  },
  ui: {
    component: "code-editor",
    language: "json",
    line_numbers: false,
    support_expression: true,
  },
  default: "{}",
}
