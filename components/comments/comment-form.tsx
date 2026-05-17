"use client";

import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type CommentFormProps = {
  postId: string;
};

type PendingComment = {
  id: string;
  body: string;
  tempId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const commentBody = body.trim();
    if (!commentBody) return;

    // 立即清空表单 + 显示本地评论
    setBody("");
    setError("");
    setSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    setPendingComments((prev) => [{ id: tempId, body: commentBody, tempId }, ...prev]);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body: commentBody }),
      });
      const data = await response.json();

      if (!response.ok) {
        // 失败：移除本地评论 + 回填表单
        setPendingComments((prev) => prev.filter((c) => c.tempId !== tempId));
        setBody(commentBody);
        throw new Error(data.message);
      }

      // 成功：替换临时评论为真实评论，后台同步
      setPendingComments((prev) =>
        prev.map((c) => (c.tempId === tempId ? { ...c, id: data.id, tempId: "" } : c)),
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发表评论失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* 乐观显示的待处理评论 */}
      {pendingComments.map((comment) => (
        <article
          key={comment.tempId || comment.id}
          className="card-elevation !rounded-2xl bg-emerald-50/60 px-5 py-4 transition"
        >
          <div className="flex items-center gap-2.5 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {comment.tempId ? (
              <span className="text-emerald-700">评论已提交</span>
            ) : (
              <span className="text-emerald-700">评论发表成功</span>
            )}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{comment.body}</p>
        </article>
      ))}

      <form ref={formRef} onSubmit={handleSubmit} className="card-elevation !rounded-[28px] p-6 sm:p-8">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#002147]">
          <Send className="h-4 w-4" />
          发表评论
        </h3>

        {error ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        ) : null}

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          placeholder="分享你的想法、经验或建议..."
          className="input-ring mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 placeholder:text-slate-400"
          required
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            {body.length > 0 ? `${body.length} / 1000` : "支持友善、有建设性的讨论"}
          </span>
          <button
            disabled={submitting || body.trim().length === 0}
            className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                发布评论
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
