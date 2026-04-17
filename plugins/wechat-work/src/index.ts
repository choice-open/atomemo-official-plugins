import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js";
import packageJSON from "../package.json";
import { wechatWorkCredential } from "./credentials/wechat-work-credential";
import { t } from "./i18n/i18n-node";
import { locales } from "./i18n/i18n-util";
import { loadAllLocalesAsync } from "./i18n/i18n-util.async";

import { createDepartmentTool } from "./tools/base/create-department";
import { createMemberTool } from "./tools/base/create-member";
import { createTagTool } from "./tools/base/create-tag";
import { deleteDepartmentTool } from "./tools/base/delete-department";
import { deleteMemberTool } from "./tools/base/delete-member";
import { deleteTagTool } from "./tools/base/delete-tag";
import { getDepartmentTool } from "./tools/base/get-department";
import { getMemberTool } from "./tools/base/get-member";
import { listDepartmentsDetailTool } from "./tools/base/list-departments-detail";
import { listDepartmentsTool } from "./tools/base/list-departments";
import { listMembersDetailTool } from "./tools/base/list-members-detail";
import { listMembersTool } from "./tools/base/list-members";
import { listTagsTool } from "./tools/base/list-tags";
import { updateDepartmentTool } from "./tools/base/update-department";
import { updateMemberTool } from "./tools/base/update-member";
import { updateTagTool } from "./tools/base/update-tag";

import { sendImageMessageTool } from "./tools/messaging/send-image-message";
import { sendMarkdownMessageTool } from "./tools/messaging/send-markdown-message";
import { sendNewsMessageTool } from "./tools/messaging/send-news-message";
import { sendTemplateCardMessageTool } from "./tools/messaging/send-template-card-message";
import { sendTextCardMessageTool } from "./tools/messaging/send-text-card-message";
import { sendTextMessageTool } from "./tools/messaging/send-text-message";
// import { revokeMessageTool } from "./tools/other/revoke-message";

import { getMediaTool } from "./tools/app-management/get-media";
import { uploadImageTool } from "./tools/app-management/upload-image";
import { uploadMediaTool } from "./tools/app-management/upload-media";

import { addCorpTagTool } from "./tools/wechat-connect/add-corp-tag";
import { addWelcomeTemplateTool } from "./tools/wechat-connect/add-welcome-template";
import { batchGetExternalContactsTool } from "./tools/wechat-connect/batch-get-external-contacts";
import { cancelMassMessageTool } from "./tools/wechat-connect/cancel-mass-message";
import { createMassMessageTool } from "./tools/wechat-connect/create-mass-message";
import { deleteCorpTagTool } from "./tools/wechat-connect/delete-corp-tag";
import { getExternalContactTool } from "./tools/wechat-connect/get-external-contact";
import { listExternalContactsTool } from "./tools/wechat-connect/list-external-contacts";
import { remindMassMessageTool } from "./tools/wechat-connect/remind-mass-message";
import { sendCustomerMessageTool } from "./tools/wechat-connect/send-customer-message";
import { sendWelcomeMessageTool } from "./tools/wechat-connect/send-welcome-message";
import { updateCorpTagTool } from "./tools/wechat-connect/update-corp-tag";
// import { updateExternalContactRemarkTool } from "./tools/other/update-external-contact-remark";
// import { markCustomerTagTool } from "./tools/other/mark-customer-tag";
// import { addTagMembersTool } from "./tools/other/add-tag-members";
// import { removeTagMembersTool } from "./tools/other/remove-tag-members";
// import { getTagMembersTool } from "./tools/other/get-tag-members";
// import { getCustomerServiceQrcodeTool } from "./tools/other/get-customer-service-qrcode";
// import { listCustomerGroupsTool } from "./tools/list-customer-groups";
// import { getCustomerGroupTool } from "./tools/get-customer-group";

import { addKfServingTool } from "./tools/wechat-connect/add-kf-serving";
import { getKfAccountTool } from "./tools/wechat-connect/get-kf-account";
import { listKfAccountsTool } from "./tools/wechat-connect/list-kf-accounts";
import { sendKfMessageTool } from "./tools/wechat-connect/send-kf-message";
// import { deleteKfServingTool } from "./tools/delete-kf-serving";
// import { listKfServingTool } from "./tools/list-kf-serving";
// import { addKfAccountTool } from "./tools/add-kf-account";
// import { deleteKfAccountTool } from "./tools/delete-kf-account";

