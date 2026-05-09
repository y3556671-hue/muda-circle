# 墨大圈子

面向墨尔本大学中国留学生的中文论坛网站。

## 项目特点

- 仅允许 `@student.unimelb.edu.au` 邮箱通过 6 位验证码登录
- 首次登录后需要设置昵称，完成后才可发帖、评论、点赞
- 游客可浏览首页和帖子详情，但无法参与互动
- 预置版块：学习互助、生活资讯、租房求租、二手交易、活动娱乐、吐槽日常
- 技术栈：Next.js 14 App Router、Tailwind CSS、PostgreSQL、Prisma、NextAuth、Resend

## 本地开发环境

建议环境：

- Node.js 18.18+ 或 20+
- npm 9+
- 可访问 PostgreSQL 数据库
- 可用的 Resend API Key

## 环境变量

项目使用 `.env.local`，当前已写入以下变量：

```env
DATABASE_URL=postgresql://postgres.pbewtmpztsedjlwjsdop:nezdut-kupfi0-Rizmib@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
RESEND_API_KEY=re_ZhPKxCkw_NenUnjdDGkgHf7PMuNMp89Rf
NEXTAUTH_SECRET=你的随机 32 位字符串
NEXTAUTH_URL=http://localhost:3000
RESEND_FROM=墨大圈子 <onboarding@resend.dev>
```

说明：

- `NEXTAUTH_SECRET` 已生成，可直接本地使用。
- `RESEND_FROM` 在生产环境建议替换为你自己在 Resend 已验证域名下的邮箱地址。
- Prisma CLI 默认会读取 `.env`，本项目已在 `prisma.config.ts` 和 `prisma/seed.ts` 中显式处理 `.env.local`。

## 安装依赖

```bash
npm install
```

## 初始化数据库

首次运行前执行：

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

说明：

- `prisma:migrate` 会创建并应用数据库迁移
- `prisma:seed` 会写入 6 个预置版块

## 启动本地项目

```bash
npm run dev
```

启动后访问：

- `http://localhost:3000`

## 已实现页面

- `/` 首页：版块导航、帖子列表、最新/热门排序
- `/post/[id]` 帖子详情页：正文、评论、点赞
- `/post/new` 发帖页：仅登录且完成昵称设置的用户可访问
- `/login` 登录注册页：邮箱 -> 验证码 -> 设置昵称

## 已实现 API

- `POST /api/auth/send-code` 发送验证码
- `POST /api/auth/complete-profile` 设置昵称
- `GET|POST /api/auth/[...nextauth]` NextAuth 登录会话入口
- `GET /api/categories` 获取版块列表
- `GET|POST /api/posts` 获取帖子列表 / 创建帖子
- `GET /api/posts/[id]` 获取帖子详情
- `POST|DELETE /api/posts/[id]/like` 点赞 / 取消点赞
- `POST /api/comments` 发表评论

## 验证建议

你可以按下面顺序验证：

1. 打开首页，确认能看到论坛首页与预置版块
2. 用非 `@student.unimelb.edu.au` 邮箱请求验证码，确认被拒绝
3. 用合法学邮请求验证码，确认收到邮件
4. 使用错误验证码登录，确认失败
5. 使用正确验证码登录，确认会进入设置昵称步骤
6. 设置昵称后返回首页，进入 `/post/new` 发帖
7. 打开帖子详情页，确认可评论和点赞
8. 未登录状态下刷新页面，确认发帖/评论/点赞入口受限

## 本地运行命令汇总

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 部署到 Vercel

### 1. 推送代码到 Git 仓库

把当前项目推送到 GitHub、GitLab 或 Bitbucket。

### 2. 在 Vercel 导入项目

在 Vercel 中选择你的仓库并导入。

### 3. 配置环境变量

在 Vercel 项目设置中添加：

- `DATABASE_URL`
- `RESEND_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `RESEND_FROM`

建议：

- `NEXTAUTH_URL` 填你的正式域名，例如 `https://your-project.vercel.app`
- `RESEND_FROM` 使用你在 Resend 已验证域名下的发件地址

### 4. 执行数据库迁移

推荐在本地执行完迁移并提交 `prisma/migrations/` 后再部署。

如需在部署后补跑，可在连接数据库后执行：

```bash
npx prisma migrate deploy
npm run prisma:seed
```

### 5. 验证生产环境

部署完成后重点检查：

1. 首页和帖子详情是否正常加载
2. 邮箱验证码是否能正常发送
3. 登录后是否能创建会话
4. 昵称设置是否成功
5. 发帖、评论、点赞是否正常

## 当前注意事项

- `RESEND_FROM` 目前使用 `onboarding@resend.dev`，仅适合开发测试；正式环境请替换为你自己的已验证发件地址。
- 热门排序当前基于浏览量、评论数、点赞数的简单组合分值，适合第一版上线。
- 帖子正文当前按纯文本渲染，保留换行，不支持 Markdown 富文本。

## 如何在本地运行

按顺序执行：

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

然后访问 `http://localhost:3000`。

## 如何部署到 Vercel

按顺序执行：

1. 将项目代码推送到 Git 仓库
2. 在 Vercel 导入项目
3. 配置 `DATABASE_URL`、`RESEND_API_KEY`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`、`RESEND_FROM`
4. 确保数据库已执行 migration，并完成 seed
5. 部署完成后测试登录、发帖、评论、点赞全流程
