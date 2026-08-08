## Task 7 Report

### Implementation

- Replaced the placeholder `src/pages/posts/[slug].astro` with a full article detail page.
- Used `getCollection('posts', ({ data }) => !data.draft)` in `getStaticPaths()` so draft posts are not emitted as static pages.
- Used Astro content `render(post)` and `<Content />` to render each Markdown post body.
- Reused `BaseLayout`, `getResourceTypeById()`, and `formatDate()` for consistent metadata, page title, description, and site styling.
- Added article header metadata, title, description, tags, Markdown prose styling, and a footer link back to `/posts`.
- Added a repost notice for non-original posts, including a guarded external source link with `target="_blank"` and `rel="noopener noreferrer"` when `sourceUrl` exists.
- Preserved existing list-card link behavior by limiting changes to the detail route; existing repost-external cards still link directly to their source URL.

### Verification

- Ran `pnpm build`.
- Result: success. Astro built 13 pages and generated both sample detail pages under `dist/posts/astro-guide.md/index.html` and `dist/posts/hello-world.md/index.html`.
- Ran `git diff --check`.
- Result: success with no whitespace errors.
- Inspected generated static HTML with content search and confirmed original post Markdown, repost notice, source link text, and return link are present in the built output.

### Self-Review

- Confirmed the placeholder message is removed from `/posts/[slug]`.
- Confirmed original articles render Markdown content without a repost notice.
- Confirmed repost articles render Markdown content plus the copyright/source notice.
- Confirmed `sourceUrl` is optional and only renders the external "阅读原文" link when present.
- Confirmed the page uses the existing Tailwind color tokens, typography plugin classes, and focus/hover link behavior.
- Confirmed no package installation or download was performed.

### Commit

- Commit message: `feat: add post detail page with markdown rendering`

### Concerns

- No dedicated test runner is configured in `package.json`; verification is based on the required production build, whitespace validation, and generated HTML inspection.
- Current Astro content `post.id` values include the Markdown extension in generated paths and existing internal links, for example `/posts/hello-world.md`. This task preserves that behavior instead of changing slug semantics outside the brief.