import { sendMailTool } from "./tools/office/send-mail";
import { sendMeetingMailTool } from "./tools/office/send-meeting-mail";
import { sendScheduleMailTool } from "./tools/office/send-schedule-mail";
// import { listMailGroupsTool } from "./tools/list-mail-groups";
// import { createMailGroupTool } from "./tools/create-mail-group";

// import { listCalendarsTool } from "./tools/list-calendars";
import { createCalendarTool } from "./tools/office/create-calendar";
import { createEventTool } from "./tools/office/create-event";
import { deleteCalendarTool } from "./tools/office/delete-calendar";
import { updateCalendarTool } from "./tools/office/update-calendar";
import { updateEventTool } from "./tools/office/update-event";
// import { deleteEventTool } from "./tools/delete-event";
// import { getEventTool } from "./tools/get-event";

import { createMeetingTool } from "./tools/office/create-meeting";
import { getMeetingInfoTool } from "./tools/office/get-meeting-info";
import { updateMeetingTool } from "./tools/office/update-meeting";

// 以下工具暂时注释掉，不在当前功能清单中
// import { batchDeleteMembersTool } from "./tools/batch-delete-members";
// import { batchSyncUserTool } from "./tools/batch-sync-user";
// import { batchReplaceUserTool } from "./tools/batch-replace-user";
// import { batchReplacePartyTool } from "./tools/batch-replace-party";
// import { getBatchResultTool } from "./tools/get-batch-result";
// import { getAgentTool } from "./tools/get-agent";
// import { listAgentsTool } from "./tools/list-agents";
// import { setAgentTool } from "./tools/set-agent";
// import { sendFileMessageTool } from "./tools/send-file-message";
// import { sendVideoMessageTool } from "./tools/send-video-message";
// import { sendVoiceMessageTool } from "./tools/send-voice-message";
// import { setMenuTool } from "./tools/set-menu";
// import { getMenuTool } from "./tools/get-menu";
// import { deleteMenuTool } from "./tools/delete-menu";
// import { listExternalContactTagsTool } from "./tools/list-external-contact-tags";
// import { listMeetingsTool } from "./tools/list-meetings";
// import { uploadMediaAsyncTool } from "./tools/upload-media-async";
// import { getJssdkMediaTool } from "./tools/get-jssdk-media";
// import { opengidToChatidTool } from "./tools/opengid-to-chatid";
// import { transferCustomerGroupTool } from "./tools/transfer-customer-group";
// import { transferCustomerTool } from "./tools/transfer-customer";
// import { transferResignedCustomerTool } from "./tools/transfer-resigned-customer";
// import { getTransferResultTool } from "./tools/get-transfer-result";
// import { getContactWayTool } from "./tools/get-contact-way";
// import { addContactWayTool } from "./tools/add-contact-way";
// import { deleteContactWayTool } from "./tools/delete-contact-way";
// import { getUserBehaviorDataTool } from "./tools/get-user-behavior-data";
// import { getCorpStatTool } from "./tools/get-corp-stat";
// import { secondVerifyTool } from "./tools/second-verify";
// import { cancelMeetingTool } from "./tools/cancel-meeting";
// import { getMeetingStatisticTool } from "./tools/get-meeting-statistic";
// import { createAdvancedMeetingTool } from "./tools/create-advanced-meeting";
// import { updateAdvancedMeetingTool } from "./tools/update-advanced-meeting";
// import { inviteMeetingMemberTool } from "./tools/invite-meeting-member";
// import { kickoutMeetingMemberTool } from "./tools/kickout-meeting-member";
// import { createWebinarTool } from "./tools/create-webinar";
// import { getWebinarTool } from "./tools/get-webinar";
// import { getPstnMeetingTool } from "./tools/get-pstn-meeting";
// import { listMraTool } from "./tools/list-mra";
// import { setMeetingBackgroundTool } from "./tools/set-meeting-background";
// import { getMeetingRecordTool } from "./tools/get-meeting-record";
// import { downloadMeetingRecordTool } from "./tools/download-meeting-record";
// import { listAdminMeetingsTool } from "./tools/list-admin-meetings";
// import { getCheckinDataTool } from "./tools/get-checkin-data";
// import { getCheckinRuleTool } from "./tools/get-checkin-rule";
// import { getApprovalTemplateTool } from "./tools/get-approval-template";
// import { submitApprovalTool } from "./tools/submit-approval";
// import { getApprovalDetailTool } from "./tools/get-approval-detail";
// import { createLiveTool } from "./tools/create-live";
// import { getLiveTool } from "./tools/get-live";
// import { getSpaceInfoTool } from "./tools/get-space-info";
// import { createSpaceTool } from "./tools/create-space";
// import { dismissSpaceTool } from "./tools/dismiss-space";
// import { listFilesTool } from "./tools/list-files";
// import { uploadWedriveFileTool } from "./tools/upload-wedrive-file";
// import { downloadWedriveFileTool } from "./tools/download-wedrive-file";
// import { deleteWedriveFileTool } from "./tools/delete-wedrive-file";
// import { getReportListTool } from "./tools/get-report-list";
// import { getReportTool } from "./tools/get-report";
// import { getUserInfoTool } from "./tools/get-user-info";
// import { getLoginCodeTool } from "./tools/get-login-code";
// import { getLoginInfoTool } from "./tools/get-login-info";
// import { getFollowUserListTool } from "./tools/get-follow-user-list";
// import { listCustomerMomentsTool } from "./tools/list-customer-moments";
// import { getMomentContentTool } from "./tools/get-moment-content";
// import { addMomentTaskTool } from "./tools/add-moment-task";
// import { transferKfServiceStateTool } from "./tools/transfer-kf-service-state";
// import { getKfServiceStateTool } from "./tools/get-kf-service-state";
// import { syncKfMessagesTool } from "./tools/sync-kf-messages";
// import { getKfCorpStatisticTool } from "./tools/get-kf-corp-statistic";
// import { addKfRobotTool } from "./tools/add-kf-robot";
// import { listKfRobotsTool } from "./tools/list-kf-robots";
// import { deleteKfRobotTool } from "./tools/delete-kf-robot";
// import { checkMsgauditTool } from "./tools/check-msgaudit";
// import { getMsgauditTool } from "./tools/get-msgaudit";
// import { getMsgauditPerUserTool } from "./tools/get-msgaudit-per-user";
// import { listRoomsTool } from "./tools/list-rooms";
// import { getRoomTool } from "./tools/get-room";
// import { bookRoomTool } from "./tools/book-room";
// import { exportSimpleUserTool } from "./tools/export-simple-user";
// import { getExportResultTool } from "./tools/get-export-result";
// import { listAppShareInfoTool } from "./tools/list-app-share-info";
// import { getCorpTokenTool } from "./tools/get-corp-token";
// import { createWedocTool } from "./tools/create-wedoc";
// import { getDocInfoTool } from "./tools/get-doc-info";
// import { deleteWedocTool } from "./tools/delete-wedoc";
// import { getSmartsheetTool } from "./tools/get-smartsheet";
// import { getSmartsheetRecordsTool } from "./tools/get-smartsheet-records";
// import { addSmartsheetRecordsTool } from "./tools/add-smartsheet-records";
// import { updateSmartsheetRecordsTool } from "./tools/update-smartsheet-records";
// import { sendFamilyMessageTool } from "./tools/send-family-message";
// import { sendWebhookMessageTool } from "./tools/send-webhook-message";
// import { sendRobotMessageTool } from "./tools/send-robot-message";
// import { createGroupChatTool } from "./tools/create-group-chat";
// import { listSchoolsTool } from "./tools/list-schools";
// import { listStudentsTool } from "./tools/list-students";
// import { listGuardiansTool } from "./tools/list-guardians";
// import { createStudentTool } from "./tools/create-student";
// import { createGuardianTool } from "./tools/create-guardian";
// import { listSchoolDepartmentsTool } from "./tools/list-school-departments";
// import { getHealthReportTool } from "./tools/get-health-report";
// import { exportHealthReportTool } from "./tools/export-health-report";
// import { createSchoolLiveTool } from "./tools/create-school-live";
// import { stopSchoolLiveTool } from "./tools/stop-school-live";
// import { createPaymentTool } from "./tools/create-payment";
// import { getPaymentTool } from "./tools/get-payment";
// import { createGridTool } from "./tools/create-grid";
// import { listGridsTool } from "./tools/list-grids";
// import { createEventCategoryTool } from "./tools/create-event-category";
// import { listEventCategoriesTool } from "./tools/list-event-categories";
// import { patrolReportTool } from "./tools/patrol-report";
// import { listPatrolRecordsTool } from "./tools/list-patrol-records";
// import { residentReportTool } from "./tools/resident-report";
// import { handleReportTool } from "./tools/handle-report";
// import { getDialRecordTool } from "./tools/get-dial-record";
// import { getStaffInfoTool } from "./tools/get-staff-info";
// import { getDocumentDataTool } from "./tools/get-document-data";
// import { editDocumentContentTool } from "./tools/edit-document-content";
// import { getSpreadsheetRangeDataTool } from "./tools/get-spreadsheet-range-data";
// import { getSpreadsheetPropertiesTool } from "./tools/get-spreadsheet-properties";
// import { editSpreadsheetContentTool } from "./tools/edit-spreadsheet-content";
// import { getFormInfoTool } from "./tools/get-form-info";
// import { getFormStatisticTool } from "./tools/get-form-statistic";
// import { getFormAnswerTool } from "./tools/get-form-answer";
// import { webhookAddRecordsTool } from "./tools/webhook-add-records";
// import { webhookUpdateRecordsTool } from "./tools/webhook-update-records";
// import { getAdminListTool } from "./tools/get-admin-list";
// import { uploadDocumentImageTool } from "./tools/upload-document-image";
// import { uploadDocumentMediaTool } from "./tools/upload-document-media";
// import { listMailTool } from "./tools/list-mail";
// import { getMailTool } from "./tools/get-mail";
// import { getAppMailAccountTool } from "./tools/get-app-mail-account";
// import { listCommonMailAccountsTool } from "./tools/list-common-mail-accounts";
// import { listAdminMailboxesTool } from "./tools/list-admin-mailboxes";
// import { getClientConfigTool } from "./tools/get-client-config";
// import { addPermanentMaterialTool } from "./tools/add-permanent-material";
// import { getPermanentMaterialTool } from "./tools/get-permanent-material";
// import { deletePermanentMaterialTool } from "./tools/delete-permanent-material";
// import { listPermanentMaterialsTool } from "./tools/list-permanent-materials";

