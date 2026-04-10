# Tavily Search Tool

## Tool

- **Name**: `tavily-search`
- **Purpose**: Executes a web search using Tavily and returns the JSON response.

## Parameters

- **Tavily Credential**: select the stored `tavily` API key credential.
- **`query`**: the search query string.
- **`search_depth`**: `basic` | `fast` | `ultra-fast` | `advanced`.
- **`max_results`**: maximum results to return (0-20).
- **`topic`**: `general` | `news` | `finance`.
- **`include_answer`**: `basic` | `advanced` (adds an LLM-generated answer).
- **`include_raw_content`**: `markdown` | `text` (adds parsed result content).
- **`include_images`**: whether to include images.
- **`include_usage`**: whether to include credit usage info.

An optional `advanced_options_json` lets you pass extra Tavily `/search` fields as a JSON object.

