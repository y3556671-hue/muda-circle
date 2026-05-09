"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

      if (!response.ok) {
        throw new Error(data.message);
      }

      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发表评论失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 card-shadow">
      <h3 className="text-lg font-semibold text-[#002147]">发表评论</h3>
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        placeholder="分享你的想法、经验或建议..."
        className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#002147]"
        required
      />
      <button
        disabled={loading}
        className="rounded-2xl bg-[#002147] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "提交中..." : "发布评论"}
      </button>
    </form>
  );
}