await loadAllLocalesAsync();

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🏢",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/wechat-work",
  locales,
  transporterOptions: {},
});

plugin.addCredential(wechatWorkCredential);

// ============================================
// 通讯录管理 - 部门
// ============================================
plugin.addTool(listDepartmentsTool); // 获取部门列表
plugin.addTool(listDepartmentsDetailTool); // 获取部门成员详情
plugin.addTool(getDepartmentTool); // 获取部门详情
plugin.addTool(createDepartmentTool); // 创建部门
plugin.addTool(updateDepartmentTool); // 更新部门
plugin.addTool(deleteDepartmentTool); // 删除部门

// ============================================
// 通讯录管理 - 成员
// ============================================
plugin.addTool(listMembersTool); // 获取部门成员
plugin.addTool(listMembersDetailTool); // 获取部门成员详情
plugin.addTool(getMemberTool); // 获取成员详情
plugin.addTool(createMemberTool); // 创建成员
plugin.addTool(updateMemberTool); // 更新成员
plugin.addTool(deleteMemberTool); // 删除成员

// ============================================
// 消息接收与发送 - 发送应用消息
// ============================================
plugin.addTool(sendTextMessageTool); // 发送文本消息
plugin.addTool(sendImageMessageTool); // 发送图片消息
plugin.addTool(sendMarkdownMessageTool); // 发送Markdown消息
plugin.addTool(sendNewsMessageTool); // 发送图文消息
plugin.addTool(sendTextCardMessageTool); // 发送文本卡片消息
plugin.addTool(sendTemplateCardMessageTool); // 发送模板卡片消息
// plugin.addTool(revokeMessageTool)           // 撤回消息

