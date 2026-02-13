import type {
  PropertyObject,
  PropertyUIOption,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import type { SelectColor } from "./type";

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
};

const selectColorOptions: PropertyUIOption[] = Object.entries(selectColors).map(
  ([value]) => ({
    value,
    label: {
      en_US: value,
      zh_Hans: value,
    },
  }),
);

export const selectOptionParameter: PropertyObject<"select"> = {
  name: "select",
  type: "object",
  properties: [
    {
      type: "string",
      name: "id",
      ui: { component: "input", support_expression: true },
    },
    {
      type: "string",
      name: "name",
      ui: { component: "input", support_expression: true },
    },
    {
      type: "string",
      name: "description",
      ui: { component: "input", support_expression: true },
    },
    {
      name: "color",
      type: "string",
      ui: {
        component: "select",
        options: selectColorOptions,
        support_expression: true,
      },
    },
  ],
};

export const statusSelectOptionParameter: PropertyObject<"status"> = {
  ...selectOptionParameter,
  name: "status",
};
