import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const crawlIdParameter: PropertyString<"id"> = {
  type: "string",
  name: "id",
  required: true,
  display_name: {
    en_US: "ID",
    zh_Hans_CN: "ID",
  },
  ui: {
    component: "input",
    hint: {
      en_US: "The ID of the crawl job",
      zh_Hans_CN: "爬取任务的ID",
    },
    support_expression: true,
  },
}
