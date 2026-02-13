import type {
  Property,
  PropertyArray,
  PropertyDiscriminatedUnion,
  PropertyObject,
  PropertyString,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import { apiColorOptions } from "./api-colors";
import { richTextArrayParameter } from "./page-properties/richtext";

export const richTextProperty: PropertyArray<"rich_text"> = {
  ...richTextArrayParameter,
  required: true,
};

export const colorProperty: PropertyString<"color"> = {
  name: "color",
  type: "string",
  required: false,
  ui: {
    component: "select",
    options: apiColorOptions,
    support_expression: true,
  },
};

export const isToggleableProperty = {
  name: "is_toggleable",
  type: "boolean",
  required: false,
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("BLOCKS_HEADING_IS_TOGGLEABLE_HINT"),
  },
} as const;

export const createTypeProperty = (blockType: string) =>
  ({
    name: "type",
    type: "string",
    constant: blockType,
  }) as const;

export const createBlockContentProperty = (
  blockType: string,
  properties: Property[],
) =>
  ({
    name: blockType,
    type: "object",
    required: true,
    ui: blockContentUISection,
    properties,
  }) as const;

export const blockContentUISection = {
  component: "section",
  support_expression: false,
} as const;

export const urlProperty: PropertyString<"url"> = {
  name: "url",
  type: "string",
  required: true,
  ui: {
    component: "input",
    support_expression: true,
    hint: t("BLOCKS_URL_HINT"),
  },
};

export const externalUrlProperty: PropertyObject<"external"> = {
  name: "external",
  type: "object",
  required: false,
  ui: {
    component: "section",
    support_expression: false,
  },
  properties: [urlProperty],
};

export const paragraphBlock: PropertyObject<string, "type"> = {
  type: "object",
  name: "paragraph",
  display_name: t("BLOCKS_PARAGRAPH_DISPLAY_NAME"),
  properties: [
    createTypeProperty("paragraph"),
    createBlockContentProperty("paragraph", [richTextProperty, colorProperty]),
  ],
};

export const heading1Block: PropertyObject<string, "type"> = {
  type: "object",
  name: "heading_1",
  display_name: t("BLOCKS_HEADING_1_DISPLAY_NAME"),
  properties: [
    createTypeProperty("heading_1"),
    createBlockContentProperty("heading_1", [
      richTextProperty,
      colorProperty,
      isToggleableProperty,
    ]),
  ],
};

export const heading2Block: PropertyObject<"heading_2", "type"> = {
  type: "object",
  name: "heading_2",
  display_name: t("BLOCKS_HEADING_2_DISPLAY_NAME"),
  properties: [
    createTypeProperty("heading_2"),
    createBlockContentProperty("heading_2", [
      richTextProperty,
      colorProperty,
      isToggleableProperty,
    ]),
  ],
};

export const heading3Block: PropertyObject<"heading_3", "type"> = {
  type: "object",
  name: "heading_3",
  display_name: t("BLOCKS_HEADING_3_DISPLAY_NAME"),
  properties: [
    createTypeProperty("heading_3"),
    createBlockContentProperty("heading_3", [
      richTextProperty,
      colorProperty,
      isToggleableProperty,
    ]),
  ],
};

export const bulletedListItemBlock: PropertyObject<
  "bulleted_list_item",
  "type"
> = {
  type: "object",
  name: "bulleted_list_item",
  display_name: t("BLOCKS_BULLETED_LIST_DISPLAY_NAME"),
  properties: [
    createTypeProperty("bulleted_list_item"),
    createBlockContentProperty("bulleted_list_item", [
      richTextProperty,
      colorProperty,
    ]),
  ],
};

export const numberedListItemBlock: PropertyObject<
  "numbered_list_item",
  "type"
> = {
  type: "object",
  name: "numbered_list_item",
  display_name: t("BLOCKS_NUMBERED_LIST_DISPLAY_NAME"),
  properties: [
    createTypeProperty("numbered_list_item"),
    createBlockContentProperty("numbered_list_item", [
      richTextProperty,
      colorProperty,
    ]),
  ],
};

