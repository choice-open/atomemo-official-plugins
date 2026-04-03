import type { BaseTranslation } from "../i18n-types"

const en_US = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Twitter",
  PLUGIN_DESCRIPTION:
    "Twitter/X API v2 integration for managing tweets, users, and interactions",

  // Credential
  TWITTER_CREDENTIAL_DISPLAY_NAME: "Twitter OAuth",
  TWITTER_CREDENTIAL_DESCRIPTION: "OAuth 2.0 credential for Twitter API v2",
  TWITTER_CREDENTIAL_CLIENT_ID_DISPLAY_NAME: "Client ID",
  TWITTER_CREDENTIAL_CLIENT_ID_HINT: "Your Twitter App Client ID",
  TWITTER_CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  TWITTER_CREDENTIAL_CLIENT_SECRET_HINT: "Your Twitter App Client Secret",
  TWITTER_CREDENTIAL_ACCESS_TOKEN_DISPLAY_NAME: "Access Token",
  TWITTER_CREDENTIAL_REFRESH_TOKEN_DISPLAY_NAME: "Refresh Token",
  TWITTER_CREDENTIAL_EXPIRES_AT_DISPLAY_NAME: "Expires At",

  // Shared Parameters
  TWITTER_PARAM_CREDENTIAL_LABEL: "Twitter Credential",
  TWITTER_PARAM_TWEET_ID_LABEL: "Tweet ID",
  TWITTER_PARAM_TWEET_ID_HINT: "The unique identifier of the tweet",
  TWITTER_PARAM_USER_ID_LABEL: "User ID",
  TWITTER_PARAM_USER_ID_HINT: "The unique identifier of the user",
  TWITTER_PARAM_USERNAME_LABEL: "Username",
  TWITTER_PARAM_USERNAME_HINT: "Twitter username (without @)",
  TWITTER_PARAM_USERNAME_PLACEHOLDER: "elonmusk",
  TWITTER_PARAM_MAX_RESULTS_LABEL: "Max Results",
  TWITTER_PARAM_PAGINATION_TOKEN_LABEL: "Pagination Token",
  TWITTER_PARAM_PAGINATION_TOKEN_HINT:
    "Token for fetching the next page of results",
  TWITTER_PARAM_QUERY_LABEL: "Query",
  TWITTER_PARAM_QUERY_HINT: "Search query for tweets",
  TWITTER_PARAM_QUERY_PLACEHOLDER: "from:elonmusk",
  TWITTER_PARAM_TEXT_LABEL: "Text",
  TWITTER_PARAM_TEXT_HINT: "The text content of the tweet",
  TWITTER_PARAM_TEXT_PLACEHOLDER: "What's happening?",
  TWITTER_PARAM_REPLY_TO_TWEET_ID_LABEL: "Reply To Tweet ID",
  TWITTER_PARAM_REPLY_TO_TWEET_ID_HINT: "Tweet ID to reply to (optional)",
  TWITTER_PARAM_QUOTE_TWEET_ID_LABEL: "Quote Tweet ID",
  TWITTER_PARAM_QUOTE_TWEET_ID_HINT: "Tweet ID to quote (optional)",

  // Tweet Management Tools
  TWITTER_TOOL_CREATE_TWEET_DISPLAY_NAME: "Create Tweet",
  TWITTER_TOOL_CREATE_TWEET_DESCRIPTION: "Create a new tweet",
  TWITTER_TOOL_DELETE_TWEET_DISPLAY_NAME: "Delete Tweet",
  TWITTER_TOOL_DELETE_TWEET_DESCRIPTION: "Delete a tweet by ID",
  TWITTER_TOOL_GET_TWEET_DISPLAY_NAME: "Get Tweet",
  TWITTER_TOOL_GET_TWEET_DESCRIPTION: "Get a tweet by ID with author details",
  TWITTER_TOOL_SEARCH_TWEETS_DISPLAY_NAME: "Search Tweets",
  TWITTER_TOOL_SEARCH_TWEETS_DESCRIPTION:
    "Search recent tweets matching a query",
  TWITTER_TOOL_GET_USER_TWEETS_DISPLAY_NAME: "Get User Tweets",
  TWITTER_TOOL_GET_USER_TWEETS_DESCRIPTION: "Get tweets posted by a user",

  // User Management Tools
  TWITTER_TOOL_GET_ME_DISPLAY_NAME: "Get My Profile",
  TWITTER_TOOL_GET_ME_DESCRIPTION: "Get the authenticated user's profile",
  TWITTER_TOOL_GET_USER_DISPLAY_NAME: "Get User",
  TWITTER_TOOL_GET_USER_DESCRIPTION: "Get a user's profile by ID",
  TWITTER_TOOL_GET_USER_BY_USERNAME_DISPLAY_NAME: "Get User by Username",
  TWITTER_TOOL_GET_USER_BY_USERNAME_DESCRIPTION:
    "Get a user's profile by username",
  TWITTER_TOOL_GET_FOLLOWERS_DISPLAY_NAME: "Get Followers",
  TWITTER_TOOL_GET_FOLLOWERS_DESCRIPTION: "Get a user's followers",
  TWITTER_TOOL_GET_FOLLOWING_DISPLAY_NAME: "Get Following",
  TWITTER_TOOL_GET_FOLLOWING_DESCRIPTION: "Get users that a user is following",

  // Tweet Interaction Tools
  TWITTER_TOOL_LIKE_TWEET_DISPLAY_NAME: "Like Tweet",
  TWITTER_TOOL_LIKE_TWEET_DESCRIPTION: "Like a tweet",
  TWITTER_TOOL_UNLIKE_TWEET_DISPLAY_NAME: "Unlike Tweet",
  TWITTER_TOOL_UNLIKE_TWEET_DESCRIPTION: "Unlike a previously liked tweet",
  TWITTER_TOOL_RETWEET_DISPLAY_NAME: "Retweet",
  TWITTER_TOOL_RETWEET_DESCRIPTION: "Retweet a tweet",
  TWITTER_TOOL_UNDO_RETWEET_DISPLAY_NAME: "Undo Retweet",
  TWITTER_TOOL_UNDO_RETWEET_DESCRIPTION: "Undo a retweet",
} satisfies BaseTranslation

export default en_US
