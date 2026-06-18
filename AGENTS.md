# AGENTS.md

## Project: date_tools

This project is a Next.js 15 + React 19 date tools website deployed to Cloudflare Workers using OpenNext for Cloudflare.

## Required context file

Before making changes, always read:

```txt
PROJECT_MEMO.md
```

This file contains the current project state, deployment history, solved issues, remaining tasks, and important constraints.

After completing any task, update `PROJECT_MEMO.md` using the same fixed template already used in that file.

Do not change the memo structure unless the user explicitly requests it.

## Core project rules

1. The Cloudflare Worker name is:

```txt
datetools
```

Do not rename it to `date-tools`.

2. Deployment uses OpenNext for Cloudflare.

Expected scripts in `package.json`:

```json
{
  "build": "next build",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
}
```

3. Do not add this compatibility flag to `wrangler.jsonc`:

```jsonc
"allow_eval_during_startup"
```

It caused Wrangler preview to fail because it is already default after 2025-06-01.

4. Do not reintroduce `fs`, `path`, or `config.json` reading inside `app/layout.jsx`.

5. Do not import Firebase Client SDK directly in files that may execute during Cloudflare Worker runtime or Server Render.

Use one of these patterns instead:

* Client Component with `'use client'`
* Dynamic import inside `useEffect`
* Browser-only logic

6. The known working DNS and Route setup for `www.date-tool.com` is:

```txt
DNS:
www CNAME date-tool.com Proxied

Worker Route:
www.date-tool.com/* → datetools
```

7. Do not run:

```powershell
npm audit fix --force
```

unless the user explicitly approves, because it may introduce breaking dependency changes.

8. Before assuming Cloudflare will succeed, test locally when relevant:

```powershell
npm ci
npm run preview
```

9. For Cloudflare runtime errors, use:

```powershell
npx wrangler tail datetools --format pretty
```

10. Never commit secrets, private API keys, or `.env.local` values to the repository.

## Required workflow for Codex

For every requested task:

1. Read `PROJECT_MEMO.md`.
2. Inspect relevant files.
3. Make the smallest safe change.
4. Run appropriate checks when possible.
5. Update `PROJECT_MEMO.md` in the same fixed template.
6. Summarize:

   * What changed
   * Files changed
   * Commands run
   * Test result
   * What remains

## Memo update rules

When updating `PROJECT_MEMO.md`:

* Keep the same headings.
* Update the current state.
* Move solved items from “المتبقي” to “تم إنجازه” or “الأخطاء المكتشفة”.
* Add any new error with:

  * الأعراض
  * السبب
  * الحل
  * الحالة
* Add commands used.
* Add affected files.
* Do not remove historical solved issues unless the user asks.