// ============================================
// 素材管理 - 临时素材
// ============================================
plugin.addTool(uploadMediaTool); // 上传临时素材
plugin.addTool(uploadImageTool); // 上传图片
plugin.addTool(getMediaTool); // 获取临时素材

// ============================================
// 客户联系 - 客户管理
// ============================================
plugin.addTool(listExternalContactsTool); // 获取客户列表
plugin.addTool(getExternalContactTool); // 获取客户详情
plugin.addTool(batchGetExternalContactsTool); // 批量获取客户详情
// plugin.addTool(updateExternalContactRemarkTool) // 编辑客户备注

// ============================================
// 客户联系 - 客户标签管理
// ============================================
plugin.addTool(listTagsTool); // 获取企业标签库
plugin.addTool(createTagTool); // 添加企业客户标签
plugin.addTool(updateTagTool); // 编辑企业客户标签
plugin.addTool(deleteTagTool); // 删除企业客户标签
plugin.addTool(addCorpTagTool); // 添加企业客户标签
plugin.addTool(updateCorpTagTool); // 编辑企业客户标签
plugin.addTool(deleteCorpTagTool); // 删除企业客户标签
// plugin.addTool(markCustomerTagTool)         // 编辑客户企业标签
// plugin.addTool(addTagMembersTool)           // 添加标签成员
// plugin.addTool(removeTagMembersTool)        // 删除标签成员
// plugin.addTool(getTagMembersTool)          // 获取标签成员

