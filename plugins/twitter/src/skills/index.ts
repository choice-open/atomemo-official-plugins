import createTweet from "./tools/create-tweet.md" with { type: "text" }
import deleteTweet from "./tools/delete-tweet.md" with { type: "text" }
import getFollowers from "./tools/get-followers.md" with { type: "text" }
import getFollowing from "./tools/get-following.md" with { type: "text" }
import getMe from "./tools/get-me.md" with { type: "text" }
import getTweet from "./tools/get-tweet.md" with { type: "text" }
import getUser from "./tools/get-user.md" with { type: "text" }
import getUserByUsername from "./tools/get-user-by-username.md" with { type: "text" }
import getUserTweets from "./tools/get-user-tweets.md" with { type: "text" }
import likeTweet from "./tools/like-tweet.md" with { type: "text" }
import retweet from "./tools/retweet.md" with { type: "text" }
import searchTweets from "./tools/search-tweets.md" with { type: "text" }
import undoRetweet from "./tools/undo-retweet.md" with { type: "text" }
import unlikeTweet from "./tools/unlike-tweet.md" with { type: "text" }

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
