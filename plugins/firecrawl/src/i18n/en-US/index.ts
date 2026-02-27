import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Firecrawl",
  PLUGIN_DESCRIPTION: "Integrate Firecrawl in Atomemo",
  LABEL_BATCH_ID: "Batch ID",
  HINT_BATCH_ID: "ID of the batch scrape job",
  LABEL_ID: "ID",
  HINT_CRAWL_ID: "The ID of the crawl job",
  PARAM_CREDENTIAL_LABEL: "Credential",
  PARAM_REQUEST_BODY_LABEL: "Request Body",
  PARAM_PARSERS_LABEL: "Parsers",
  OPTION_PARSER_PDF: "PDF",
  LABEL_TYPE: "Type",
  LABEL_FULL_PAGE: "Full Page",
  HINT_FULL_PAGE_VIEWPORT:
    "Whether to capture the full page or just the visible viewport.",
  LABEL_QUALITY: "Quality",
  HINT_SCREENSHOT_QUALITY: "Quality of the screenshot (0-100).",
  LABEL_VIEWPORT: "Viewport",
  LABEL_VIEWPORT_WIDTH: "Width",
  HINT_VIEWPORT_WIDTH: "Width of the viewport in pixels.",
  LABEL_VIEWPORT_HEIGHT: "Height",
  HINT_VIEWPORT_HEIGHT: "Height of the viewport in pixels.",
  LABEL_MODES: "Modes",
  HINT_CHANGE_TRACKING_MODES: "Modes for tracking changes (git-diff or json).",
  LABEL_PROMPT: "Prompt",
  HINT_CHANGE_TRACKING_PROMPT: "Prompt for the LLM to analyze changes.",
  LABEL_TAG: "Tag",
  HINT_CHANGE_TRACKING_TAG: "Tag for identifying the change tracking instance.",
  LABEL_SCHEMA: "Schema",
  HINT_CHANGE_TRACKING_SCHEMA: "JSON schema for the change tracking data.",
  HINT_JSON_PROMPT:
    "Prompt to guide the LLM in extracting structured data from the page content.",
  HINT_JSON_SCHEMA:
    "JSON schema defining the structure of the data to extract.",
  LABEL_FORMATS: "Formats",
  HINT_FORMATS:
    "Output formats to include in the response. You can specify one or more formats, either as strings (e.g., 'markdown') or as objects with additional options like type: 'json' and schema definitions. Some formats require specific options to be set.",
  LABEL_HEADERS: "Headers",
  HINT_HEADERS:
    "Headers to send with the request. Can be used to send cookies, user-agent, etc.",
  LABEL_ACTIONS: "Actions",
  LABEL_MILLISECONDS: "Milliseconds",
  HINT_WAIT_MILLISECONDS: "Number of milliseconds to wait.",
  LABEL_SELECTOR: "Selector",
  HINT_WAIT_SELECTOR: "CSS selector to wait for before proceeding.",
  HINT_CLICK_SELECTOR: "CSS selector of the element to click.",
  LABEL_TEXT: "Text",
  HINT_WRITE_TEXT: "Text to write into the input field.",
  LABEL_KEY: "Key",
  HINT_PRESS_KEY: "Key to press (e.g., 'Enter', 'Tab').",
  LABEL_DIRECTION: "Direction",
  OPTION_DIRECTION_UP: "Up",
  OPTION_DIRECTION_DOWN: "Down",
  HINT_SCROLL_DIRECTION:
    "CSS selector of the element to scroll. If not provided, scrolls the entire page.",
  HINT_SCROLL_SELECTOR:
    "CSS selector of the element to scroll. If not provided, scrolls the entire page.",
  LABEL_SCRIPT: "Script",
  HINT_EXECUTE_JAVASCRIPT_SCRIPT: "JavaScript code to execute on the page.",
  LABEL_FORMAT: "Format",
  HINT_PDF_FORMAT: "Paper format for the PDF.",
  LABEL_LANDSCAPE: "Landscape",
  HINT_PDF_LANDSCAPE: "Whether to use landscape orientation.",
  LABEL_SCALE: "Scale",
  HINT_PDF_SCALE: "Scale factor for the PDF content.",
  HINT_ACTIONS: "Actions to perform on the page before grabbing the content",
  LABEL_LOCATION: "Location",
  LABEL_COUNTRY: "Country",
  HINT_LOCATION_COUNTRY: "ISO 3166-1 alpha-2 country code",
  LABEL_LANGUAGES: "Languages",
  HINT_LOCATION_SETTINGS:
    "Location settings for the request. When specified, this will use an appropriate proxy if available and emulate the corresponding language and timezone settings. Defaults to 'US' if not specified.",
  LABEL_ONLY_MAIN_CONTENT: "Only Main Content",
  HINT_ONLY_MAIN_CONTENT:
    "Only return the main content of the page excluding headers, navs, footers, etc.",
  LABEL_REMOVE_BASE64_IMAGES: "Remove Base64 Images",
  HINT_REMOVE_BASE64_IMAGES:
    "Removes all base 64 images from the output, which may be overwhelmingly long. The image's alt text remains in the output, but the URL is replaced with a placeholder.",
  LABEL_TIMEOUT_MS: "Timeout (ms)",
  HINT_TIMEOUT_MS: "Timeout in milliseconds for the request.",
  LABEL_MOBILE: "Mobile",
  HINT_MOBILE:
    "Set to true if you want to emulate scraping from a mobile device. Useful for testing responsive pages and taking mobile screenshots.",
  LABEL_BLOCK_ADS: "Block Ads",
  HINT_BLOCK_ADS: "Enables ad-blocking and cookie popup blocking.",
  LABEL_WAIT_FOR_MS: "Wait For (ms)",
  HINT_WAIT_FOR_MS:
    "Specify a delay in milliseconds before fetching the content, allowing the page sufficient time to load. This waiting time is in addition to Firecrawl's smart wait feature.",
  LABEL_STORE_IN_CACHE: "Store in Cache",
  HINT_STORE_IN_CACHE:
    "If true, the page will be stored in the Firecrawl index and cache. Setting this to false is useful if your scraping activity may have data protection concerns. Using some parameters associated with sensitive scraping (e.g. actions, headers) will force this parameter to be false.",
  LABEL_MAX_AGE_MS: "Max Age (ms)",
  HINT_MAX_AGE_MS:
    "Returns a cached version of the page if it is younger than this age in milliseconds. If a cached version of the page is older than this value, the page will be scraped. If you do not need extremely fresh data, enabling this can speed up your scrapes by 500%. Defaults to 2 days.",
  LABEL_INCLUDE_TAGS: "Include Tags",
  HINT_INCLUDE_TAGS: "Tags to include in the output.",
  LABEL_EXCLUDE_TAGS: "Exclude Tags",
  HINT_EXCLUDE_TAGS: "Tags to exclude from the output.",
  LABEL_PROXY: "Proxy",
  HINT_PROXY:
    "Specifies the type of proxy to use. basic: Proxies for scraping sites with none to basic anti-bot solutions. Fast and usually works. stealth: Stealth proxies for scraping sites with advanced anti-bot solutions. Slower, but more reliable on certain sites. Costs up to 5 credits per request. auto: Firecrawl will automatically retry scraping with stealth proxies if the basic proxy fails. If the retry with stealth is successful, 5 credits will be billed for the scrape. If the first attempt with basic is successful, only the regular cost will be billed.",
  LABEL_SKIP_TLS_VERIFICATION: "Skip TLS Verification",
  HINT_SKIP_TLS_VERIFICATION:
    "Skip TLS certificate verification when making requests.",
  LABEL_SCRAPE_OPTIONS: "Scrape Options",
  TOOL_CANCEL_CRAWL_DISPLAY_NAME: "Firecrawl Cancel Crawl",
  TOOL_CANCEL_CRAWL_DESCRIPTION: "Cancel an active Firecrawl crawl job.",
  LABEL_USE_CUSTOM_BODY: "Use Custom Body",
  LABEL_CRAWL_PROMPT: "Prompt",
  HINT_CRAWL_PROMPT:
    "Describe what to crawl in plain English. Explicitly set parameters will override generated equivalents.",
  LABEL_LIMIT: "Limit",
  HINT_CRAWL_LIMIT: "Maximum number of pages to crawl. Default is 10000.",
  LABEL_DELAY: "Delay",
  HINT_CRAWL_DELAY:
    "Delay in seconds between scrapes. This helps respect website rate limits.",
  LABEL_MAX_CONCURRENCY: "Max Concurrency",
  HINT_MAX_CONCURRENCY:
    "Maximum number of concurrent scrapes. If not specified, the crawl adheres to your team's concurrency limit.",
  LABEL_EXCLUDE_PATHS: "Exclude Paths",
  HINT_EXCLUDE_PATHS:
    "URL pathname regex patterns that exclude matching URLs from the crawl. e.g., 'blog/.*' to exclude all blog pages.",
  LABEL_INCLUDE_PATHS: "Include Paths",
  HINT_INCLUDE_PATHS:
    "URL pathname regex patterns that include matching URLs in the crawl. Only paths matching the patterns will be included. e.g., 'blog/.*' to include only blog pages.",
  LABEL_SITEMAP: "Sitemap",
  HINT_SITEMAP_MODE:
    "Sitemap mode. 'include' (default): Use sitemap and discover other pages. 'skip': Ignore sitemap entirely.",
  LABEL_IGNORE_QUERY_PARAMETERS: "Ignore Query Parameters",
  HINT_IGNORE_QUERY_PARAMETERS:
    "Do not re-scrape the same path with different (or none) query parameters.",
  LABEL_ALLOW_EXTERNAL_LINKS: "Allow External Links",
  HINT_ALLOW_EXTERNAL_LINKS:
    "Allows the crawler to follow links to external websites.",
  LABEL_ALLOW_SUBDOMAINS: "Allow Subdomains",
  HINT_ALLOW_SUBDOMAINS:
    "Allows the crawler to follow links to subdomains of the main domain.",
  TOOL_NAME_FIRECRAWL_CRAWL: "Firecrawl Crawl",
  TOOL_DESCRIPTION_FIRECRAWL_CRAWL:
    "Crawl a website using Firecrawl with fine-grained controls.",
  LABEL_URL: "URL",
  HINT_URL: "The base URL to start crawling from",
  TOOL_GET_CRAWL_ERRORS_DISPLAY_NAME: "Firecrawl Get Crawl Errors",
  TOOL_GET_CRAWL_ERRORS_DESCRIPTION:
    "Retrieve errors reported by a Firecrawl crawl job.",
  TOOL_GET_CRAWL_STATUS_DISPLAY_NAME: "Firecrawl Get Crawl Status",
  TOOL_GET_CRAWL_STATUS_DESCRIPTION:
    "Get the current status of a Firecrawl job.",
  TOOL_LIST_ACTIVE_CRAWLS_DISPLAY_NAME: "Firecrawl List Active Crawls",
  TOOL_LIST_ACTIVE_CRAWLS_DESCRIPTION:
    "List the active Firecrawl crawl jobs for the account.",
  TOOL_PREVIEW_CRAWL_PARAMS_DISPLAY_NAME: "Firecrawl Preview Crawl Params",
  TOOL_PREVIEW_CRAWL_PARAMS_DESCRIPTION:
    "Preview how Firecrawl would interpret the crawl parameters.",
  PARAM_PREVIEW_URL_LABEL: "URL",
  HINT_PREVIEW_URL: "The URL to crawl (base URL).",
  PARAM_PREVIEW_PROMPT_LABEL: "Prompt",
  HINT_PREVIEW_PROMPT:
    "Natural language description of what to crawl. Max length 10000 characters.",
  LABEL_EXTRACT_PROMPT: "Prompt",
  HINT_EXTRACT_PROMPT: "Prompt to guide the extraction process",
  LABEL_EXTRACT_SCHEMA: "Schema (JSON)",
  HINT_EXTRACT_SCHEMA:
    "JSON Schema to define the structure of the extracted data",
  LABEL_ENABLE_WEB_SEARCH: "Enable Web Search",
  HINT_ENABLE_WEB_SEARCH:
    "When true, the extraction will use web search to find additional data",
  LABEL_IGNORE_SITEMAP: "Ignore Sitemap",
  HINT_IGNORE_SITEMAP: "When true, sitemap.xml files will be ignored",
  LABEL_INCLUDE_SUBDOMAINS: "Include Subdomains",
  HINT_INCLUDE_SUBDOMAINS: "When true, subdomains will also be scanned",
  LABEL_SHOW_SOURCES: "Show Sources",
  HINT_SHOW_SOURCES:
    "When true, the sources used to extract the data will be included in the response",
  LABEL_IGNORE_INVALID_URLS: "Ignore Invalid URLs",
  HINT_IGNORE_INVALID_URLS:
    "When true, invalid URLs will be ignored instead of failing the entire request",
  LABEL_URLS: "URLs",
  TOOL_EXTRACT_STRUCTURED_DATA_DISPLAY_NAME: "Firecrawl Extract",
  TOOL_EXTRACT_STRUCTURED_DATA_DESCRIPTION:
    "Extract structured data from a list of URLs.",
  TOOL_GET_EXTRACT_STATUS_DISPLAY_NAME: "Firecrawl Get Extract Status",
  TOOL_GET_EXTRACT_STATUS_DESCRIPTION: "Get the status of an extract job.",
  HINT_EXTRACT_ID: "The ID of the extract job.",
  LABEL_SEARCH: "Search",
  HINT_MAP_SEARCH:
    "Specify a search query to order the results by relevance. Example: 'blog' will return URLs that contain the word 'blog' in the URL ordered by relevance.",
  HINT_MAP_SITEMAP:
    "Sitemap mode when mapping. 'include' (default): Use sitemap and other methods. 'skip': Don't use sitemap. 'only': Only return URLs in the sitemap.",
  HINT_MAP_INCLUDE_SUBDOMAINS: "Include subdomains of the website",
  HINT_MAP_IGNORE_QUERY_PARAMETERS: "Do not return URLs with query parameters",
  HINT_MAP_LIMIT:
    "Maximum number of links to return. Default is 5000. Maximum is 100000.",
  LABEL_MAP_TIMEOUT: "Timeout",
  HINT_MAP_TIMEOUT: "Timeout in milliseconds. There is no timeout by default.",
  TOOL_MAP_WEBSITE_DISPLAY_NAME: "Firecrawl Map",
  TOOL_MAP_WEBSITE_DESCRIPTION:
    "Map a website by collecting links through Firecrawl.",
  HINT_MAP_URL: "The base URL to start mapping from",
  PARAM_MAP_URL_LABEL: "URL",
  TOOL_BATCH_SCRAPE_DISPLAY_NAME: "Firecrawl Batch Scrape",
  TOOL_BATCH_SCRAPE_DESCRIPTION: "Scrape multiple URLs in a batch job.",
  TOOL_CANCEL_BATCH_SCRAPE_DISPLAY_NAME: "Firecrawl Cancel Batch Scrape",
  TOOL_CANCEL_BATCH_SCRAPE_DESCRIPTION: "Cancel a Firecrawl batch scrape job.",
  TOOL_BATCH_SCRAPE_ERRORS_DISPLAY_NAME: "Firecrawl Get Batch Scrape Errors",
  TOOL_BATCH_SCRAPE_ERRORS_DESCRIPTION:
    "Retrieve errors from a batch scrape job.",
  TOOL_BATCH_SCRAPE_STATUS_DISPLAY_NAME: "Firecrawl Get Batch Scrape Status",
  TOOL_BATCH_SCRAPE_STATUS_DESCRIPTION:
    "Retrieve the status of a batch scrape job.",
  TOOL_SCRAPE_URL_DISPLAY_NAME: "Firecrawl Scrape",
  TOOL_SCRAPE_URL_DESCRIPTION: "Scrape a URL and return the page content.",
  PARAM_SCRAPE_URL_LABEL: "URL",
  HINT_SCRAPE_URL: "The URL to scrape",
  LABEL_TIME_BASED_SEARCH: "Time-based Search",
  HINT_TIME_BASED_SEARCH:
    "Time-based parameter: qdr:h (hour), qdr:d (day), qdr:w (week), qdr:m (month), qdr:y (year), or custom: cdr:1,cd_min:MM/DD/YYYY,cd_max:MM/DD/YYYY",
  HINT_SEARCH_LOCATION:
    "Location for geo-targeted results (e.g., 'San Francisco,California,United States')",
  LABEL_CATEGORIES: "Categories",
  LABEL_SOURCES: "Sources",
  HINT_SEARCH_LIMIT: "Maximum number of results to return (1-100)",
  HINT_SEARCH_COUNTRY:
    "ISO country code for geo-targeting (e.g., US, DE, FR, JP, UK, CA)",
  LABEL_SEARCH_TIMEOUT: "Timeout",
  HINT_SEARCH_TIMEOUT: "Timeout in milliseconds",
  HINT_SEARCH_IGNORE_INVALID_URLS:
    "Excludes invalid URLs from search results that are invalid for other Firecrawl endpoints",
  TOOL_SEARCH_CONTENT_DISPLAY_NAME: "Firecrawl Search",
  TOOL_SEARCH_CONTENT_DESCRIPTION:
    "Search Firecrawl content with advanced filters.",
  HINT_SEARCH_QUERY: "The search query",
  PARAM_SEARCH_QUERY_LABEL: "Query",
} satisfies BaseTranslation

export default en_US
