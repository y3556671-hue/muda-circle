import Link from "next/link";
import { MessageSquareMore, TrendingUp, Clock, BookOpen, Newspaper, House, ShoppingBag, CalendarHeart, MessageCircleHeart } from "lucide-react";
import { getCategories } from "@/lib/services/category-service";
import { listPosts } from "@/lib/services/post-service";
import { SiteHeader } from "@/components/layout/site-header";

const iconMap: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  newspaper: Newspaper,
  house: House,
  "shopping-bag": ShoppingBag,
  "calendar-heart": CalendarHeart,
  "message-circle-heart": MessageCircleHeart,
};

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

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name
    : null;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200/60 bg-[#002147]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(204,136,0,0.15),transparent)]" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgba(255,255,255,0.06),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <MessageSquareMore className="h-4 w-4 text-[#CC8800]" />
                <span>墨尔本大学中国留学生社区</span>
                <span className="mx-1 h-1 w-1 rounded-full bg-white/30" />
                <span>仅限 @student.unimelb.edu.au</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                墨大<span className="text-[#CC8800]">圈子</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                在这里交流课程经验、租房信息、二手交易与校园日常。游客可浏览，墨大学生邮箱用户可参与互动。
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {sort === "latest" ? (
                  <span className="tag border border-white/15 bg-white/8 text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-[#CC8800]" />
                    最新排序
                  </span>
                ) : (
                  <span className="tag border border-white/15 bg-white/8 text-slate-200">
                    <TrendingUp className="h-3.5 w-3.5 text-[#CC8800]" />
                    热门排序
                  </span>
                )}
                {selectedCategoryName && (
                  <span className="tag border border-white/15 bg-white/8 text-slate-200">
                    {selectedCategoryName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px,1fr] lg:px-8">
          {/* Sidebar */}
          <aside className="h-fit space-y-3 lg:sticky lg:top-24">
            <div className="card-elevation !rounded-2xl p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">版块导航</h2>
              <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
                <Link
                  href={`/?sort=${sort}`}
                  className={`tag w-full justify-start !px-3 !py-2.5 ${
                    !selectedCategory
                      ? "bg-[#002147] text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md ${!selectedCategory ? "bg-white/20" : "bg-slate-200"}`}>
                    <MessageSquareMore className="h-3 w-3" />
                  </span>
                  全部帖子
                </Link>
                {categories.map((category) => {
                  const Icon = iconMap[category.icon] ?? MessageSquareMore;
                  const active = selectedCategory === category.slug;
                  return (
                    <Link
                      key={category.id}
                      href={`/?category=${category.slug}&sort=${sort}`}
                      className={`tag w-full justify-start !px-3 !py-2.5 ${
                        active
                          ? "bg-[#002147] text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md ${active ? "bg-white/20" : "bg-slate-200"}`}>
                        <Icon className="h-3 w-3" />
                      </span>
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Post List */}
          <section className="min-w-0 space-y-4">
            {/* Toolbar */}
            <div className="card-elevation !rounded-2xl flex items-center justify-between gap-4 p-4">
              <div>
                <h2 className="text-lg font-semibold text-[#002147]">帖子列表</h2>
                <p className="text-sm text-slate-500">
                  {selectedCategoryName ? `正在浏览「${selectedCategoryName}」` : "查看全部版块的最新讨论"}
                </p>
              </div>
              <div className="flex rounded-full bg-slate-100 p-1">
                {(["latest", "hot"] as const).map((item) => (
                  <Link
                    key={item}
                    href={`/?${selectedCategory ? `category=${selectedCategory}&` : ""}sort=${item}`}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      sort === item
                        ? "bg-white text-[#002147] shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {item === "latest" ? <Clock className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                    {sortLabels[item]}
                  </Link>
                ))}
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="card-elevation !rounded-2xl flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <MessageSquareMore className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-700">暂无帖子</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  这个版块暂时还没有帖子，成为第一个分享内容的人吧。
                </p>
                <Link
                  href="/login"
                  className="btn-primary mt-6 text-sm !px-6 !py-2.5"
                >
                  登录后发帖
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, index) => (
                  <article
                    key={post.id}
                    className="card-elevation !rounded-2xl group p-5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="tag bg-[#002147]/8 text-[#002147]">
                        {post.category.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                          {(post.author.username ?? "?").charAt(0)}
                        </span>
                        {post.author.username ?? "待设置昵称"}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span>浏览 {post.viewCount}</span>
                      <span className="text-slate-400">·</span>
                      <span>{post._count.comments} 评论</span>
                      <span className="text-slate-400">·</span>
                      <span>{post._count.likes} 赞</span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#002147]">
                      <Link href={`/post/${post.id}`} className="after:absolute after:inset-0" />
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-7 text-slate-500">
                      {post.body}
                    </p>

                    <div className="relative mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleString("zh-CN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Link
                        href={`/post/${post.id}`}
                        className="relative z-10 text-sm font-medium text-[#CC8800] transition hover:text-[#996600]"
                      >
                        查看详情 →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
