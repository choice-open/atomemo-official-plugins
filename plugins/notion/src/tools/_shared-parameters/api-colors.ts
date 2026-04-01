import type { PropertyUIOption } from "@choiceopen/atomemo-plugin-schema/types"
import type { ApiColor } from "./page-properties/type"

export const apiColors: Record<ApiColor, ApiColor> = {
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
  default_background: "default_background",
  gray_background: "gray_background",
  brown_background: "brown_background",
  orange_background: "orange_background",
  yellow_background: "yellow_background",
  green_background: "green_background",
  blue_background: "blue_background",
  purple_background: "purple_background",
  pink_background: "pink_background",
  red_background: "red_background",
}

const apiColorLabels: Record<
  ApiColor,
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
  default_background: {
    en_US: "Default Background",
    zh_Hans: "默认背景",
  },
  gray_background: { en_US: "Gray Background", zh_Hans: "灰色背景" },
  brown_background: { en_US: "Brown Background", zh_Hans: "棕色背景" },
  orange_background: { en_US: "Orange Background", zh_Hans: "橙色背景" },
  yellow_background: { en_US: "Yellow Background", zh_Hans: "黄色背景" },
  green_background: { en_US: "Green Background", zh_Hans: "绿色背景" },
  blue_background: { en_US: "Blue Background", zh_Hans: "蓝色背景" },
  purple_background: { en_US: "Purple Background", zh_Hans: "紫色背景" },
  pink_background: { en_US: "Pink Background", zh_Hans: "粉色背景" },
  red_background: { en_US: "Red Background", zh_Hans: "红色背景" },
}

export const apiColorOptions: Array<PropertyUIOption> = Object.entries(
  apiColors,
).map(([value]) => {
  return {
    value,
    label: apiColorLabels[value as ApiColor],
  }
})
