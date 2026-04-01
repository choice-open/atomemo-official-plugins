import type {
  PropertyArray,
  PropertyDiscriminatedUnion,
  PropertyObject,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { apiColorOptions } from "../api-colors"

export const annotationParameter: PropertyObject<"annotations"> = {
  name: "annotations",
  type: "object",
  required: false,
  display_name: t("BLOCKS_ANNOTATIONS_DISPLAY_NAME"),
  properties: [
    {
      name: "bold",
      type: "boolean",
      default: false,
      required: false,
      display_name: t("BLOCKS_ANNOTATION_BOLD_DISPLAY_NAME"),
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "italic",
      type: "boolean",
      default: false,
      required: false,
      display_name: t("BLOCKS_ANNOTATION_ITALIC_DISPLAY_NAME"),
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "strikethrough",
      type: "boolean",
      default: false,
      required: false,
      display_name: t("BLOCKS_ANNOTATION_STRIKETHROUGH_DISPLAY_NAME"),
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "underline",
      type: "boolean",
      default: false,
      required: false,
      display_name: t("BLOCKS_ANNOTATION_UNDERLINE_DISPLAY_NAME"),
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "code",
      type: "boolean",
      default: false,
      required: false,
      display_name: t("BLOCKS_ANNOTATION_CODE_DISPLAY_NAME"),
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "color",
      type: "string",
      required: false,
      default: "default",
      display_name: t("BLOCKS_COLOR_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: apiColorOptions,
        support_expression: true,
      },
    },
  ],
  ui: {
    component: "section",
  },
}

const commonProps = {
  type: "object",
  ui: {
    component: "section",
  },
} as const

// MentionRichTextItemRequest['mention']
export const mentionValueParameter: PropertyDiscriminatedUnion<"type"> = {
  type: "discriminated_union",
  discriminator: "type",
  any_of: [
    {
      name: "user",
      ...commonProps,
      properties: [
        {
          name: "type",
          type: "string",
          constant: "user",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
        },
        {
          name: "user",
          type: "object",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          properties: [
            {
              name: "id",
              type: "string",
              required: true,
              display_name: t("ID_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
            {
              name: "object",
              type: "string",
              constant: "user",
              required: true,
              display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      ],
    },
    {
      name: "date",
      ...commonProps,
      properties: [
        {
          name: "type",
          type: "string",
          constant: "date",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          ui: { component: "input", support_expression: true },
        },
        {
          name: "date",
          type: "object",
          required: true,
          display_name: t("PAGE_PROPERTIES_DATE_DISPLAY_NAME"),
          properties: [
            {
              name: "start",
              type: "string",
              required: true,
              display_name: t("PAGE_PROPERTIES_START_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
            {
              name: "end",
              type: "string",
              required: false,
              display_name: t("PAGE_PROPERTIES_END_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
            {
              name: "time_zone",
              type: "string",
              required: false,
              display_name: t("PAGE_PROPERTIES_TIME_ZONE_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      ],
    },
    {
      name: "page",
      ...commonProps,
      properties: [
        {
          name: "type",
          type: "string",
          constant: "page",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          ui: { component: "input", support_expression: true },
        },
        {
          name: "page",
          type: "object",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          properties: [
            {
              name: "id",
              type: "string",
              required: true,
              display_name: t("ID_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      ],
    },
    {
      name: "database",
      ...commonProps,
      properties: [
        {
          name: "type",
          type: "string",
          constant: "database",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          ui: { component: "input", support_expression: true },
        },
        {
          name: "database",
          type: "object",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          properties: [
            {
              name: "id",
              type: "string",
              required: true,
              display_name: t("ID_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      ],
    },
      {
        name: "template_mention",
        ...commonProps,
        display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
        properties: [
        {
          name: "type",
          type: "string",
          constant: "template_mention",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          ui: { component: "input", support_expression: true },
        },
        // TODO
        // {
        //   type: "discriminated_union",
        //   discriminator: "template_mention_type",
        //   any_of: [
        //     {
        //       type: "object",
        //       name: "template_mention_date",
        //       properties: [
        //         {
        //           name: "template_mention_type",
        //           type: "string",
        //           constant: "today",
        //           required: true,
        //         },
        //       ],
        //     },
        //     {
        //       type: "object",
        //       name: "template_mention_date_now",
        //       properties: [
        //         {
        //           name: "template_mention_type",
        //           type: "string",
        //           constant: "now",
        //           required: true,
        //         },
        //       ],
        //     },
        //     {
        //       type: "object",
        //       name: "template_mention_user",
        //       properties: [
        //         {
        //           name: "template_mention_type",
        //           type: "string",
        //           constant: "me",
        //           required: true,
        //         },
        //       ],
        //     },
        //   ],
        // // } satisfies PropertyDiscriminatedUnion<
        //   "template_mention_type"
        // >,
      ],
    },
      {
        name: "custom_emoji",
        ...commonProps,
        display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
        properties: [
        {
          name: "type",
          type: "string",
          constant: "custom_emoji",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
        },
        {
          name: "custom_emoji",
          type: "object",
          required: true,
          display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          properties: [
            {
              name: "id",
              type: "string",
              required: true,
              display_name: t("ID_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
            {
              name: "name",
              type: "string",
              required: false,
              display_name: t("NAME_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
            {
              name: "url",
              type: "string",
              required: false,
              display_name: t("PAGE_PROPERTIES_URL_DISPLAY_NAME"),
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      ],
    },
  ],
}

export const titleArrayParameter: PropertyArray<"title"> = {
  name: "title",
  type: "array",
  display_name: t("BLOCKS_TITLE_DISPLAY_NAME"),
  items: {
    type: "discriminated_union",
    discriminator: "type",
    any_of: [
      {
        type: "object",
        name: "text",
        display_name: t("BLOCKS_CONTENT_DISPLAY_NAME"),
        properties: [
          {
            name: "type",
            type: "string",
            constant: "text",
            required: true,
            display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          },
          {
            name: "text",
            type: "object",
            required: true,
            properties: [
              {
                name: "content",
                type: "string",
                required: true,
                display_name: t("BLOCKS_CONTENT_DISPLAY_NAME"),
                ui: {
                  component: "textarea",
                  support_expression: true,
                },
              },
              {
                name: "link",
                type: "string",
                required: false,
                display_name: t("BLOCKS_LINK_DISPLAY_NAME"),
                ui: { component: "input", support_expression: true },
              },
            ],
          },
          annotationParameter,
        ],
      },
      {
        type: "object",
        name: "mention",
        display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
        properties: [
          {
            name: "type",
            type: "string",
            constant: "mention",
            required: true,
            display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          },
          // mentionValueParameter, // toDo
          annotationParameter,
        ],
      },
      {
        type: "object",
        name: "equation",
        display_name: t("BLOCKS_EXPRESSION_DISPLAY_NAME"),
        properties: [
          {
            name: "type",
            type: "string",
            constant: "equation",
            required: true,
            display_name: t("BLOCKS_TYPE_DISPLAY_NAME"),
          },
        {
          name: "equation",
          type: "object",
          required: true,
          display_name: t("BLOCKS_EXPRESSION_DISPLAY_NAME"),
          properties: [
              {
                name: "expression",
                type: "string",
                required: true,
                display_name: t("BLOCKS_EXPRESSION_DISPLAY_NAME"),
                ui: { component: "input", support_expression: true },
              },
            ],
          },
          annotationParameter,
        ],
      },
    ],
  },
  required: true,
}

export const richTextArrayParameter: PropertyArray<"rich_text"> = {
  ...titleArrayParameter,
  name: "rich_text",
  display_name: t("BLOCKS_RICH_TEXT_DISPLAY_NAME"),
}
