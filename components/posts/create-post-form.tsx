"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, AlertCircle, Tag, Type, FileText } from "lucide-react";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export function CreatePostForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, categorySlug }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      router.push(`/post/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发帖失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="card-elevation !rounded-[28px] overflow-hidden">
        {/* Category */}
        <div className="border-b border-slate-50 px-6 py-5 sm:px-8">
          <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Tag className="h-4 w-4 text-slate-400" />
            选择版块
          </label>
          <select
            value={categorySlug}
            onChange={(event) => setCategorySlug(event.target.value)}
            className="input-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            required
          >
            <option value="">请选择版块</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="border-b border-slate-50 px-6 py-5 sm:px-8">
          <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Type className="h-4 w-4 text-slate-400" />
            标题
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            placeholder="例如：COMP90054 期中复习资料求推荐"
            className="input-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400"
            required
          />
        </div>

        {/* Body */}
        <div className="px-6 py-5 sm:px-8">
          <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4 text-slate-400" />
            正文
          </label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={12}
            placeholder="写下你想分享或求助的内容..."
            className="input-ring w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 placeholder:text-slate-400"
            required
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>发帖提示：请使用清晰标题，交易和租房信息建议注明时间、地点和联系方式。</span>
      </div>

      <button
        disabled={loading}
        className="btn-primary w-full !py-3.5 inline-flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            发布中...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            发布帖子
          </>
        )}
      </button>
    </form>
  );
}
