import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_rednote_get_image_note_detail } from "./get-image-note-detail"
import { tikhub_rednote_get_video_note_detail } from "./get-video-note-detail"
import { tikhub_rednote_get_note_comments } from "./get-note-comments"
import { tikhub_rednote_get_note_sub_comments } from "./get-note-sub-comments"
import { tikhub_rednote_search_notes } from "./search-notes"
import { tikhub_rednote_get_topic_info } from "./get-topic-info"
import { tikhub_rednote_get_topic_feed } from "./get-topic-feed"

export const xiaohongshuAppV2Tools: ToolDefinition[] = [
  tikhub_rednote_get_image_note_detail,
  tikhub_rednote_get_video_note_detail,
  tikhub_rednote_get_note_comments,
  tikhub_rednote_get_note_sub_comments,
  tikhub_rednote_search_notes,
  tikhub_rednote_get_topic_info,
  tikhub_rednote_get_topic_feed,
]