export const quoteBlock: PropertyObject<"quote", "type"> = {
  type: "object",
  name: "quote",
  display_name: t("BLOCKS_QUOTE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("quote"),
    createBlockContentProperty("quote", [richTextProperty, colorProperty]),
  ],
};

export const todoBlock: PropertyObject<"to_do", "type"> = {
  type: "object",
  name: "to_do",
  display_name: t("BLOCKS_TO_DO_DISPLAY_NAME"),
  properties: [
    createTypeProperty("to_do"),
    createBlockContentProperty("to_do", [
      richTextProperty,
      colorProperty,
      {
        name: "checked",
        type: "boolean",
        required: false,
        ui: {
          component: "switch",
          support_expression: true,
          hint: t("BLOCKS_TO_DO_CHECKED_HINT"),
        },
      },
    ]),
  ],
};

export const toggleBlock: PropertyObject<"toggle", "type"> = {
  type: "object",
  name: "toggle",
  display_name: t("BLOCKS_TOGGLE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("toggle"),
    createBlockContentProperty("toggle", [richTextProperty, colorProperty]),
  ],
};

export const templateBlock: PropertyObject<"template", "type"> = {
  type: "object",
  name: "template",
  display_name: t("BLOCKS_TEMPLATE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("template"),
    createBlockContentProperty("template", [richTextProperty]),
  ],
};

export const calloutBlock: PropertyObject<"callout", "type"> = {
  type: "object",
  name: "callout",
  display_name: t("BLOCKS_CALLOUT_DISPLAY_NAME"),
  properties: [
    createTypeProperty("callout"),
    createBlockContentProperty("callout", [
      richTextProperty,
      colorProperty,
      {
        name: "icon",
        type: "object",
        required: false,
        ui: blockContentUISection,
        properties: [
          {
            name: "type",
            type: "string",
            required: true,
            ui: {
              component: "input",
              support_expression: true,
              hint: t("BLOCKS_CALLOUT_ICON_HINT"),
            },
          },
        ],
      },
    ]),
  ],
};

export const codeBlock: PropertyObject<"code", "type"> = {
  type: "object",
  name: "code",
  display_name: t("BLOCKS_CODE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("code"),
    createBlockContentProperty("code", [
      {
        name: "rich_text",
        type: "array",
        required: true,
        items: {
          type: "object",
          name: "rich_text",
          ui: blockContentUISection,
          properties: [
            {
              name: "text",
              type: "string",
              required: true,
              ui: {
                component: "input",
                support_expression: true,
              },
            },
          ],
        },
      },
      {
        name: "language",
        type: "string",
        required: true,
        ui: {
          component: "input",
          support_expression: true,
          hint: t("BLOCKS_CODE_LANGUAGE_HINT"),
        },
      },
      {
        name: "caption",
        type: "array",
        required: false,
        ui: {
          component: "array-section",
          hint: t("BLOCKS_CODE_CAPTION_HINT"),
        },
        items: {
          type: "object",
          name: "rich_text",
          ui: blockContentUISection,
          properties: [
            {
              name: "text",
              type: "string",
              required: true,
              ui: {
                component: "input",
                support_expression: true,
              },
            },
          ],
        },
      },
    ]),
  ],
};

export const equationBlock: PropertyObject<"equation", "type"> = {
  type: "object",
  name: "equation",
  display_name: t("BLOCKS_EQUATION_DISPLAY_NAME"),
  properties: [
    createTypeProperty("equation"),
    createBlockContentProperty("equation", [
      {
        name: "expression",
        type: "string",
        required: true,
        ui: {
          component: "input",
          support_expression: true,
          hint: t("BLOCKS_EQUATION_EXPRESSION_HINT"),
        },
      },
    ]),
  ],
};

export const breadcrumbBlock: PropertyObject<"breadcrumb", "type"> = {
  type: "object",
  name: "breadcrumb",
  display_name: t("BLOCKS_BREADCRUMB_DISPLAY_NAME"),
  properties: [createTypeProperty("breadcrumb")],
};

export const dividerBlock: PropertyObject<"divider", "type"> = {
  type: "object",
  name: "divider",
  display_name: t("BLOCKS_DIVIDER_DISPLAY_NAME"),
  properties: [createTypeProperty("divider")],
};

