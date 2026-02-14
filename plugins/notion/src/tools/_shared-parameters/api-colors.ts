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

export const apiColorOptions: Array<PropertyUIOption> = Object.entries(
  apiColors,
).map(([value]) => {
  return {
    value,
    label: {
      en_US: value.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    },
  }
})
