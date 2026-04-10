import {
  createFeishuSdkTool,
  expectAtLeastOneNestedField,
} from "../feishu-base"
import imageUploadSkill from "./image-upload-skill.md" with { type: "text" }

export const imageUploadTool = createFeishuSdkTool({
  name: "feishu_im_image_upload",
  skill: imageUploadSkill,
  displayNameEn: "Feishu IM Image Upload",
  displayNameZh: "飞书上传图片",
  descriptionEn: "Upload image by im.image.create",
  descriptionZh: "使用 im.image.create 上传图片",
  validatePayload: (payload) => {
    expectAtLeastOneNestedField(payload, "data", ["image", "image_key"])
  },
  invokeSdk: (client, payload) =>
    client.im.image.create(
      payload as unknown as Parameters<typeof client.im.image.create>[0],
    ),
})
