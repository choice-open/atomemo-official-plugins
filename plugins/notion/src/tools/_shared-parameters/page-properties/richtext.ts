import type {
  PropertyArray,
  PropertyDiscriminatedUnion,
  PropertyObject,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { apiColorOptions } from "../api-colors";

export const annotationParameter: PropertyObject<"annotations"> = {
  name: "annotations",
  type: "object",
  required: false,
  properties: [
    {
      name: "bold",
      type: "boolean",
      required: false,
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "italic",
      type: "boolean",
      required: false,
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "strikethrough",
      type: "boolean",
      required: false,
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "underline",
      type: "boolean",
      required: false,
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "code",
      type: "boolean",
      required: false,
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "color",
      type: "string",
      required: false,

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
};

const commonProps = {
  type: "object",
  ui: {
    component: "section",
  },
} as const;

// MentionRichTextItemRequest['mention']
export const mentionValueParameter: PropertyDiscriminatedUnion<
  "type"
> = {
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
        },
        {
          name: "user",
          type: "object",
          required: true,
          properties: [
            {
              name: "id",
              type: "string",
              required: true,
              ui: { component: "input", support_expression: true },
            },
            {
              name: "object",
              type: "string",
              constant: "user",
              required: true,
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
          ui: { component: "input", support_expression: true },
        },
        {
          name: "date",
          type: "object",
          required: true,
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
          ui: { component: "input", support_expression: true },
        },
        {
          name: "page",
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
    {
      name: "database",
      ...commonProps,
      properties: [
        {
          name: "type",
          type: "string",
          constant: "database",
          required: true,
          ui: { component: "input", support_expression: true },
        },
        {
          name: "database",
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
    {
      name: "template_mention",
      ...commonProps,
      properties: [
        {
          name: "type",
          type: "string",
          constant: "template_mention",
          required: true,
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
      properties: [
        {
          name: "type",
          type: "string",
          constant: "custom_emoji",
          required: true,
        },
        {
          name: "custom_emoji",
          type: "object",
          required: true,
          properties: [
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
            {
              name: "url",
              type: "string",
              required: false,
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      ],
    },
  ],
};

export const titleArrayParameter: PropertyArray<"title"> = {
  name: "title",
  type: "array",
  items: {
    type: "discriminated_union",
    discriminator: "type",
    any_of: [
      {
        type: "object",
        name: "text",
        properties: [
          { name: "type", type: "string", constant: "text", required: true },
          {
            name: "text",
            type: "object",
            required: true,
            properties: [
              {
                name: "content",
                type: "string",
                required: true,
                ui: {
                  component: "textarea",
                  support_expression: true,
                },
              },
              {
                name: "link",
                type: "string",
                required: false,
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
        properties: [
          { name: "type", type: "string", constant: "mention", required: true },
          // mentionValueParameter, // toDo
          annotationParameter,
        ],
      },
      {
        type: "object",
        name: "equation",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "equation",
            required: true,
          },
          {
            name: "equation",
            type: "object",
            required: true,
            properties: [
              {
                name: "expression",
                type: "string",
                required: true,
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
};

export const richTextArrayParameter: PropertyArray<"rich_text"> = {
  ...titleArrayParameter,
  name: "rich_text",
};
