import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import imageDownloadSkill from "./image-download-skill.md" with { type: "text" }

export const imageDownloadTool = createFeishuSdkTool({
  name: "feishu_im_image_download",
  skill: imageDownloadSkill,
  displayNameEn: "Feishu IM Image Download",
  displayNameZh: "飞书下载图片",
  descriptionEn: "Download image by im.image.get",
  descriptionZh: "使用 im.image.get 下载图片",
  uiFields: [
    {
      name: "image_key",
      displayNameEn: "Image Key",
      displayNameZh: "图片 Key",
      target: "path",
      key: "image_key",
      required: true,
      placeholder: "img_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "image_key")
  },
  invokeSdk: (client, payload) =>
    client.im.image.get(payload as { path: { image_key: string } }),
})
