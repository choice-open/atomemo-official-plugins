import type {
  BaseTranslation as BaseTranslationType,
  LocalizedString,
} from "typesafe-i18n"
export type BaseTranslation = BaseTranslationType
export type BaseLocale = "en-US"
export type Locales = "en-US" | "zh-Hans"
export type Translation = RootTranslation
export type Translations = RootTranslation
type RootTranslation = {
  /**
   * H​a​c​k​e​r​ ​N​e​w​s
   */
  PLUGIN_DISPLAY_NAME: string
  /**
   * C​o​n​s​u​m​e​ ​t​h​e​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​A​P​I​ ​p​o​w​e​r​e​d​ ​b​y​ ​A​l​g​o​l​i​a
   */
  PLUGIN_DESCRIPTION: string
  /**
   * S​e​a​r​c​h​ ​H​a​c​k​e​r​ ​N​e​w​s
   */
  SEARCH_HACKER_NEWS_TOOL_DISPLAY_NAME: string
  /**
   * S​e​a​r​c​h​ ​s​t​o​r​i​e​s​ ​a​n​d​ ​c​o​m​m​e​n​t​s​ ​f​r​o​m​ ​H​a​c​k​e​r​ ​N​e​w​s
   */
  SEARCH_HACKER_NEWS_TOOL_DESCRIPTION: string
  /**
   * G​e​t​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​A​r​t​i​c​l​e
   */
  GET_HACKER_NEWS_ARTICLE_TOOL_DISPLAY_NAME: string
  /**
   * F​e​t​c​h​ ​a​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​i​t​e​m​ ​b​y​ ​I​D​,​ ​o​p​t​i​o​n​a​l​l​y​ ​i​n​c​l​u​d​i​n​g​ ​c​o​m​m​e​n​t​s
   */
  GET_HACKER_NEWS_ARTICLE_TOOL_DESCRIPTION: string
  /**
   * G​e​t​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​U​s​e​r
   */
  GET_HACKER_NEWS_USER_TOOL_DISPLAY_NAME: string
  /**
   * F​e​t​c​h​ ​a​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​u​s​e​r​ ​p​r​o​f​i​l​e​ ​b​y​ ​u​s​e​r​n​a​m​e
   */
  GET_HACKER_NEWS_USER_TOOL_DESCRIPTION: string
  /**
   * L​i​m​i​t
   */
  LIMIT_DISPLAY_NAME: string
  /**
   * M​a​x​ ​n​u​m​b​e​r​ ​o​f​ ​r​e​s​u​l​t​s​ ​t​o​ ​r​e​t​u​r​n
   */
  LIMIT_HINT: string
  /**
   * 1​0​0
   */
  LIMIT_PLACEHOLDER: string
  /**
   * M​a​x​i​m​u​m​ ​n​u​m​b​e​r​ ​o​f​ ​s​e​a​r​c​h​ ​r​e​s​u​l​t​s​ ​t​o​ ​r​e​t​u​r​n​.​ ​R​a​n​g​e​:​ ​1​-​1​0​0
   */
  LIMIT_LLM_DESCRIPTION: string
  /**
   * K​e​y​w​o​r​d
   */
  KEYWORD_DISPLAY_NAME: string
  /**
   * T​h​e​ ​k​e​y​w​o​r​d​ ​f​o​r​ ​f​i​l​t​e​r​i​n​g​ ​t​h​e​ ​r​e​s​u​l​t​s​ ​o​f​ ​t​h​e​ ​q​u​e​r​y
   */
  KEYWORD_HINT: string
  /**
   * L​a​u​n​c​h​ ​H​N​,​ ​A​I​ ​a​g​e​n​t​s​,​ ​Y​C
   */
  KEYWORD_PLACEHOLDER: string
  /**
   * S​e​a​r​c​h​ ​q​u​e​r​y​ ​s​t​r​i​n​g​ ​f​o​r​ ​f​i​l​t​e​r​i​n​g​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​s​t​o​r​i​e​s​.​ ​S​u​p​p​o​r​t​s​ ​A​l​g​o​l​i​a​ ​s​e​a​r​c​h​ ​s​y​n​t​a​x
   */
  KEYWORD_LLM_DESCRIPTION: string
  /**
   * T​a​g​s
   */
  TAGS_DISPLAY_NAME: string
  /**
   * O​p​t​i​o​n​a​l​l​y​ ​n​a​r​r​o​w​ ​r​e​s​u​l​t​s​ ​t​o​ ​o​n​e​ ​o​r​ ​m​o​r​e​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​i​t​e​m​ ​t​y​p​e​s
   */
  TAGS_HINT: string
  /**
   * F​i​l​t​e​r​ ​r​e​s​u​l​t​s​ ​b​y​ ​s​t​o​r​y​ ​t​y​p​e​:​ ​s​t​o​r​y​,​ ​c​o​m​m​e​n​t​,​ ​p​o​l​l​,​ ​s​h​o​w​_​h​n​,​ ​a​s​k​_​h​n​,​ ​o​r​ ​f​r​o​n​t​_​p​a​g​e
   */
  TAGS_LLM_DESCRIPTION: string
  /**
   * A​r​t​i​c​l​e​ ​I​D
   */
  ARTICLE_ID_DISPLAY_NAME: string
  /**
   * T​h​e​ ​I​D​ ​o​f​ ​t​h​e​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​i​t​e​m​ ​t​o​ ​b​e​ ​r​e​t​u​r​n​e​d
   */
  ARTICLE_ID_HINT: string
  /**
   * E​x​a​m​p​l​e​:​ ​8​8​6​3
   */
  ARTICLE_ID_PLACEHOLDER: string
  /**
   * T​h​e​ ​u​n​i​q​u​e​ ​i​d​e​n​t​i​f​i​e​r​ ​o​f​ ​a​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​i​t​e​m​ ​t​o​ ​f​e​t​c​h​.​ ​N​u​m​e​r​i​c​ ​I​D​ ​f​r​o​m​ ​t​h​e​ ​U​R​L
   */
  ARTICLE_ID_LLM_DESCRIPTION: string
  /**
   * I​n​c​l​u​d​e​ ​C​o​m​m​e​n​t​s
   */
  INCLUDE_COMMENTS_DISPLAY_NAME: string
  /**
   * W​h​e​t​h​e​r​ ​t​o​ ​i​n​c​l​u​d​e​ ​t​h​e​ ​f​u​l​l​ ​c​o​m​m​e​n​t​ ​t​r​e​e​ ​f​o​r​ ​t​h​e​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​i​t​e​m
   */
  INCLUDE_COMMENTS_HINT: string
  /**
   * W​h​e​n​ ​t​r​u​e​,​ ​i​n​c​l​u​d​e​s​ ​t​h​e​ ​f​u​l​l​ ​c​o​m​m​e​n​t​ ​t​r​e​e​ ​i​n​ ​t​h​e​ ​r​e​s​p​o​n​s​e​.​ ​W​h​e​n​ ​f​a​l​s​e​,​ ​r​e​t​u​r​n​s​ ​o​n​l​y​ ​t​h​e​ ​n​o​r​m​a​l​i​z​e​d​ ​i​t​e​m​ ​m​e​t​a​d​a​t​a
   */
  INCLUDE_COMMENTS_LLM_DESCRIPTION: string
  /**
   * U​s​e​r​n​a​m​e
   */
  USERNAME_DISPLAY_NAME: string
  /**
   * T​h​e​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​u​s​e​r​n​a​m​e​ ​t​o​ ​r​e​t​u​r​n
   */
  USERNAME_HINT: string
  /**
   * E​x​a​m​p​l​e​:​ ​p​g
   */
  USERNAME_PLACEHOLDER: string
  /**
   * T​h​e​ ​H​a​c​k​e​r​ ​N​e​w​s​ ​u​s​e​r​n​a​m​e​ ​t​o​ ​f​e​t​c​h​ ​p​r​o​f​i​l​e​ ​i​n​f​o​r​m​a​t​i​o​n​ ​f​o​r
   */
  USERNAME_LLM_DESCRIPTION: string
}
export type TranslationFunctions = {
  /**
   * Hacker News
   */
  PLUGIN_DISPLAY_NAME: () => LocalizedString
  /**
   * Consume the Hacker News API powered by Algolia
   */
  PLUGIN_DESCRIPTION: () => LocalizedString
  /**
   * Search Hacker News
   */
  SEARCH_HACKER_NEWS_TOOL_DISPLAY_NAME: () => LocalizedString
  /**
   * Search stories and comments from Hacker News
   */
  SEARCH_HACKER_NEWS_TOOL_DESCRIPTION: () => LocalizedString
  /**
   * Get Hacker News Article
   */
  GET_HACKER_NEWS_ARTICLE_TOOL_DISPLAY_NAME: () => LocalizedString
  /**
   * Fetch a Hacker News item by ID, optionally including comments
   */
  GET_HACKER_NEWS_ARTICLE_TOOL_DESCRIPTION: () => LocalizedString
  /**
   * Get Hacker News User
   */
  GET_HACKER_NEWS_USER_TOOL_DISPLAY_NAME: () => LocalizedString
  /**
   * Fetch a Hacker News user profile by username
   */
  GET_HACKER_NEWS_USER_TOOL_DESCRIPTION: () => LocalizedString
  /**
   * Limit
   */
  LIMIT_DISPLAY_NAME: () => LocalizedString
  /**
   * Max number of results to return
   */
  LIMIT_HINT: () => LocalizedString
  /**
   * 100
   */
  LIMIT_PLACEHOLDER: () => LocalizedString
  /**
   * Maximum number of search results to return. Range: 1-100
   */
  LIMIT_LLM_DESCRIPTION: () => LocalizedString
  /**
   * Keyword
   */
  KEYWORD_DISPLAY_NAME: () => LocalizedString
  /**
   * The keyword for filtering the results of the query
   */
  KEYWORD_HINT: () => LocalizedString
  /**
   * Launch HN, AI agents, YC
   */
  KEYWORD_PLACEHOLDER: () => LocalizedString
  /**
   * Search query string for filtering Hacker News stories. Supports Algolia search syntax
   */
  KEYWORD_LLM_DESCRIPTION: () => LocalizedString
  /**
   * Tags
   */
  TAGS_DISPLAY_NAME: () => LocalizedString
  /**
   * Optionally narrow results to one or more Hacker News item types
   */
  TAGS_HINT: () => LocalizedString
  /**
   * Filter results by story type: story, comment, poll, show_hn, ask_hn, or front_page
   */
  TAGS_LLM_DESCRIPTION: () => LocalizedString
  /**
   * Article ID
   */
  ARTICLE_ID_DISPLAY_NAME: () => LocalizedString
  /**
   * The ID of the Hacker News item to be returned
   */
  ARTICLE_ID_HINT: () => LocalizedString
  /**
   * Example: 8863
   */
  ARTICLE_ID_PLACEHOLDER: () => LocalizedString
  /**
   * The unique identifier of a Hacker News item to fetch. Numeric ID from the URL
   */
  ARTICLE_ID_LLM_DESCRIPTION: () => LocalizedString
  /**
   * Include Comments
   */
  INCLUDE_COMMENTS_DISPLAY_NAME: () => LocalizedString
  /**
   * Whether to include the full comment tree for the Hacker News item
   */
  INCLUDE_COMMENTS_HINT: () => LocalizedString
  /**
   * When true, includes the full comment tree in the response. When false, returns only the normalized item metadata
   */
  INCLUDE_COMMENTS_LLM_DESCRIPTION: () => LocalizedString
  /**
   * Username
   */
  USERNAME_DISPLAY_NAME: () => LocalizedString
  /**
   * The Hacker News username to return
   */
  USERNAME_HINT: () => LocalizedString
  /**
   * Example: pg
   */
  USERNAME_PLACEHOLDER: () => LocalizedString
  /**
   * The Hacker News username to fetch profile information for
   */
  USERNAME_LLM_DESCRIPTION: () => LocalizedString
}
export type Formatters = {}
export {}
