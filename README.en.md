# 墨大圈子 · Muda Circle

> A Chinese-language forum for international students at the University of Melbourne.
> Sign-in is restricted to `@student.unimelb.edu.au` addresses via a 6-digit email code.

**Next.js 14 (App Router) · TypeScript · Prisma 6.16 · PostgreSQL (Supabase) ·
NextAuth · Resend · Tailwind CSS — deployed on Vercel**

---

## What it does

- **Student-only sign-in.** Only `@student.unimelb.edu.au` addresses can request a 6-digit
  login code; the code is sent by email and exchanged for a session. A nickname must be
  set on first sign-in before posting, commenting or liking.
- **Six pre-seeded boards**: 学习互助 (study help), 生活资讯 (local life), 租房求租
  (rentals wanted), 二手交易 (second-hand), 活动娱乐 (events), 吐槽日常 (daily chat).
- Posts, comments, likes, categories, and a dashboard.

## Stack and why

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | One codebase for the forum and its API routes; server rendering by default |
| Data | PostgreSQL via Supabase + Prisma 6.16 | Relational model with typed queries and versioned migrations |
| Auth | NextAuth (Prisma adapter) + 6-digit email code | Fits a student-only audience without password handling |
| Email | Resend | Transactional email with a domain-verified sender |
| Styling | Tailwind CSS | Fast to iterate on a responsive layout |
| Deploy | Vercel | Push to main and it is live |

## Layout

```
app/                 16 files — routes, API routes, pages
components/           5 files — shared React components
lib/                 14 files — Prisma client, auth, email, data access
prisma/
  schema.prisma              User / Post / Comment / Like / Category + NextAuth models
  migrations/…_init_forum/   196-line initial migration
  seed.ts                    seeds the six boards
types/                        shared TypeScript types
```

43 TypeScript / TSX files, 3,193 lines.

## Deployment

The app is live on Vercel (`muda-circle.vercel.app`) with the database migration applied
and the seed data loaded. `vercel.json` is committed.

## Engineering notes from the commit history

The 15 commits are mostly real debugging, kept as-is rather than squashed, because they
show how the problems actually get solved:

- `修复 NextAuth 双实例导致 getServerSession 读取不到有效 JWT 会话` — two NextAuth
  instances meant `getServerSession` could not see a valid JWT session
- `统一使用 getEnv 剥离所有环境变量中的 UTF-8 BOM` — a UTF-8 BOM in an environment
  variable silently broke things
- `修复 DATABASE_URL 中 UTF-8 BOM 导致 Prisma 连接失败` — the same BOM, now in the
  connection string, which broke Prisma
- `延迟加载 Resend 避免构建时 Header 编码错误`
- `修复 RESEND_FROM 中文导致构建失败`
- `修复分类接口预渲染导致数据库连接失败`
- `修复按钮交互卡顿 点赞乐观更新评论即时反馈`

## Known limitations (as recorded in the Chinese README)

- `RESEND_FROM` is currently set to `onboarding@resend.dev`, which is for development and
  testing only; a real verified sending address is needed for production.
- The "hot" sort is a simple combination of view count, comment count and like count —
  appropriate for a first version.
- Post bodies render as plain text with line breaks; Markdown is not supported yet.

## Local setup

```bash
npm install
cp .env.local.example .env.local     # fill in DATABASE_URL, RESEND_API_KEY, NEXTAUTH_SECRET …
npx prisma migrate dev                # create the schema locally
npm run prisma:seed                   # seed the six boards
npm run dev
```

See `.env.local.example` for the full list of required variables. **Never commit real
credentials** — `.env` and `.env*.local` are git-ignored.

## Author

Meng Yiyang — University of Melbourne, Bachelor of Computer and Software Systems.
Contact: 3641316351@qq.com
