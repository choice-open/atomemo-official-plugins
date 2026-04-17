# Hacker News Atomemo Plugin

[Hacker News](https://news.ycombinator.com/) is a community-driven link and discussion site popular with engineers, founders, and technical readers. This plugin connects Atomemo to the [Algolia-powered Hacker News Search API](https://hn.algolia.com/api) so you can search stories and comments, fetch a specific article, and inspect user profiles without configuring credentials.

This plugin is intentionally lightweight: it is ideal for research workflows, trend snapshots, and pulling discussion context into downstream summarization or analysis steps.

## Tools

### Search

| Tool | Description | API Reference |
| --- | --- | --- |
| **Search Hacker News** (`search-hacker-news`) | Search Hacker News stories and comments with filters for tags, author, story ID, date sorting, and numeric filters. | [Hacker News Search API](https://hn.algolia.com/api) |

### Lookup

| Tool | Description | API Reference |
| --- | --- | --- |
| **Get Hacker News Article** (`get-hacker-news-article`) | Retrieve one Hacker News item by article ID, with optional comments. | [Hacker News Search API](https://hn.algolia.com/api) |
| **Get Hacker News User** (`get-hacker-news-user`) | Retrieve a Hacker News user profile by username. | [Hacker News Search API](https://hn.algolia.com/api) |

## Credential

No credential is required.

The plugin uses the public Algolia-backed Hacker News API and does not ask for an API key or OAuth setup.

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
