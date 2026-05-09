import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { MessageSquare, Eye } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getPostDetail } from "@/lib/services/post-service";
import { CommentForm } from "@/components/comments/comment-form";
import { LikeButton } from "@/components/posts/like-button";

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
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          返回首页
        </Link>
        <Link
          href={session?.user ? "/post/new" : "/login"}
          className="rounded-full bg-[#002147] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
        >
          {session?.user ? "去发帖" : "登录互动"}
        </Link>
      </div>

      <article className="rounded-[32px] border border-slate-200 bg-white p-6 card-shadow">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-[#002147]/10 px-3 py-1 text-[#002147]">{post.category.name}</span>
          <span>作者：{post.author.username ?? "待设置昵称"}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {post.viewCount}</span>
          <span className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {post._count.comments}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#002147]">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-400">发布于 {new Date(post.createdAt).toLocaleString("zh-CN")}</p>
        <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">{post.body}</div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
          <LikeButton
            postId={post.id}
            likedByViewer={post.likedByViewer}
            likeCount={post._count.likes}
            disabled={!session?.user || session.user.needsProfileCompletion}
          />
          {!session?.user ? <span className="text-sm text-slate-500">登录后可点赞、评论和发帖</span> : null}
          {session?.user?.needsProfileCompletion ? <span className="text-sm text-slate-500">请先前往登录页设置昵称</span> : null}
        </div>
      </article>

      <section className="mt-8 space-y-4">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 card-shadow">
          <h2 className="text-xl font-semibold text-[#002147]">评论区</h2>
          <div className="mt-5 space-y-4">
            {post.comments.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">还没有评论，欢迎发表第一条看法。</div>
            ) : (
              post.comments.map((comment) => (
                <article key={comment.id} className="rounded-3xl bg-slate-50 px-5 py-4">
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                    <span>{comment.author.username ?? "待设置昵称"}</span>
                    <span>{new Date(comment.createdAt).toLocaleString("zh-CN")}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{comment.body}</p>
                </article>
              ))
            )}
          </div>
        </div>

        {session?.user && !session.user.needsProfileCompletion ? (
          <CommentForm postId={post.id} />
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 card-shadow">
            {session?.user ? "请先设置昵称后再评论。" : "登录后可参与评论。"}
          </div>
        )}
      </section>
    </main>
  );
}