export const tableOfContentsBlock: PropertyObject<"table_of_contents", "type"> =
  {
    type: "object",
    name: "table_of_contents",
    display_name: t("BLOCKS_TABLE_OF_CONTENTS_DISPLAY_NAME"),
    properties: [
      createTypeProperty("table_of_contents"),
      createBlockContentProperty("table_of_contents", [colorProperty]),
    ],
  };

export const embedBlock: PropertyObject<"embed", "type"> = {
  type: "object",
  name: "embed",
  display_name: t("BLOCKS_EMBED_DISPLAY_NAME"),
  properties: [
    createTypeProperty("embed"),
    createBlockContentProperty("embed", [urlProperty]),
  ],
};

export const bookmarkBlock: PropertyObject<"bookmark", "type"> = {
  type: "object",
  name: "bookmark",
  display_name: t("BLOCKS_BOOKMARK_DISPLAY_NAME"),
  properties: [
    createTypeProperty("bookmark"),
    createBlockContentProperty("bookmark", [urlProperty]),
  ],
};

export const imageBlock: PropertyObject<"image", "type"> = {
  type: "object",
  name: "image",
  display_name: t("BLOCKS_IMAGE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("image"),
    createBlockContentProperty("image", [externalUrlProperty]),
  ],
};

export const videoBlock: PropertyObject<"video", "type"> = {
  type: "object",
  name: "video",
  display_name: t("BLOCKS_VIDEO_DISPLAY_NAME"),
  properties: [
    createTypeProperty("video"),
    createBlockContentProperty("video", [externalUrlProperty]),
  ],
};

export const pdfBlock: PropertyObject<"pdf", "type"> = {
  type: "object",
  name: "pdf",
  display_name: t("BLOCKS_PDF_DISPLAY_NAME"),
  properties: [
    createTypeProperty("pdf"),
    createBlockContentProperty("pdf", [externalUrlProperty]),
  ],
};

export const fileBlock: PropertyObject<"file", "type"> = {
  type: "object",
  name: "file",
  display_name: t("BLOCKS_FILE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("file"),
    createBlockContentProperty("file", [externalUrlProperty]),
  ],
};

export const audioBlock: PropertyObject<"audio", "type"> = {
  type: "object",
  name: "audio",
  display_name: t("BLOCKS_AUDIO_DISPLAY_NAME"),
  properties: [
    createTypeProperty("audio"),
    createBlockContentProperty("audio", [externalUrlProperty]),
  ],
};

export const linkToPageBlock: PropertyObject<"link_to_page", "type"> = {
  type: "object",
  name: "link_to_page",
  display_name: t("BLOCKS_LINK_TO_PAGE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("link_to_page"),
    createBlockContentProperty("link_to_page", [
      {
        name: "page_id",
        type: "string",
        required: true,
        ui: {
          component: "input",
          support_expression: true,
          hint: t("BLOCKS_LINK_TO_PAGE_PAGE_ID_HINT"),
        },
      },
      {
        name: "type",
        type: "string",
        constant: "page_id",
      },
    ]),
  ],
};

export const syncedBlockBlock: PropertyObject<"synced_block", "type"> = {
  type: "object",
  name: "synced_block",
  display_name: t("BLOCKS_SYNCED_BLOCK_DISPLAY_NAME"),
  properties: [
    createTypeProperty("synced_block"),
    createBlockContentProperty("synced_block", [
      {
        name: "synced_from",
        type: "object",
        required: false,
        ui: blockContentUISection,
        properties: [
          {
            name: "block_id",
            type: "string",
            required: true,
            ui: {
              component: "input",
              support_expression: true,
              hint: t("BLOCKS_SYNCED_BLOCK_BLOCK_ID_HINT"),
            },
          },
          {
            name: "type",
            type: "string",
            constant: "block_id",
          },
        ],
      },
    ]),
  ],
};

export const columnListBlock: PropertyObject<"column_list", "type"> = {
  type: "object",
  name: "column_list",
  display_name: t("BLOCKS_COLUMN_LIST_DISPLAY_NAME"),
  properties: [createTypeProperty("column_list")],
};

