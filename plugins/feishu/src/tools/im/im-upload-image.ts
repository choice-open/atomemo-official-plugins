import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  createFeishuLarkClient,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import im_upload_imageSkill from "./im-upload-image-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "im_upload_image",
  module: "im",
  name: "上传图片",
  method: "POST",
  path: "/open-apis/im/v1/images",
};

function readImageType(p: Record<string, unknown>): "message" | "avatar" {
  const v = p.image_type;
  if (v === undefined || v === null || v === "") {
    return "message";
  }
  if (v === "message" || v === "avatar") {
    return v;
  }
  throw new Error('Parameter `image_type` must be "message" or "avatar".');
}

export const feishuImUploadImageTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Upload image",
    zh_Hans: "上传图片",
  },
  description: {
    en_US: "This API is used to upload an image to the Feishu Open Platform.",
    zh_Hans: "本接口用于将图片上传至飞书开放平台。",
  },
  skill: im_upload_imageSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "image",
      type: "file_ref",
      required: true,
      display_name: t("IM_IMAGE_FILE_DISPLAY_NAME"),
      ai: {
        llm_description: t("IM_IMAGE_FILE_AI_DESCRIPTION"),
      },
      ui: {
        hint: t("IM_IMAGE_FILE_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"image">,
    {
      name: "image_type",
      type: "string",
      required: false,
      display_name: t("IM_IMAGE_TYPE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("IM_IMAGE_TYPE_HINT"),
        placeholder: { en_US: "message", zh_Hans: "message" },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"image_type">,
  ],
  invoke: async ({ args, context }): Promise<JsonValue> => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    if (!p.image) {
      throw new Error("Parameter `image` is required.");
    }
    if (!context?.files) {
      throw new Error("File context is unavailable.");
    }

    // 与 google-drive upload-a-file 一致：parseFileRef 后统一走 download 取内容
    const fileRef = context.files.parseFileRef(p.image as never);
    const downloaded = await context.files.download(fileRef);
    const imageBuffer = Buffer.from(downloaded.content ?? "", "base64");
    if (imageBuffer.length === 0) {
      throw new Error("Failed to read image bytes from file_ref (empty content).");
    }

    const imageType = readImageType(p);
    const client = createFeishuLarkClient(args.credentials, credentialId);

    const result = await client.im.image.create({
      data: {
        image_type: imageType,
        image: imageBuffer,
      },
    });

    return result as JsonValue;
  },
};
