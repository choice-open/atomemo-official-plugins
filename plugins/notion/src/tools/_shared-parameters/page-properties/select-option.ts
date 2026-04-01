import type {
  PropertyObject,
  PropertyUIOption,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import type { SelectColor } from "./type"

const selectColors: Record<SelectColor, SelectColor> = {
  default: "default",
  gray: "gray",
  brown: "brown",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  purple: "purple",
  pink: "pink",
  red: "red",
}

const selectColorLabels: Record<
  SelectColor,
  {
    en_US: string
    zh_Hans: string
  }
> = {
  default: { en_US: "Default", zh_Hans: "默认" },
  gray: { en_US: "Gray", zh_Hans: "灰色" },
  brown: { en_US: "Brown", zh_Hans: "棕色" },
  orange: { en_US: "Orange", zh_Hans: "橙色" },
  yellow: { en_US: "Yellow", zh_Hans: "黄色" },
  green: { en_US: "Green", zh_Hans: "绿色" },
  blue: { en_US: "Blue", zh_Hans: "蓝色" },
  purple: { en_US: "Purple", zh_Hans: "紫色" },
  pink: { en_US: "Pink", zh_Hans: "粉色" },
  red: { en_US: "Red", zh_Hans: "红色" },
}

const selectColorOptions: PropertyUIOption[] = Object.entries(selectColors).map(
  ([value]) => ({
    value,
    label: selectColorLabels[value as SelectColor],
  }),
)

export const selectOptionParameter: PropertyObject<"select"> = {
  name: "select",
  type: "object",
  display_name: t("BLOCKS_SELECT_OPTION_DISPLAY_NAME"),
  properties: [
    {
      type: "string",
      name: "id",
      display_name: t("ID_DISPLAY_NAME"),
      ui: { component: "input", support_expression: true },
    },
    {
      type: "string",
      name: "name",
      display_name: t("NAME_DISPLAY_NAME"),
      ui: { component: "input", support_expression: true },
    },
    {
      type: "string",
      name: "description",
      display_name: t("DESCRIPTION_DISPLAY_NAME"),
      ui: { component: "input", support_expression: true },
    },
    {
      name: "color",
      type: "string",
      display_name: t("COLOR_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: selectColorOptions,
        support_expression: true,
      },
    },
  ],
}

export const statusSelectOptionParameter: PropertyObject<"status"> = {
  ...selectOptionParameter,
  name: "status",
  display_name: t("PAGE_PROPERTIES_STATUS_DISPLAY_NAME"),
}
