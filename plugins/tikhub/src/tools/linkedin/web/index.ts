import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_linkedin_search_people } from "./search-people"
import { tikhub_linkedin_get_company_profile } from "./get-company-profile"
import { tikhub_linkedin_search_posts } from "./search-posts"
import { tikhub_linkedin_get_post_comments } from "./get-post-comments"
import { tikhub_linkedin_get_comments_replies } from "./get-comments-replies"
import { tikhub_linkedin_get_user_profile } from "./get-user-profile"
import { tikhub_linkedin_get_user_contact } from "./get-user-contact"

export const linkedinWebTools: ToolDefinition[] = [
  tikhub_linkedin_search_people,
  tikhub_linkedin_get_company_profile,
  tikhub_linkedin_search_posts,
  tikhub_linkedin_get_post_comments,
  tikhub_linkedin_get_comments_replies,
  tikhub_linkedin_get_user_profile,
  tikhub_linkedin_get_user_contact,
]
