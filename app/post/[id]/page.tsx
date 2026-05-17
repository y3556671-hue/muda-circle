import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Eye, MessageSquare, Calendar, Tag } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getPostDetail } from "@/lib/services/post-service";
import { CommentForm } from "@/components/comments/comment-form";
import { LikeButton } from "@/components/posts/like-button";
import { SiteHeader } from "@/components/layout/site-header";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const post = await getPostDetail(params.id, session?.user?.id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="btn-ghost text-sm !px-3 !py-2 inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <Link
            href={session?.user ? "/post/new" : "/login"}
            className="btn-primary text-sm !px-4 !py-2"
          >
            {session?.user ? "去发帖" : "登录互动"}
          </Link>
        </div>

        {/* Article */}
        <article className="card-elevation !rounded-[28px] overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
            <div className="flex flex-wrap items-center gap-2.5 text-sm">
              <span className="tag bg-[#002147]/8 text-[#002147]">
                <Tag className="h-3 w-3" />
                {post.category.name}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                  {(post.author.username ?? "?").charAt(0)}
                </span>
                {post.author.username ?? "待设置昵称"}
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.createdAt).toLocaleString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-slate-400" />
                {post.viewCount} 次浏览
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                {post._count.comments} 条评论
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
              {post.body}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
              <LikeButton
                postId={post.id}
                likedByViewer={post.likedByViewer}
                likeCount={post._count.likes}
                disabled={!session?.user || session.user.needsProfileCompletion}
              />
              {!session?.user ? (
                <span className="text-sm text-slate-400">登录后可点赞、评论和发帖</span>
              ) : null}
              {session?.user?.needsProfileCompletion ? (
                <Link href="/login" className="text-sm text-amber-600 hover:underline">
                  请先前往登录页设置昵称
                </Link>
              ) : null}
            </div>
          </div>
        </article>

        {/* Comments */}
        <section className="mt-6 space-y-4">
          <div className="card-elevation !rounded-[28px] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-5 w-5 text-[#002147]" />
              <h2 className="text-lg font-semibold text-[#002147]">
                评论 {post._count.comments > 0 ? `(${post._count.comments})` : ""}
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {post.comments.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
                  还没有评论，欢迎发表第一条看法。
                </div>
              ) : (
                post.comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="rounded-2xl bg-slate-50 px-5 py-4 transition hover:bg-slate-100/80"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#002147]/10 text-xs font-bold text-[#002147]">
                          {(comment.author.username ?? "?").charAt(0)}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {comment.author.username ?? "待设置昵称"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleString("zh-CN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {comment.body}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>

          {session?.user && !session.user.needsProfileCompletion ? (
            <CommentForm postId={post.id} />
          ) : (
            <div className="card-elevation !rounded-[28px] flex items-center justify-center px-6 py-8 text-center">
              <p className="text-sm text-slate-400">
                {session?.user ? (
                  <>
                    请先{" "}
                    <Link href="/login" className="font-medium text-[#CC8800] hover:underline">
                      设置昵称
                    </Link>{" "}
                    后再评论。
                  </>
                ) : (
                  <>
                    <Link href="/login" className="font-medium text-[#CC8800] hover:underline">
                      登录
                    </Link>{" "}
                    后可参与评论。
                  </>
                )}
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
