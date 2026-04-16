import { z } from "zod"
import type { PropertyObject } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "./i18n"
import { nonEmptyString, optionalTrimmedString } from "./schemas"

export const actionCardVariantOptions = [
  {
    label: t("OPTION_ACTION_CARD_VARIANT_SINGLE"),
    value: "single",
  },
  {
    label: t("OPTION_ACTION_CARD_VARIANT_VERTICAL_BUTTONS"),
    value: "vertical_buttons",
  },
  {
    label: t("OPTION_ACTION_CARD_VARIANT_HORIZONTAL_BUTTONS"),
    value: "horizontal_buttons",
  },
]

export const messageTypeOptions = [
  { label: t("OPTION_MESSAGE_TYPE_TEXT"), value: "text" },
  { label: t("OPTION_MESSAGE_TYPE_LINK"), value: "link" },
  { label: t("OPTION_MESSAGE_TYPE_MARKDOWN"), value: "markdown" },
  { label: t("OPTION_MESSAGE_TYPE_ACTION_CARD"), value: "actionCard" },
  { label: t("OPTION_MESSAGE_TYPE_FEED_CARD"), value: "feedCard" },
]

const actionCardButtonSchema = z
  .object({
    title: nonEmptyString,
    action_url: nonEmptyString,
  })
  .strict()

const feedCardLinkSchema = z
  .object({
    title: nonEmptyString,
    message_url: nonEmptyString,
    pic_url: nonEmptyString,
  })
  .strict()

export const robotMessageSchema = z
  .object({
    type: z.enum(["text", "link", "markdown", "actionCard", "feedCard"]),
    content: optionalTrimmedString.nullish(),
    title: optionalTrimmedString.nullish(),
    text: optionalTrimmedString.nullish(),
    message_url: optionalTrimmedString.nullish(),
    pic_url: optionalTrimmedString.nullish(),
    action_card_variant: z
      .enum(["single", "vertical_buttons", "horizontal_buttons"])
      .nullish(),
    single_title: optionalTrimmedString.nullish(),
    single_url: optionalTrimmedString.nullish(),
    buttons: z.array(actionCardButtonSchema).nullish(),
    links: z.array(feedCardLinkSchema).nullish(),
  })
  .strict()
  .superRefine((message, ctx) => {
    if (message.type === "text") {
      if (!message.content) {
        ctx.addIssue({
          code: "custom",
          message: "content is required when type is text.",
          path: ["content"],
        })
      }
      return
    }

    if (message.type === "link") {
      if (!message.title) {
        ctx.addIssue({
          code: "custom",
          message: "title is required when type is link.",
          path: ["title"],
        })
      }
      if (!message.text) {
        ctx.addIssue({
          code: "custom",
          message: "text is required when type is link.",
          path: ["text"],
        })
      }
      if (!message.message_url) {
        ctx.addIssue({
          code: "custom",
          message: "message_url is required when type is link.",
          path: ["message_url"],
        })
      }
      return
    }

    if (message.type === "markdown") {
      if (!message.title) {
        ctx.addIssue({
          code: "custom",
          message: "title is required when type is markdown.",
          path: ["title"],
        })
      }
      if (!message.text) {
        ctx.addIssue({
          code: "custom",
          message: "text is required when type is markdown.",
          path: ["text"],
        })
      }
      return
    }

    if (message.type === "actionCard") {
      if (!message.title) {
        ctx.addIssue({
          code: "custom",
          message: "title is required when type is actionCard.",
          path: ["title"],
        })
      }
      if (!message.text) {
        ctx.addIssue({
          code: "custom",
          message: "text is required when type is actionCard.",
          path: ["text"],
        })
      }
      if (!message.action_card_variant) {
        ctx.addIssue({
          code: "custom",
          message: "action_card_variant is required when type is actionCard.",
          path: ["action_card_variant"],
        })
        return
      }

      if (message.action_card_variant === "single") {
        if (!message.single_title) {
          ctx.addIssue({
            code: "custom",
            message:
              "single_title is required when action_card_variant is single.",
            path: ["single_title"],
          })
        }

        if (!message.single_url) {
          ctx.addIssue({
            code: "custom",
            message:
              "single_url is required when action_card_variant is single.",
            path: ["single_url"],
          })
        }

        return
      }

      const buttons = message.buttons ?? []
      if (message.action_card_variant === "vertical_buttons") {
        if (buttons.length < 2 || buttons.length > 5) {
          ctx.addIssue({
            code: "custom",
            message:
              "buttons must contain between 2 and 5 items when action_card_variant is vertical_buttons.",
            path: ["buttons"],
          })
        }
        return
      }

      if (buttons.length !== 2) {
        ctx.addIssue({
          code: "custom",
          message:
            "buttons must contain exactly 2 items when action_card_variant is horizontal_buttons.",
          path: ["buttons"],
        })
      }
      return
    }

    const links = message.links ?? []
    if (links.length < 1) {
      ctx.addIssue({
        code: "custom",
        message: "links must contain at least 1 item.",
        path: ["links"],
      })
    }
  })

