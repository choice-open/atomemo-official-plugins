# Firecrawl Atomemo Plugin

[Firecrawl](https://www.firecrawl.dev/) turns websites into structured, LLM-friendly data. This plugin connects Atomemo to the [Firecrawl API](https://docs.firecrawl.dev/api-reference/introduction) so you can crawl sites, scrape individual URLs, batch scrape lists of URLs, map site structure, search the web, and extract structured data with prompts and schemas.

The plugin is designed for web data collection workflows. A common pattern is: preview or map a site, launch a crawl or scrape job, poll for status or errors, then pass markdown, HTML, links, or extracted structured output to downstream Atomemo nodes.

## Tools

### Crawling

| Tool | Description | API Reference |
| --- | --- | --- |
| **Firecrawl Crawl** (`firecrawl-crawl`) | Start an asynchronous website crawl from a root URL with path filters, concurrency, sitemap handling, and shared scrape options. | [Crawl](https://docs.firecrawl.dev/features/crawl) |
| **Firecrawl Cancel Crawl** (`firecrawl-cancel-crawl`) | Cancel an active crawl job by ID. | [Cancel Crawl](https://docs.firecrawl.dev/api-reference/endpoint/crawl-delete) |
| **Firecrawl Get Crawl Status** (`firecrawl-get-crawl-status`) | Poll a crawl job and retrieve completed results as they become available. | [Get Crawl Status](https://docs.firecrawl.dev/api-reference/v1-endpoint/crawl-get) |
| **Firecrawl Get Crawl Errors** (`firecrawl-get-crawl-errors`) | Retrieve crawl failures and `robots.txt` blocks for a crawl job. | [Get Crawl Errors](https://docs.firecrawl.dev/api-reference/endpoint/crawl-get-errors) |
| **Firecrawl List Active Crawls** (`firecrawl-list-active-crawls`) | List active crawl jobs for the authenticated Firecrawl team. | [Get Active Crawls](https://docs.firecrawl.dev/api-reference/endpoint/crawl-active) |
| **Firecrawl Preview Crawl Params** (`firecrawl-preview-crawl-params`) | Preview crawl request parameters before launching a crawl. Useful for debugging prompt-driven or structured crawl options. | [Crawl Params Preview](https://docs.firecrawl.dev/api-reference/endpoint/crawl-params-preview) |

### Scraping

| Tool | Description | API Reference |
| --- | --- | --- |
| **Firecrawl Scrape** (`firecrawl-scrape`) | Scrape one URL and return content in formats such as markdown, HTML, links, screenshots, or other configured scrape outputs. | [Scrape](https://docs.firecrawl.dev/api-reference/endpoint/scrape) |
| **Firecrawl Batch Scrape** (`firecrawl-batch-scrape`) | Launch a batch scrape job for multiple URLs. | [Batch Scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape) |
| **Firecrawl Cancel Batch Scrape** (`firecrawl-cancel-batch-scrape`) | Cancel an in-progress batch scrape job. | [Cancel Batch Scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-delete) |
| **Firecrawl Get Batch Scrape Status** (`firecrawl-batch-scrape-status`) | Poll a batch scrape job and retrieve results. | [Get Batch Scrape Status](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get) |
| **Firecrawl Get Batch Scrape Errors** (`firecrawl-batch-scrape-errors`) | Retrieve failures associated with a batch scrape job. | [Get Batch Scrape Errors](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get-errors) |

### Discovery and Search

| Tool | Description | API Reference |
| --- | --- | --- |
| **Firecrawl Map** (`firecrawl-map`) | Discover URLs on a site without scraping every page in full. Helpful for URL inventory and candidate selection. | [Map](https://docs.firecrawl.dev/api-reference/endpoint/map) |
| **Firecrawl Search** (`firecrawl-search`) | Search the web and optionally scrape result pages for richer response content. | [Search](https://docs.firecrawl.dev/api-reference/endpoint/search) |

### Structured Extraction

| Tool | Description | API Reference |
| --- | --- | --- |
| **Firecrawl Extract** (`firecrawl-extract`) | Extract structured data from one or more URLs using a prompt and optional JSON schema. | [Extract](https://docs.firecrawl.dev/api-reference/endpoint/extract) |
| **Firecrawl Get Extract Status** (`firecrawl-get-extract-status`) | Poll an extract job until it completes or fails. | [Get Extract Status](https://docs.firecrawl.dev/api-reference/endpoint/extract-get) |

## Credential

Configure one `firecrawl` credential with:

- `api_key` required Firecrawl API key

The plugin expects a standard Firecrawl key that starts with `fc-`.

## Authentication Setup

### 1. Create or Copy a Firecrawl API Key

1. Sign in to the Firecrawl dashboard
2. Create or reveal an API key for the team you want Atomemo to use
3. Copy the key

### 2. Configure the Atomemo Credential

Create a `firecrawl` credential in Atomemo:

- **Firecrawl API Key**: your `fc-...` API key

### 3. Verify Job and Credit Expectations

Many Firecrawl operations are asynchronous and billed per page or per advanced option. Before using large crawl or batch-scrape jobs in production, verify:

- your account has sufficient credits
- the crawl `limit` matches your intended scope
- proxy, PDF parsing, JSON extraction, or enhanced features are acceptable for your credit budget

For the API overview, base URL, and auth format, see the [Firecrawl API introduction](https://docs.firecrawl.dev/api-reference/introduction).

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
