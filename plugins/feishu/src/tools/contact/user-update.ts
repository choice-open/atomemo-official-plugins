import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import userUpdateSkill from "./user-update-skill.md" with { type: "text" }

export const userUpdateTool = createFeishuSdkTool({
  name: "feishu_contact_user_update",
  skill: userUpdateSkill,
  displayNameEn: "Feishu Contact User Update",
  displayNameZh: "飞书更新员工信息",
  descriptionEn: "Update employee by contact.user.patch",
  descriptionZh: "使用 contact.user.patch 更新员工信息",
  uiFields: [
    {
      name: "user_id",
      displayNameEn: "User ID",
      displayNameZh: "用户 ID",
      target: "path",
      key: "user_id",
      required: true,
      placeholder: "ou_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "user_id")
  },
  invokeSdk: (client, payload) =>
    client.contact.user.patch(payload as { path: { user_id: string } }),
})