export const columnBlock: PropertyObject<"column", "type"> = {
  type: "object",
  name: "column",
  display_name: t("BLOCKS_COLUMN_DISPLAY_NAME"),
  properties: [
    createTypeProperty("column"),
    createBlockContentProperty("column", [
      {
        name: "width_ratio",
        type: "number",
        required: false,
        ui: {
          component: "number-input",
          support_expression: true,
          hint: t("BLOCKS_COLUMN_WIDTH_RATIO_HINT"),
        },
      },
    ]),
  ],
};

export const tableBlock: PropertyObject<"table", "type"> = {
  type: "object",
  name: "table",
  display_name: t("BLOCKS_TABLE_DISPLAY_NAME"),
  properties: [
    createTypeProperty("table"),
    createBlockContentProperty("table", [
      {
        name: "table_width",
        type: "number",
        required: true,
        ui: {
          component: "number-input",
          support_expression: true,
          hint: t("BLOCKS_TABLE_TABLE_WIDTH_HINT"),
        },
      },
      {
        name: "has_column_header",
        type: "boolean",
        required: false,
        ui: {
          component: "switch",
          support_expression: true,
          hint: t("BLOCKS_TABLE_HAS_COLUMN_HEADER_HINT"),
        },
      },
      {
        name: "has_row_header",
        type: "boolean",
        required: false,
        ui: {
          component: "switch",
          support_expression: true,
          hint: t("BLOCKS_TABLE_HAS_ROW_HEADER_HINT"),
        },
      },
    ]),
  ],
};

export const tableRowBlock: PropertyObject<"table_row", "type"> = {
  type: "object",
  name: "table_row",
  display_name: t("BLOCKS_TABLE_ROW_DISPLAY_NAME"),
  properties: [
    createTypeProperty("table_row"),
    createBlockContentProperty("table_row", [
      {
        name: "cells",
        type: "array",
        required: true,
        ui: {
          component: "array-section",
          hint: t("BLOCKS_TABLE_ROW_CELLS_HINT"),
        },
        items: {
          type: "array",
          name: "cell",
          items: {
            type: "object",
            name: "text",
            ui: blockContentUISection,
            properties: [
              {
                name: "type",
                type: "string",
                constant: "text",
              },
              {
                name: "text",
                type: "object",
                required: true,
                ui: blockContentUISection,
                properties: [
                  {
                    name: "content",
                    type: "string",
                    required: true,
                    ui: {
                      component: "input",
                      support_expression: true,
                    },
                  },
                  {
                    name: "link",
                    type: "object",
                    required: false,
                    ui: blockContentUISection,
                    properties: [urlProperty],
                  },
                ],
              },
            ],
          },
        },
      },
    ]),
  ],
};

export const allBlocks: PropertyObject<string, "type">[] = [
  paragraphBlock,
  heading1Block,
  heading2Block,
  heading3Block,
  bulletedListItemBlock,
  numberedListItemBlock,
  quoteBlock,
  todoBlock,
  toggleBlock,
  templateBlock,
  calloutBlock,
  syncedBlockBlock,
  codeBlock,
  equationBlock,
  breadcrumbBlock,
  dividerBlock,
  tableOfContentsBlock,
  columnListBlock,
  columnBlock,
  tableBlock,
  tableRowBlock,
  embedBlock,
  bookmarkBlock,
  imageBlock,
  videoBlock,
  pdfBlock,
  fileBlock,
  audioBlock,
  linkToPageBlock,
];

export const blocksItems: PropertyDiscriminatedUnion< "type"> = {
  type: "discriminated_union",
  discriminator: "type",
  discriminator_ui: {
    component: "select",
    options: allBlocks.map((bt) => ({
      label: bt.display_name ?? { en_US: bt.name },
      value: bt.name,
    })),
  },
  any_of: allBlocks,
};

export const blocksProperty: PropertyArray<"children"> = {
  name: "children",
  type: "array",
  required: false,
  display_name: t("BLOCKS_CHILDREN_DISPLAY_NAME"),
  ui: {
    component: "array-section",
    hint: t("BLOCKS_CHILDREN_HINT"),
  },
  ai: {
    llm_description: t("BLOCKS_CHILDREN_LLM_DESCRIPTION"),
  },
  items: blocksItems,
};
