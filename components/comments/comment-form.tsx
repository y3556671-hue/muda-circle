"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, AlertCircle } from "lucide-react";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发表评论失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-elevation !rounded-[28px] p-6 sm:p-8">
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
          disabled={loading}
          className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2"
        >
          {loading ? (
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
  );
}