export type RobotMessage = z.infer<typeof robotMessageSchema>

export type RobotMessagePayload = {
  msgKey: string
  msgParam: string
}

function buildIndexedButtonPayload(
  buttons: Array<{ title: string; action_url: string }>,
  titleKeyPrefix: string,
  urlKeyPrefix: string,
) {
  return buttons.reduce<Record<string, string>>((acc, button, index) => {
    const position = index + 1
    acc[`${titleKeyPrefix}${position}`] = button.title
    acc[`${urlKeyPrefix}${position}`] = button.action_url
    return acc
  }, {})
}

export function buildRobotMessagePayload(
  message: RobotMessage,
): RobotMessagePayload {
  switch (message.type) {
    case "text":
      return {
        msgKey: "sampleText",
        msgParam: JSON.stringify({
          content: message.content,
        }),
      }

    case "link":
      return {
        msgKey: "sampleLink",
        msgParam: JSON.stringify({
          title: message.title,
          text: message.text,
          messageUrl: message.message_url,
          ...(message.pic_url ? { picUrl: message.pic_url } : {}),
        }),
      }

    case "markdown":
      return {
        msgKey: "sampleMarkdown",
        msgParam: JSON.stringify({
          title: message.title,
          text: message.text,
        }),
      }

    case "feedCard":
      const links = message.links ?? []
      return {
        msgKey: "sampleFeedCard",
        msgParam: JSON.stringify({
          links: links.map((link) => ({
            title: link.title,
            messageURL: link.message_url,
            picURL: link.pic_url,
          })),
        }),
      }

    case "actionCard":
      if (message.action_card_variant === "single") {
        return {
          msgKey: "sampleActionCard",
          msgParam: JSON.stringify({
            title: message.title,
            text: message.text,
            singleTitle: message.single_title,
            singleURL: message.single_url,
          }),
        }
      }

      if (message.action_card_variant === "vertical_buttons") {
        const buttons = message.buttons ?? []
        return {
          msgKey: `sampleActionCard${buttons.length}`,
          msgParam: JSON.stringify({
            title: message.title,
            text: message.text,
            ...buildIndexedButtonPayload(buttons, "actionTitle", "actionURL"),
          }),
        }
      }

      const buttons = message.buttons ?? []
      return {
        msgKey: "sampleActionCard6",
        msgParam: JSON.stringify({
          title: message.title,
          text: message.text,
          ...buildIndexedButtonPayload(buttons, "buttonTitle", "buttonUrl"),
        }),
      }
  }
}

