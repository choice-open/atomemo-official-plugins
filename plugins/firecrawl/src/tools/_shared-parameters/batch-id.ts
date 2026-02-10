import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const batchIdParameter: PropertyString<"batchId"> = {
  name: "batchId",
  type: "string",
  display_name: {
    en_US: "Batch ID",
    zh_Hans_CN: "批次ID",
  },
  required: true,
  ui: {
    component: "input",
    hint: {
      en_US: "ID of the batch scrape job",
      zh_Hans_CN: "批量爬取作业的ID",
    },
    support_expression: true,
  },
}
