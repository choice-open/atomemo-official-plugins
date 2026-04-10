# Tavily Extract Tool

## Tool

- **Name**: `tavily-extract`
- **Purpose**: Extract raw web page content from one or more URLs using Tavily Extract (`POST /extract`).

## Parameters

- **Tavily Credential**: select the stored `tavily` API key credential.
- **`urls`**: one URL per line (or comma-separated).
- **`query`**: optional user intent to rerank extracted chunks.
- **`chunks_per_source`**: 1-5 (default: 3).
- **`extract_depth`**: `basic` | `advanced`.
- **`format`**: `markdown` | `text`.
- **`include_images`**: include extracted image URLs.
- **`include_favicon`**: include favicon URL per result.
- **`include_usage`**: include credit usage info.

An optional `advanced_options_json` lets you pass extra Tavily `/extract` fields as a JSON object.

