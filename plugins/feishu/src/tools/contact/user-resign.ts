import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import userResignSkill from "./user-resign-skill.md" with { type: "text" }

export const userResignTool = createFeishuSdkTool({
  name: "feishu_contact_user_resign",
  skill: userResignSkill,
  displayNameEn: "Feishu Contact User Resign",
  displayNameZh: "飞书离职员工",
  descriptionEn: "Delete user by contact.user.delete",
  descriptionZh: "使用 contact.user.delete 执行员工离职",
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
  invokeSdk: (client, payload) => client.contact.user.delete(payload),
})
