# Tavily Crawl Tool

## Tool

- **Name**: `tavily-crawl`
- **Purpose**: Graph-based website crawling using Tavily (`POST /crawl`).

## Parameters

- **Tavily Credential**: select the stored `tavily` API key credential.
- **`url`**: root URL to begin the crawl.
- **`instructions`**: optional natural-language instructions for the crawler.
- **`max_depth`**: max depth (1-5).
- **`max_breadth`**: max links per level (1-500).
- **`limit`**: total links to process before stopping.
- **`select_paths` / `exclude_paths`**: optional regex patterns (CSV/newlines).
- **`allow_external`**: include external domains in final results.
- **`extract_depth`**: `basic` | `advanced`.
- **`format`**: `markdown` | `text`.
- **`include_images`**: include images in crawl results.
- **`include_favicon`**: include favicon URL for each result.
- **`include_usage`**: include credit usage info.

An optional `advanced_options_json` lets you pass extra Tavily `/crawl` fields as a JSON object.

