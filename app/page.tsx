import Link from "next/link";
import { MessageSquareMore } from "lucide-react";
import { getCategories } from "@/lib/services/category-service";
import { listPosts } from "@/lib/services/post-service";
import { BRAND } from "@/lib/constants/theme";
import { SiteHeader } from "@/components/layout/site-header";

const sortLabels = {
  latest: "最新",
  hot: "热门",
} as const;

export default async function Home({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string };
}) {
  const selectedCategory = searchParams?.category;
  const sort = searchParams?.sort === "hot" ? "hot" : "latest";
  const [categories, posts] = await Promise.all([
    getCategories(),
    listPosts({ categorySlug: selectedCategory, sort }),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-[#002147] text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-100">
                  <MessageSquareMore className="h-4 w-4 text-[#CC8800]" />
                  墨尔本大学中国留学生社区
                </div>
                <h1 className="text-3xl font-bold sm:text-4xl">墨大圈子</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  在这里交流课程经验、租房信息、二手交易与校园日常。游客可浏览，只有墨大学生邮箱用户可以参与互动。
                </p>
              </div>
            </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/15 px-3 py-1">
              主色 {BRAND.primary}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">
              仅限 @student.unimelb.edu.au 登录互动
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">
              当前排序：{sortLabels[sort]}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px,1fr] lg:px-8">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 card-shadow">
          <h2 className="text-lg font-semibold text-[#002147]">版块导航</h2>
          <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
            <Link
              href={`/?sort=${sort}`}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                !selectedCategory ? "bg-[#002147] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              全部帖子
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?category=${category.slug}&sort=${sort}`}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category.slug
                    ? "bg-[#002147] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 card-shadow">
            <div>
              <h2 className="text-lg font-semibold text-[#002147]">帖子列表</h2>
              <p className="text-sm text-slate-500">{selectedCategory ? `当前版块：${selectedCategory}` : "查看全部版块的最新讨论"}</p>
            </div>
            <div className="flex gap-2 rounded-full bg-slate-100 p-1">
              {(["latest", "hot"] as const).map((item) => (
                <Link
                  key={item}
                  href={`/?${selectedCategory ? `category=${selectedCategory}&` : ""}sort=${item}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    sort === item ? "bg-white text-[#002147] shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {sortLabels[item]}
                </Link>
              ))}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 card-shadow">
              这个版块暂时还没有帖子，来发布第一条内容吧。
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-3xl border border-slate-200 bg-white p-5 card-shadow">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-full bg-[#002147]/10 px-3 py-1 text-[#002147]">{post.category.name}</span>
                  <span>作者：{post.author.username ?? "待设置昵称"}</span>
                  <span>浏览 {post.viewCount}</span>
                  <span>评论 {post._count.comments}</span>
                  <span>点赞 {post._count.likes}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">
                  <Link href={`/post/${post.id}`} className="hover:text-[#002147]">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{post.body}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    发布于 {new Date(post.createdAt).toLocaleString("zh-CN")}
                  </span>
                  <Link href={`/post/${post.id}`} className="text-sm font-medium text-[#CC8800] hover:underline">
                    查看详情
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  </>
);
}
