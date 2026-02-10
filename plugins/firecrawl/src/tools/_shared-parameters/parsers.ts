import type { PropertyArray } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const parsersParameter: PropertyArray<"parsers"> = {
  name: "parsers",
  type: "array",
  display_name: {
    en_US: "Parsers",
    zh_Hans_CN: "解析器",
  },
  items: {
    name: "parser",
    type: "string",
  },
  constant: ["pdf"],
  ui: {
    component: "multi-select",
    options: [
      {
        label: {
          en_US: "PDF",
          zh_Hans_CN: "PDF",
        },
        value: "pdf",
      },
    ],
  },
}
