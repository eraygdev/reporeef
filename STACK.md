# Tech Stack

> Complete technology overview for [RepoReef](https://reporeef.com) — a platform where developers discover open source projects, collaborate with teams, and find teammates.

---

## 📦 Hosting & Deployment

| Service               | Purpose                                                 | Plan        |
| :-------------------- | :------------------------------------------------------ | :---------- |
| **Vercel**            | Frontend hosting — [reporeef.com](https://reporeef.com) | Free        |
| **Contabo VPS**       | Backend hosting (planned)                               | Cloud VPS 1 |
| **Cloudflare Tunnel** | Backend exposure (local Docker → api.reporeef.com)      | Free        |
| **Neon**              | Serverless PostgreSQL                                   | Free        |
| **Cloudflare**        | DNS management + Email Routing                          | Free        |

---

## 🌐 Domain & DNS

| Service                      | Purpose                                            |
| :--------------------------- | :------------------------------------------------- |
| **Cloudflare Registrar**     | `reporeef.com` domain registration                 |
| **Cloudflare DNS**           | A/CNAME/MX/TXT records                             |
| **Cloudflare Tunnel**        | `api.reporeef.com` → local backend (no open ports) |
| **Cloudflare Email Routing** | Inbound email forwarding                           |
| **Google Search Console**    | Domain verification + sitemap submission           |

> **Note (frontend):** Cloudflare proxy is **disabled** for `reporeef.com` (grey cloud) — Vercel provides its own CDN and DDoS protection, layering both causes SSL conflicts.
>
> **Note (backend):** `api.reporeef.com` uses **Cloudflare Proxy + Tunnel** (orange cloud). Origin IP stays hidden — traffic flows outbound only.

---

## 📧 Email Infrastructure

| Service                         | Purpose                              |
| :------------------------------ | :----------------------------------- |
| **Cloudflare Email Routing**    | MX records + inbound routing         |
| **Cloudflare DMARC Management** | SPF/DKIM/DMARC policies              |
| **Gmail**                       | Inbox + filter rules (DMARC reports) |

**Active addresses:**

- `hello@reporeef.com` — general contact
- `dmarc@reporeef.com` — DMARC aggregate reports

---

## 🔐 Authentication & Security

| Tool                         | Purpose                                           |
| :--------------------------- | :------------------------------------------------ |
| **GitHub OAuth 2.0**         | Passwordless authentication                       |
| **JWT (HS256)**              | 7-day sessions, no email in token (privacy-first) |
| **golang-jwt/jwt/v5**        | Token signing and verification                    |
| **golang.org/x/oauth2**      | OAuth flow implementation                         |
| **CSRF State Store**         | Single-use, 10-min TTL, in-memory (OAuth flow)    |
| **golang.org/x/time/rate**   | Per-IP rate limiting (token bucket, 5/s burst 10) |
| **Cloudflare Universal SSL** | HTTPS certificates                                |

---

## 🎨 Frontend

| Tool                                    | Purpose                                          |
| :-------------------------------------- | :----------------------------------------------- |
| **React 19**                            | UI framework                                     |
| **Vite 8**                              | Build tool                                       |
| **React Router v7**                     | Client-side routing                              |
| **Tailwind CSS v4**                     | Styling with custom design tokens (`@theme`)     |
| **vite-plugin-geo**                     | Auto-generated sitemap.xml + robots.txt          |
| **Carter One / Inter / JetBrains Mono** | Typography (Google Fonts)                        |
| **Context API**                         | State management (Auth, Config, Language, Toast) |
| **Custom SVG Icons**                    | No emojis — all icons hand-crafted               |
| **useFocusTrap**                        | Custom hook — modal Tab cycle + focus restore    |

---

## 🖥️ Backend

| Tool               | Purpose                                |
| :----------------- | :------------------------------------- |
| **Go 1.26**        | Language                               |
| **Gin 1.12**       | HTTP framework                         |
| **pgx/v5**         | PostgreSQL driver (no ORM, raw SQL)    |
| **godotenv**       | Environment loading (development only) |
| **Sentry SDK**     | Panic + 500 error capture              |
| **golang-migrate** | Versioned DB schema migrations         |

---

## 🗄️ Database

| Tool                   | Purpose                                                                    |
| :--------------------- | :------------------------------------------------------------------------- |
| **Neon PostgreSQL**    | Serverless Postgres (pooled connection)                                    |
| **pgxpool**            | Connection pool (MaxConns: 10, MinConns: 2)                                |
| **Advisory Locks**     | Race condition prevention (`pg_advisory_xact_lock` on user project limits) |
| **Row-Level Locking**  | `FOR UPDATE` on contributor approval (race-safe)                           |
| **audit_logs table**   | Critical action tracking (login, create, delete, update)                   |
| **PgError Code Check** | `23505` UNIQUE violation → user-friendly 409                               |

**Schema highlights:**

- `project_contributors` — single source of truth (no denormalized columns)
- `max_contributors` — set at creation, immutable after
- `JWT without email` — privacy-first design
- `LOWER(github_url)` unique index — prevents duplicate project shares
- `project_stars` composite PK — `(project_id, user_id)`, no dup stars

**Migration files (`migrations/`):**

| File                  | What it does                                                                                                            |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `001_initial_schema`  | users, projects, categories, project_categories, project_contributors, project_stars, audit_logs + `updated_at` trigger |
| `002_indexes`         | Performance indexes (author, created_at, status partials, GitHub URL unique)                                            |
| `003_cleanup`         | Drops unused columns (`password_hash`, `google_id`, `projects.stars`), fixes timestamp types, dedupes indexes           |
| `004_seed_categories` | 23 seed categories with preserved IDs + sequence reset                                                                  |

**Migration rules:** only add new files, never edit existing ones. Baseline: `force 2`, then `up` → version 4.

---

## 🐳 DevOps

| Tool                   | Purpose                                                |
| :--------------------- | :----------------------------------------------------- |
| **GitHub Actions**     | CI — build + vet + test + lint (backend)               |
| **GitHub Actions**     | CI — build + lint (frontend)                           |
| **Docker multi-stage** | Alpine runtime, non-root user (`appuser`), healthcheck |
| **Docker Compose**     | Two services: `backend` + `cloudflared`                |
| **cloudflared**        | Named tunnel → no open inbound ports                   |
| **`.dockerignore`**    | Prevents `.env`, docs, tests from entering image       |
| **Makefile**           | `up`, `logs-t`, `check`, `migrate-*`, `rebuild`        |

---

## 🛡️ Security Layers

| Layer                        | Where    | What it does                                                     |
| :--------------------------- | :------- | :--------------------------------------------------------------- |
| **CORS**                     | Backend  | Strict origin allowlist (`FRONTEND_URL` + `ALLOWED_ORIGINS`)     |
| **Security Headers**         | Backend  | OWASP: `nosniff`, `DENY`, HSTS (prod only), `Permissions-Policy` |
| **Trusted Proxies**          | Backend  | Cloudflare IP ranges only in prod; `nil` in dev                  |
| **XSS Sanitization**         | Backend  | HTML tag stripping, `javascript:` + `data:` removal              |
| **Input Validation**         | Backend  | Regex + length + min/max + URL check                             |
| **SQL Injection Prevention** | Backend  | Parameterized queries only                                       |
| **GitHub Repo Check**        | Backend  | Public verification via `git-upload-pack` (no API rate limit)    |
| **Image Validation**         | Backend  | GitHub-only, 2MB max (HEAD Content-Length), format whitelist     |
| **Profanity Filter**         | Backend  | Custom exact-word match (TR + EN, leet-speak normalized)         |
| **Field-Level Errors**       | Frontend | Auto-scroll + red flash + inline message                         |
| **JWT without PII**          | Backend  | No email in token claims                                         |
| **CSRF State**               | Backend  | OAuth state single-use, 10-min TTL                               |

---

## 🎯 SEO & Discovery

| Tool                      | Purpose                                     |
| :------------------------ | :------------------------------------------ |
| **Google Search Console** | Domain verification + indexing              |
| **sitemap.xml**           | Auto-generated via `vite-plugin-geo`        |
| **robots.txt**            | Auto-generated via `vite-plugin-geo`        |
| **OG Meta Tags**          | Social sharing (Twitter, WhatsApp, Discord) |
| **Canonical URLs**        | Prevent duplicate content                   |

---

## 🌍 i18n & UX

| Tool                 | Purpose                                           |
| :------------------- | :------------------------------------------------ |
| **Custom i18n**      | EN + TR — `LanguageContext` + `translations/`     |
| **Toast System**     | Custom `useToast`, max 3 stacked, 4s auto-dismiss |
| **ConfirmModal**     | Custom — native `confirm()` is forbidden          |
| **FieldError**       | Custom — auto-scroll + flash + inline hint        |
| **useFocusTrap**     | Modal Tab cycle lock + focus restore on close     |
| **useScale**         | User text-size preference (sm / md / lg)          |
| **useSearchHistory** | localStorage-backed recent searches               |
| **useDebounced**     | 300-400ms debounce for search inputs              |

---

## 📁 Code Organization

| Aspect                | Approach                                                                                                             |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Repositories**      | Two separate repos: `reporeef` (frontend) + `reporeef-api` (backend)                                                 |
| **README.md**         | Full documentation in both repos                                                                                     |
| **LICENSE**           | MIT (both repos)                                                                                                     |
| **`.env.example`**    | Committed template                                                                                                   |
| **`.gitignore`**      | Excludes `.env` and build artifacts                                                                                  |
| **Commit convention** | Short, single-line, Turkish                                                                                          |
| **Backend layout**    | `cmd/server/main.go` = wiring only, `internal/app/*` = all business logic, `internal/profanity/*` = isolated package |

---

## 🚧 Planned / Roadmap

| Tool                              | Purpose                        | ETA        |
| :-------------------------------- | :----------------------------- | :--------- |
| **Structured logging (slog)**     | JSON logs for prod             | This week  |
| **UptimeRobot**                   | Uptime monitoring              | This week  |
| **Test coverage**                 | Target 60% (auth, validation)  | 2 weeks    |
| **Cookie banner / KVKK**          | GDPR compliance                | 2 weeks    |
| **Sightengine**                   | NSFW image moderation          | 2 weeks    |
| **Lazy loading / code splitting** | Bundle 500KB → split           | 3 weeks    |
| **Redis**                         | Distributed rate limit + cache | 1-2 months |
| **Prometheus + Grafana**          | Metrics + dashboards           | 3-6 months |
| **OpenTelemetry**                 | Distributed tracing            | 6+ months  |

**Completed recently:**

- ✅ **Sentry** — backend panic + 500 error capture
- ✅ **golang-migrate** — versioned DB migrations (001-004)
- ✅ **Modal focus trap** — accessibility + Tab cycle
- ✅ **Cloudflare Tunnel** — backend exposure without open ports

---

## 🧭 Design Principles

- **Dark-only** UI (no light mode planned)
- **Privacy-first** (no email in JWT, no password storage)
- **Two-layer validation** (frontend + backend always)
- **Stable error codes** (translated on the frontend)
- **No native browser dialogs** (`alert`, `confirm` forbidden)
- **Design tokens** — no hard-coded values
- **Fail-open** on non-critical external checks (image size, repo visibility)
- **Fail-closed** on security-critical checks (auth, ownership)
- **Single source of truth** for data (contributors table, no denormalized counts)
- **Race-safe by default** — advisory locks + row-level `FOR UPDATE`

---

**Last updated:** 2026
