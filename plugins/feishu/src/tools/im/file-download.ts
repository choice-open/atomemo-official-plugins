import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import fileDownloadSkill from "./file-download-skill.md" with { type: "text" }

export const fileDownloadTool = createFeishuSdkTool({
  name: "feishu_im_file_download",
  skill: fileDownloadSkill,
  displayNameEn: "Feishu IM File Download",
  displayNameZh: "飞书下载文件",
  descriptionEn: "Download file by im.file.get",
  descriptionZh: "使用 im.file.get 下载文件",
  uiFields: [
    {
      name: "file_key",
      displayNameEn: "File Key",
      displayNameZh: "文件 Key",
      target: "path",
      key: "file_key",
      required: true,
      placeholder: "file_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "file_key")
  },
  invokeSdk: (client, payload) => client.im.file.get(payload),
})