// ============================================
// 客户联系 - 消息推送（客户群发）
// ============================================
plugin.addTool(sendCustomerMessageTool); // 发送消息推送
plugin.addTool(createMassMessageTool); // 创建企业群发
plugin.addTool(remindMassMessageTool); // 提醒成员群发
plugin.addTool(cancelMassMessageTool); // 停止企业群发
plugin.addTool(sendWelcomeMessageTool); // 发送新客户欢迎语
plugin.addTool(addWelcomeTemplateTool); // 添加入群欢迎语素材
// plugin.addTool(getCustomerServiceQrcodeTool) // 获取客服二维码
// plugin.addTool(listCustomerGroupsTool)      // 获取客户群列表
// plugin.addTool(getCustomerGroupTool)        // 获取客户群详情

// ============================================
// 微信客服
// ============================================
plugin.addTool(listKfAccountsTool); // 获取客服账户列表
plugin.addTool(getKfAccountTool); // 获取客服账户详情
// plugin.addTool(addKfAccountTool)            // 添加客服账户
// plugin.addTool(deleteKfAccountTool)         // 删除客服账户
plugin.addTool(addKfServingTool); // 分配客服会话
// plugin.addTool(listKfServingTool)           // 获取客服会话列表
// plugin.addTool(deleteKfServingTool)         // 结束客服会话
plugin.addTool(sendKfMessageTool); // 发送客服消息

// ============================================
// 邮件
// ============================================
plugin.addTool(sendMailTool); // 发送普通邮件
plugin.addTool(sendScheduleMailTool); // 发送日程邮件
plugin.addTool(sendMeetingMailTool); // 发送会议邮件
// plugin.addTool(listMailGroupsTool)          // 获取邮件组列表
// plugin.addTool(createMailGroupTool)          // 创建邮件组

// ============================================
// 日程管理
// ============================================
// plugin.addTool(listCalendarsTool)            // 获取日历列表
plugin.addTool(createCalendarTool); // 创建日历
plugin.addTool(updateCalendarTool); // 更新日历
plugin.addTool(deleteCalendarTool); // 删除日历
plugin.addTool(createEventTool); // 创建日程
plugin.addTool(updateEventTool); // 更新日程
// plugin.addTool(getEventTool)                // 获取日程详情
// plugin.addTool(deleteEventTool)             // 删除日程

// ============================================
// 会议管理 - 预约会议
// ============================================
plugin.addTool(createMeetingTool); // 创建预约会议
plugin.addTool(updateMeetingTool); // 修改预约会议
plugin.addTool(getMeetingInfoTool); // 获取会议详情

// ============================================
// 以下工具暂时注释掉，不在当前功能清单中
// ============================================

