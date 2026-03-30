import type {
  JsonValue,
  PropertyArray,
  PropertyCredentialId,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSkill } from "../skills"
import {
  PHOTO_SUPPORTED_PLATFORMS,
  getArgs,
  getUploadPostApiKey,
  parsePlatforms,
  postForm,
  validatePlatforms,
} from "./_shared/upload-post-client"

type UploadMediaApiResponse = {
  request_id?: string
  message?: string
  total_platforms?: number
}

type UploadMediaMode = "video" | "image"

const PHOTO_SUPPORTED_SET = new Set<string>(PHOTO_SUPPORTED_PLATFORMS)

const credentialParameter: PropertyCredentialId<"credentialId"> = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "upload-post-api-key",
  display_name: {
    en_US: "Credential",
    zh_Hans: "凭证",
  },
  required: true,
  ui: {
    component: "credential-select",
  },
}

const platformsParameter: PropertyArray<"platforms"> = {
  name: "platforms",
  type: "array",
  required: true,
  display_name: {
    en_US: "Target Platforms",
    zh_Hans: "目标平台",
  },
  items: {
    name: "platform",
    type: "string",
    enum: [
      "tiktok",
      "instagram",
      "youtube",
      "facebook",
      "linkedin",
      "x",
      "threads",
      "pinterest",
      "reddit",
      "bluesky",
    ],
  },
  min_items: 1,
  ui: {
    component: "multi-select",
    options: [
      {
        label: { en_US: "TikTok", zh_Hans: "TikTok" },
        value: "tiktok",
      },
      {
        label: { en_US: "Instagram", zh_Hans: "Instagram" },
        value: "instagram",
      },
      {
        label: { en_US: "YouTube", zh_Hans: "YouTube" },
        value: "youtube",
      },
      {
        label: { en_US: "Facebook", zh_Hans: "Facebook" },
        value: "facebook",
      },
      {
        label: { en_US: "LinkedIn", zh_Hans: "LinkedIn" },
        value: "linkedin",
      },
      {
        label: { en_US: "X (Twitter)", zh_Hans: "X（Twitter）" },
        value: "x",
      },
      {
        label: { en_US: "Threads", zh_Hans: "Threads" },
        value: "threads",
      },
      {
        label: { en_US: "Pinterest", zh_Hans: "Pinterest" },
        value: "pinterest",
      },
      {
        label: { en_US: "Reddit", zh_Hans: "Reddit" },
        value: "reddit",
      },
      {
        label: { en_US: "Bluesky", zh_Hans: "Bluesky" },
        value: "bluesky",
      },
    ],
    hint: {
      en_US: "Choose one or more target platforms",
      zh_Hans: "选择一个或多个目标平台",
    },
    support_expression: true,
    width: "full",
  },
}

export const uploadMediaTool = {
  name: "upload_media",
  display_name: {
    en_US: "Upload Media",
    zh_Hans: "上传媒体",
  },
  description: {
    en_US: "Submit media URL to Upload-Post for multi-platform publishing",
    zh_Hans: "提交媒体 URL 到 Upload-Post 执行多平台发布",
  },
  icon: "📤",
  skill: getSkill("upload-media"),
  parameters: [
    credentialParameter,
    {
      name: "user",
      type: "string",
      required: true,
      display_name: {
        en_US: "Profile",
        zh_Hans: "Profile",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Upload-Post user/profile identifier",
          zh_Hans: "Upload-Post 用户/配置标识",
        },
        support_expression: true,
        width: "full",
      },
    },
    platformsParameter,
    {
      name: "title",
      type: "string",
      required: false,
      display_name: {
        en_US: "Title",
        zh_Hans: "标题",
      },
      ui: {
        component: "textarea",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_url",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media URL",
        zh_Hans: "媒体 URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Public media URL to upload",
          zh_Hans: "需要上传的公开媒体 URL",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Media Type",
        zh_Hans: "媒体类型",
      },
      ui: {
        component: "select",
        options: [
          {
            label: { en_US: "Video", zh_Hans: "视频" },
            value: "video",
          },
          {
            label: { en_US: "Image", zh_Hans: "图片" },
            value: "image",
          },
        ],
        hint: {
          en_US: "Choose media type",
          zh_Hans: "选择媒体类型",
        },
        support_expression: true,
        width: "medium",
      },
      enum: ["video", "image"],
      default: "video",
    },
  ],
  invoke: async ({ args }): Promise<JsonValue> => {
    const apiKey = getUploadPostApiKey(args)
    if (!apiKey) {
      throw new Error(
        "Missing Upload-Post API key in selected credential. Please pick a valid credential.",
      )
    }

    const { parameters } = getArgs(args)
    const mediaUrl =
      typeof parameters.media_url === "string" ? parameters.media_url.trim() : ""

    if (!mediaUrl) {
      throw new Error("Parameter `media_url` is required.")
    }

    const user = typeof parameters.user === "string" ? parameters.user.trim() : ""
    if (!user) {
      throw new Error("Parameter `user` is required.")
    }

    const platforms = parsePlatforms(parameters.platforms)
    if (platforms.length === 0) {
      throw new Error("Parameter `platforms` must include at least one platform.")
    }

    const unsupportedPlatforms = validatePlatforms(platforms)
    if (unsupportedPlatforms.length > 0) {
      throw new Error(
        `Unsupported platforms: ${unsupportedPlatforms.join(", ")}. Allowed platforms: tiktok, instagram, youtube, facebook, linkedin, x, threads, pinterest, reddit, bluesky.`,
      )
    }

    const mediaTypeInput =
      typeof parameters.media_type === "string"
        ? parameters.media_type.trim().toLowerCase()
        : ""

    const mediaType: UploadMediaMode = mediaTypeInput === "image" ? "image" : "video"

    if (mediaType === "image") {
      const unsupportedForPhoto = platforms.filter(
        (platform) => !PHOTO_SUPPORTED_SET.has(platform),
      )

      if (unsupportedForPhoto.length > 0) {
        throw new Error(
          `Image upload does not support: ${unsupportedForPhoto.join(", ")}. Remove unsupported platforms or set media_type to video.`,
        )
      }
    }

    const formData = new FormData()
    formData.append(mediaType === "image" ? "photos[]" : "video", mediaUrl)
    formData.append("user", user)

    for (const platform of platforms) {
      formData.append("platform[]", platform)
    }

    if (typeof parameters.title === "string" && parameters.title.trim() !== "") {
      formData.append("title", parameters.title.trim())
    }

    const response = await postForm<UploadMediaApiResponse>(
      mediaType === "image" ? "/upload_photos" : "/upload",
      apiKey,
      formData,
    )

    if (!response.ok) {
      throw new Error(response.reason)
    }

    const requestId =
      typeof response.data.request_id === "string"
        ? response.data.request_id
        : undefined

    if (!requestId) {
      throw new Error("Upload-Post API response missing `request_id`.")
    }

    const message =
      typeof response.data.message === "string"
        ? response.data.message
        : "Upload request submitted."

    const totalPlatforms =
      typeof response.data.total_platforms === "number"
        ? response.data.total_platforms
        : platforms.length

    return {
      request_id: requestId,
      message,
      total_platforms: totalPlatforms,
    } as JsonValue
  },
} satisfies ToolDefinition
