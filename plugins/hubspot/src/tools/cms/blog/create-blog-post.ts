// API docs: https://developers.hubspot.com/docs/api/cms/blog-posts
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { credentialParams } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
} from "../../_shared/utils"

export const createBlogPostTool = {
  name: "hubspot-create-blog-post",
  display_name: t("CREATE_BLOG_POST_DISPLAY_NAME"),
  description: t("CREATE_BLOG_POST_DESCRIPTION"),
  icon: "📰",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "name",
      type: "string",
      required: true,
      display_name: t("PARAM_BLOG_POST_NAME_LABEL"),
      ai: { llm_description: t("PARAM_BLOG_POST_NAME_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_BLOG_POST_NAME_HINT"),
        placeholder: t("PARAM_BLOG_POST_NAME_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "content_group_id",
      type: "string",
      required: true,
      display_name: t("PARAM_BLOG_CONTENT_GROUP_ID_LABEL"),
      ai: { llm_description: t("PARAM_BLOG_CONTENT_GROUP_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_BLOG_CONTENT_GROUP_ID_HINT"),
        support_expression: true,
      },
    },
    {
      name: "post_body",
      type: "string",
      required: false,
      display_name: t("PARAM_BLOG_POST_BODY_LABEL"),
      ai: { llm_description: t("PARAM_BLOG_POST_BODY_HINT") },
      ui: {
        component: "textarea",
        hint: t("PARAM_BLOG_POST_BODY_HINT"),
        support_expression: true,
      },
    },
    {
      name: "slug",
      type: "string",
      required: false,
      display_name: t("PARAM_BLOG_POST_SLUG_LABEL"),
      ai: { llm_description: t("PARAM_BLOG_POST_SLUG_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_BLOG_POST_SLUG_HINT"),
        support_expression: true,
      },
    },
    {
      name: "state",
      type: "string",
      required: false,
      display_name: t("PARAM_BLOG_POST_STATE_LABEL"),
      ai: { llm_description: t("PARAM_BLOG_POST_STATE_HINT") },
      ui: {
        component: "select",
        hint: t("PARAM_BLOG_POST_STATE_HINT"),
        options: [
          { label: t("OPTION_DRAFT"), value: "DRAFT" },
          { label: t("OPTION_PUBLISHED"), value: "PUBLISHED" },
        ],
      },
    },
    {
      name: "meta_description",
      type: "string",
      required: false,
      display_name: t("PARAM_BLOG_POST_META_DESCRIPTION_LABEL"),
      ai: { llm_description: t("PARAM_BLOG_POST_META_DESCRIPTION_HINT") },
      ui: {
        component: "textarea",
        hint: t("PARAM_BLOG_POST_META_DESCRIPTION_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const name = getString(args.parameters, "name")
    const contentGroupId = getString(args.parameters, "content_group_id")
    if (!name || !contentGroupId)
      throw new Error("name and content_group_id are required")

    const body: Record<string, unknown> = { name, contentGroupId }
    const postBody = getString(args.parameters, "post_body")
    if (postBody) body.postBody = postBody
    const slug = getString(args.parameters, "slug")
    if (slug) body.slug = slug
    const state = getString(args.parameters, "state")
    if (state) body.state = state
    const metaDescription = getString(args.parameters, "meta_description")
    if (metaDescription) body.metaDescription = metaDescription

    try {
      const response = await client.apiRequest({
        method: "POST",
        path: "/cms/v3/blogs/posts",
        body,
      })
      const result = await response.json()
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
