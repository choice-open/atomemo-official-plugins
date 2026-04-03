import createTweet from "./tools/create-tweet"
import deleteTweet from "./tools/delete-tweet"
import getFollowers from "./tools/get-followers"
import getFollowing from "./tools/get-following"
import getMe from "./tools/get-me"
import getTweet from "./tools/get-tweet"
import getUser from "./tools/get-user"
import getUserByUsername from "./tools/get-user-by-username"
import getUserTweets from "./tools/get-user-tweets"
import likeTweet from "./tools/like-tweet"
import retweet from "./tools/retweet"
import searchTweets from "./tools/search-tweets"
import undoRetweet from "./tools/undo-retweet"
import unlikeTweet from "./tools/unlike-tweet"

const skills: Record<string, string> = {
  "create-tweet": createTweet,
  "delete-tweet": deleteTweet,
  "get-followers": getFollowers,
  "get-following": getFollowing,
  "get-me": getMe,
  "get-tweet": getTweet,
  "get-user": getUser,
  "get-user-by-username": getUserByUsername,
  "get-user-tweets": getUserTweets,
  "like-tweet": likeTweet,
  retweet: retweet,
  "search-tweets": searchTweets,
  "undo-retweet": undoRetweet,
  "unlike-tweet": unlikeTweet,
}

export function getSkill(toolName: string): string | undefined {
  return skills[toolName]
}