// 通讯录 - 批量操作
// plugin.addTool(batchDeleteMembersTool)
// plugin.addTool(batchSyncUserTool)
// plugin.addTool(batchReplaceUserTool)
// plugin.addTool(batchReplacePartyTool)
// plugin.addTool(getBatchResultTool)

// 应用管理
// plugin.addTool(getAgentTool)
// plugin.addTool(listAgentsTool)
// plugin.addTool(setAgentTool)

// 消息接收与发送 - 其他消息类型
// plugin.addTool(sendFileMessageTool)
// plugin.addTool(sendVideoMessageTool)
// plugin.addTool(sendVoiceMessageTool)

// 应用菜单
// plugin.addTool(setMenuTool)
// plugin.addTool(getMenuTool)
// plugin.addTool(deleteMenuTool)

// 客户联系 - 其他
// plugin.addTool(listExternalContactTagsTool)
// plugin.addTool(listMeetingsTool)

// 素材管理 - 其他
// plugin.addTool(uploadMediaAsyncTool)
// plugin.addTool(getJssdkMediaTool)

// 客户群管理
// plugin.addTool(opengidToChatidTool)
// plugin.addTool(transferCustomerGroupTool)

// 客户继承
// plugin.addTool(transferCustomerTool)
// plugin.addTool(transferResignedCustomerTool)
// plugin.addTool(getTransferResultTool)

// 联系我方式
// plugin.addTool(getContactWayTool)
// plugin.addTool(addContactWayTool)
// plugin.addTool(deleteContactWayTool)

// 客户统计
// plugin.addTool(getUserBehaviorDataTool)
// plugin.addTool(getCorpStatTool)

// 身份验证
// plugin.addTool(secondVerifyTool)

// 会议管理 - 其他
// plugin.addTool(cancelMeetingTool)
// plugin.addTool(getMeetingStatisticTool)
// plugin.addTool(createAdvancedMeetingTool)
// plugin.addTool(updateAdvancedMeetingTool)
// plugin.addTool(inviteMeetingMemberTool)
// plugin.addTool(kickoutMeetingMemberTool)
// plugin.addTool(createWebinarTool)
// plugin.addTool(getWebinarTool)
// plugin.addTool(getPstnMeetingTool)
// plugin.addTool(listMraTool)
// plugin.addTool(setMeetingBackgroundTool)
// plugin.addTool(getMeetingRecordTool)
// plugin.addTool(downloadMeetingRecordTool)
// plugin.addTool(listAdminMeetingsTool)
// plugin.addTool(listRoomsTool)
// plugin.addTool(getRoomTool)
// plugin.addTool(bookRoomTool)

// 打卡管理
// plugin.addTool(getCheckinDataTool)
// plugin.addTool(getCheckinRuleTool)

// 审批管理
// plugin.addTool(getApprovalTemplateTool)
// plugin.addTool(submitApprovalTool)
// plugin.addTool(getApprovalDetailTool)

// 直播管理
// plugin.addTool(createLiveTool)
// plugin.addTool(getLiveTool)

// 微盘管理
// plugin.addTool(getSpaceInfoTool)
// plugin.addTool(createSpaceTool)
// plugin.addTool(dismissSpaceTool)
// plugin.addTool(listFilesTool)
// plugin.addTool(uploadWedriveFileTool)
// plugin.addTool(downloadWedriveFileTool)
// plugin.addTool(deleteWedriveFileTool)

// 汇报管理
// plugin.addTool(getReportListTool)
// plugin.addTool(getReportTool)

// 身份验证
// plugin.addTool(getUserInfoTool)
// plugin.addTool(getLoginCodeTool)
// plugin.addTool(getLoginInfoTool)

// 客户联系 - 其他
// plugin.addTool(getFollowUserListTool)
// plugin.addTool(listCustomerMomentsTool)
// plugin.addTool(getMomentContentTool)
// plugin.addTool(addMomentTaskTool)

// 微信客服 - 其他
// plugin.addTool(transferKfServiceStateTool)
// plugin.addTool(getKfServiceStateTool)
// plugin.addTool(syncKfMessagesTool)
// plugin.addTool(getKfCorpStatisticTool)
// plugin.addTool(addKfRobotTool)
// plugin.addTool(listKfRobotsTool)
// plugin.addTool(deleteKfRobotTool)

