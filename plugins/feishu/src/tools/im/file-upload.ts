import {
  createFeishuSdkTool,
  expectAtLeastOneNestedField,
} from "../feishu-base"
import fileUploadSkill from "./file-upload-skill.md" with { type: "text" }

export const fileUploadTool = createFeishuSdkTool({
  name: "feishu_im_file_upload",
  skill: fileUploadSkill,
  displayNameEn: "Feishu IM File Upload",
  displayNameZh: "飞书上传文件",
  descriptionEn: "Upload file by im.file.create",
  descriptionZh: "使用 im.file.create 上传文件",
  validatePayload: (payload) => {
    expectAtLeastOneNestedField(payload, "data", [
      "file",
      "file_name",
      "file_type",
    ])
  },
  invokeSdk: (client, payload) =>
    client.im.file.create(
      payload as unknown as Parameters<typeof client.im.file.create>[0],
    ),
})
