# Tavily Map Tool

## Tool

- **Name**: `tavily-map`
- **Purpose**: Graph-based website mapping using Tavily (`POST /map`).

## Parameters

- **Tavily Credential**: select the stored `tavily` API key credential.
- **`url`**: root URL to begin the mapping.
- **`instructions`**: optional natural-language instructions for the crawler.
- **`max_depth`**: max depth (1-5).
- **`max_breadth`**: max links per level (1-500).
- **`limit`**: total links to process before stopping.
- **`select_paths` / `exclude_paths`**: optional regex patterns (CSV/newlines).
- **`allow_external`**: include external domain links in final results.
- **`timeout`**: mapping timeout (seconds).
- **`include_usage`**: include credit usage info.

An optional `advanced_options_json` lets you pass extra Tavily `/map` fields as a JSON object.