// 会话存档
// plugin.addTool(checkMsgauditTool)
// plugin.addTool(getMsgauditTool)
// plugin.addTool(getMsgauditPerUserTool)

// 通讯录导出
// plugin.addTool(exportSimpleUserTool)
// plugin.addTool(getExportResultTool)

// 企业互联
// plugin.addTool(listAppShareInfoTool)
// plugin.addTool(getCorpTokenTool)

// 文档管理
// plugin.addTool(createWedocTool)
// plugin.addTool(getDocInfoTool)
// plugin.addTool(deleteWedocTool)
// plugin.addTool(getDocumentDataTool)
// plugin.addTool(editDocumentContentTool)

// 智能表格
// plugin.addTool(getSmartsheetTool)
// plugin.addTool(getSmartsheetRecordsTool)
// plugin.addTool(addSmartsheetRecordsTool)
// plugin.addTool(updateSmartsheetRecordsTool)

// 管理表格内容
// plugin.addTool(getSpreadsheetRangeDataTool)
// plugin.addTool(getSpreadsheetPropertiesTool)
// plugin.addTool(editSpreadsheetContentTool)

// 管理收集表
// plugin.addTool(getFormInfoTool)
// plugin.addTool(getFormStatisticTool)
// plugin.addTool(getFormAnswerTool)

// Webhook 接收外部数据
// plugin.addTool(webhookAddRecordsTool)
// plugin.addTool(webhookUpdateRecordsTool)

// 家校消息、群机器人、智能机器人
// plugin.addTool(sendFamilyMessageTool)
// plugin.addTool(sendWebhookMessageTool)
// plugin.addTool(sendRobotMessageTool)

// 智能表格自动化
// plugin.addTool(createGroupChatTool)

// 家校沟通 - 基础接口
// plugin.addTool(listSchoolsTool)

// 家校沟通 - 学生与家长管理
// plugin.addTool(listStudentsTool)
// plugin.addTool(listGuardiansTool)
// plugin.addTool(createStudentTool)
// plugin.addTool(createGuardianTool)

// 家校沟通 - 部门管理
// plugin.addTool(listSchoolDepartmentsTool)

// 家校应用 - 健康上报
// plugin.addTool(getHealthReportTool)
// plugin.addTool(exportHealthReportTool)

// 家校应用 - 上课直播
// plugin.addTool(createSchoolLiveTool)
// plugin.addTool(stopSchoolLiveTool)

// 家校应用 - 班级收款
// plugin.addTool(createPaymentTool)
// plugin.addTool(getPaymentTool)

// 邮件 - 其他
// plugin.addTool(listMailTool)
// plugin.addTool(getMailTool)
// plugin.addTool(getAppMailAccountTool)
// plugin.addTool(listCommonMailAccountsTool)
// plugin.addTool(listAdminMailboxesTool)
// plugin.addTool(getClientConfigTool)

// 政民沟通 - 配置网格结构
// plugin.addTool(createGridTool)
// plugin.addTool(listGridsTool)

// 政民沟通 - 配置事件类别
// plugin.addTool(createEventCategoryTool)
// plugin.addTool(listEventCategoriesTool)

// 政民沟通 - 巡查上报
// plugin.addTool(patrolReportTool)
// plugin.addTool(listPatrolRecordsTool)

// 政民沟通 - 居民上报
// plugin.addTool(residentReportTool)
// plugin.addTool(handleReportTool)

// 公费电话
// plugin.addTool(getDialRecordTool)

// 人事助手 - 花名册
// plugin.addTool(getStaffInfoTool)

// 高级功能账号管理
// plugin.addTool(getAdminListTool)

// 素材管理 - 文档图片
// plugin.addTool(uploadDocumentImageTool)
// plugin.addTool(uploadDocumentMediaTool)

// 永久素材管理
// plugin.addTool(addPermanentMaterialTool)
// plugin.addTool(getPermanentMaterialTool)
// plugin.addTool(deletePermanentMaterialTool)
// plugin.addTool(listPermanentMaterialsTool)

plugin.run();