export const robotMessageParameter = {
  name: "message",
  type: "object",
  required: true,
  display_name: t("PARAM_MESSAGE_LABEL"),
  ai: {
    llm_description: t("ROBOT_BATCH_SEND_MESSAGE_LLM_DESCRIPTION"),
  },
  ui: {
    component: "section",
  },
  properties: [
    {
      name: "type",
      type: "string",
      required: true,
      default: "text",
      enum: messageTypeOptions.map((item) => item.value),
      display_name: t("PARAM_MESSAGE_TYPE_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_TYPE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "select",
        options: messageTypeOptions,
        hint: t("PARAM_MESSAGE_HINT"),
        support_expression: true,
      },
    },
    {
      name: "content",
      type: "string",
      required: false,
      display_name: t("PARAM_CONTENT_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_CONTENT_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          type: {
            $eq: "text",
          },
        },
      },
      ui: {
        component: "textarea",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: false,
      display_name: t("PARAM_TITLE_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_TITLE_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          type: {
            $in: ["link", "markdown", "actionCard"],
          },
        },
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "text",
      type: "string",
      required: false,
      display_name: t("PARAM_TEXT_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_TEXT_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          type: {
            $in: ["link", "markdown", "actionCard"],
          },
        },
      },
      ui: {
        component: "textarea",
        hint: t("PARAM_MESSAGE_MARKDOWN_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "message_url",
      type: "string",
      required: false,
      display_name: t("PARAM_MESSAGE_URL_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_URL_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          type: {
            $eq: "link",
          },
        },
      },
      ui: {
        component: "input",
        hint: t("PARAM_MESSAGE_URL_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "pic_url",
      type: "string",
      required: false,
      display_name: t("PARAM_PIC_URL_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_PIC_URL_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          type: {
            $eq: "link",
          },
        },
      },
      ui: {
        component: "input",
        hint: t("PARAM_PIC_URL_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "action_card_variant",
      type: "string",
      required: false,
      default: "single",
      enum: actionCardVariantOptions.map((item) => item.value),
      display_name: t("PARAM_ACTION_CARD_VARIANT_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_ACTION_CARD_VARIANT_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          type: {
            $eq: "actionCard",
          },
        },
      },
      ui: {
        component: "select",
        options: actionCardVariantOptions,
        hint: t("PARAM_ACTION_CARD_VARIANT_HINT"),
        support_expression: true,
      },
    },
    {
      name: "single_title",
      type: "string",
      required: false,
      display_name: t("PARAM_SINGLE_TITLE_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_SINGLE_TITLE_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          $and: [{ type: "actionCard" }, { action_card_variant: "single" }],
        },
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "single_url",
      type: "string",
      required: false,
      display_name: t("PARAM_SINGLE_URL_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_SINGLE_URL_LLM_DESCRIPTION"),
      },
      display: {
        show: {
          $and: [{ type: "actionCard" }, { action_card_variant: "single" }],
        },
      },
      ui: {
        component: "input",
        hint: t("PARAM_MESSAGE_URL_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "buttons",
      type: "array",
      required: false,
      display_name: t("PARAM_BUTTONS_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_BUTTONS_LLM_DESCRIPTION"),
      },
      min_items: 2,
      max_items: 5,
      display: {
        show: {
          $and: [
            { type: "actionCard" },
            {
              action_card_variant: {
                $in: ["vertical_buttons", "horizontal_buttons"],
              },
            },
          ],
        },
      },
      ui: {
        component: "array-section",
        hint: t("PARAM_BUTTONS_HINT"),
      },
      items: {
        name: "button",
        type: "object",
        properties: [
          {
            name: "title",
            type: "string",
            required: true,
            display_name: t("PARAM_BUTTON_TITLE_LABEL"),
            ai: {
              llm_description: t("ROBOT_BATCH_SEND_BUTTON_TITLE_LLM_DESCRIPTION"),
            },
            ui: {
              component: "input",
              support_expression: true,
              width: "full",
            },
          },
          {
            name: "action_url",
            type: "string",
            required: true,
            display_name: t("PARAM_ACTION_URL_LABEL"),
            ai: {
              llm_description: t(
                "ROBOT_BATCH_SEND_BUTTON_ACTION_URL_LLM_DESCRIPTION",
              ),
            },
            ui: {
              component: "input",
              hint: t("PARAM_MESSAGE_URL_HINT"),
              support_expression: true,
              width: "full",
            },
          },
        ],
      },
    },
    {
      name: "links",
      type: "array",
      required: false,
      display_name: t("PARAM_LINKS_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_FEED_LINKS_LLM_DESCRIPTION"),
      },
      min_items: 1,
      display: {
        show: {
          type: {
            $eq: "feedCard",
          },
        },
      },
      ui: {
        component: "array-section",
        hint: t("PARAM_LINKS_HINT"),
      },
      items: {
        name: "link",
        type: "object",
        properties: [
          {
            name: "title",
            type: "string",
            required: true,
            display_name: t("PARAM_TITLE_LABEL"),
            ai: {
              llm_description: t("ROBOT_BATCH_SEND_MESSAGE_TITLE_LLM_DESCRIPTION"),
            },
            ui: {
              component: "input",
              support_expression: true,
              width: "full",
            },
          },
          {
            name: "message_url",
            type: "string",
            required: true,
            display_name: t("PARAM_MESSAGE_URL_LABEL"),
            ai: {
              llm_description: t("ROBOT_BATCH_SEND_MESSAGE_URL_LLM_DESCRIPTION"),
            },
            ui: {
              component: "input",
              hint: t("PARAM_MESSAGE_URL_HINT"),
              support_expression: true,
              width: "full",
            },
          },
          {
            name: "pic_url",
            type: "string",
            required: true,
            display_name: t("PARAM_PIC_URL_LABEL"),
            ai: {
              llm_description: t("ROBOT_BATCH_SEND_MESSAGE_PIC_URL_LLM_DESCRIPTION"),
            },
            ui: {
              component: "input",
              hint: t("PARAM_PIC_URL_HINT"),
              support_expression: true,
              width: "full",
            },
          },
        ],
      },
    },
  ],
} satisfies PropertyObject<"message">
