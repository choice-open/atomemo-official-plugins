/* eslint-disable typescript-sort-keys/interface */
import type {
  PropertyDiscriminatedUnion,
  PropertyObject,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../../i18n/i18n-node";
import { richTextArrayParameter, titleArrayParameter } from "./richtext";
import {
  selectOptionParameter,
  statusSelectOptionParameter,
} from "./select-option";

export const propertiesValue: PropertyDiscriminatedUnion<"value", "type"> = {
  name: "value",
  type: "discriminated_union",
  required: true,
  display_name: t("PAGE_PROPERTIES_VALUE_DISPLAY_NAME"),
  ui: {
    hint: t("PAGE_PROPERTIES_VALUE_HINT"),
  },
  discriminator: "type",
  any_of: [
    {
      type: "object",
      name: "title",
      display_name: t("PAGE_PROPERTIES_TITLE_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_TITLE_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "title",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        titleArrayParameter,
      ],
    },
    {
      type: "object",
      name: "rich_text",
      display_name: t("PAGE_PROPERTIES_RICH_TEXT_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_RICH_TEXT_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "rich_text",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        richTextArrayParameter,
      ],
    },
    {
      type: "object",
      name: "number",
      display_name: t("PAGE_PROPERTIES_NUMBER_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_NUMBER_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "number",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "number",
          type: "number",
          required: true,
          ui: { component: "number-input", support_expression: true },
        },
      ],
    },
    {
      type: "object",
      name: "url",
      display_name: t("PAGE_PROPERTIES_URL_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_URL_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "url",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "url",
          type: "string",
          required: true,
          ui: { component: "input", support_expression: true },
        },
      ],
    },
    {
      type: "object",
      name: "select",
      display_name: t("PAGE_PROPERTIES_SELECT_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_SELECT_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "select",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          ...selectOptionParameter,
          ui: {
            component: "section",
          },
        },
      ],
    },
    {
      type: "object",
      name: "multi_select",
      display_name: t("PAGE_PROPERTIES_MULTI_SELECT_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_MULTI_SELECT_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "multi_select",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "multi_select",
          type: "array",
          items: selectOptionParameter,
          required: true,
        },
      ],
    },
    {
      type: "object",
      name: "people",
      display_name: t("PAGE_PROPERTIES_PEOPLE_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_PEOPLE_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "people",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "people",
          type: "array",
          items: {
            type: "discriminated_union",
            name: "person",
            discriminator: "object",
            any_of: [
              {
                type: "object",
                name: "user",
                properties: [
                  {
                    name: "object",
                    type: "string",
                    constant: "user",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "id",
                    type: "string",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                ],
              },
              {
                type: "object",
                name: "group",
                properties: [
                  {
                    name: "object",
                    type: "string",
                    constant: "group",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "id",
                    type: "string",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "name",
                    type: "string",
                    required: false,
                    ui: { component: "input", support_expression: true },
                  },
                ],
              },
            ],
          } satisfies PropertyDiscriminatedUnion<"person", "object">,
          required: true,
        },
      ],
    },
    {
      type: "object",
      name: "email",
      display_name: t("PAGE_PROPERTIES_EMAIL_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_EMAIL_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "email",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "email",
          type: "string",
          required: true,
          ui: { component: "input", support_expression: true },
        },
      ],
    },
    {
      type: "object",
      name: "phone_number",
      display_name: t("PAGE_PROPERTIES_PHONE_NUMBER_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_PHONE_NUMBER_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "phone_number",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "phone_number",
          type: "string",
          required: true,
          ui: { component: "input", support_expression: true },
        },
      ],
    },
    {
      type: "object",
      name: "date",
      display_name: t("PAGE_PROPERTIES_DATE_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_DATE_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "date",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "date",
          type: "object",
          properties: [
            {
              name: "start",
              type: "string",
              required: true,
              ui: { component: "input", support_expression: true },
            },
            {
              name: "end",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
            {
              name: "time_zone",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
          ],
          required: false,
        },
      ],
    },
    {
      type: "object",
      name: "checkbox",
      display_name: t("PAGE_PROPERTIES_CHECKBOX_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_CHECKBOX_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "checkbox",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "checkbox",
          type: "boolean",
          required: true,
          ui: { component: "switch", support_expression: true },
        },
      ],
    },
    {
      type: "object",
      name: "relation",
      display_name: t("PAGE_PROPERTIES_RELATION_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_RELATION_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "relation",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "relation",
          type: "array",
          items: {
            type: "object",
            name: "relation_item",
            properties: [
              {
                name: "id",
                type: "string",
                required: true,
                ui: { component: "input", support_expression: true },
              },
            ],
          },
          required: true,
        },
      ],
    },
    {
      type: "object",
      name: "files",
      display_name: t("PAGE_PROPERTIES_FILES_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_FILES_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "files",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "files",
          type: "array",
          items: {
            type: "discriminated_union",
            name: "file",
            discriminator: "type",
            any_of: [
              {
                type: "object",
                name: "external",
                properties: [
                  {
                    name: "type",
                    type: "string",
                    constant: "external",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "name",
                    type: "string",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "external",
                    type: "object",
                    required: true,
                    properties: [
                      {
                        name: "url",
                        type: "string",
                        required: true,
                        ui: { component: "input", support_expression: true },
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "file",
                properties: [
                  {
                    name: "type",
                    type: "string",
                    constant: "file",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "name",
                    type: "string",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "file",
                    type: "object",
                    required: true,
                    properties: [
                      {
                        name: "url",
                        type: "string",
                        required: true,
                        ui: { component: "input", support_expression: true },
                      },
                      {
                        name: "expiry_time",
                        type: "string",
                        required: false,
                        ui: { component: "input", support_expression: true },
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "file_upload",
                properties: [
                  {
                    name: "type",
                    type: "string",
                    constant: "file_upload",
                    required: true,
                    ui: { component: "input", support_expression: true },
                  },
                  {
                    name: "name",
                    type: "string",
                    required: false,
                    ui: { component: "input" },
                  },
                  {
                    name: "file_upload",
                    type: "object",
                    required: true,
                    properties: [
                      {
                        name: "id",
                        type: "string",
                        required: true,
                        ui: { component: "input", support_expression: true },
                      },
                    ],
                  },
                ],
              },
            ],
          } satisfies PropertyDiscriminatedUnion<"file", "type">,
          required: true,
        },
      ],
    },
    {
      type: "object",
      name: "status",
      display_name: t("PAGE_PROPERTIES_STATUS_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_STATUS_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "status",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        statusSelectOptionParameter,
      ],
    },
    {
      type: "object",
      name: "place",
      display_name: t("PAGE_PROPERTIES_PLACE_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        hint: t("PAGE_PROPERTIES_PLACE_HINT"),
      },
      properties: [
        {
          name: "type",
          type: "string",
          constant: "place",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "place",
          type: "object",
          properties: [
            {
              name: "lat",
              type: "number",
              required: true,
              ui: { component: "number-input", support_expression: true },
            },
            {
              name: "lon",
              type: "number",
              required: true,
              ui: { component: "number-input", support_expression: true },
            },
            {
              name: "name",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
            {
              name: "address",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
            {
              name: "google_place_id",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
            {
              name: "aws_place_id",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
          ],
          required: true,
        },
      ],
    },
  ],
};

export const pagePropertiesProperty: PropertyObject<"properties"> = {
  name: "properties",
  type: "object",
  properties: [],
  additional_properties: propertiesValue,
  display_name: t("PAGE_PROPERTIES_PROPERTIES_DISPLAY_NAME"),
  ai: {
    llm_description: t("PAGE_PROPERTIES_PROPERTIES_LLM_DESCRIPTION"),
  },
  ui: {
    component: "section",
  },
};
