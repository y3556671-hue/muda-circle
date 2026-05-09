"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

      if (!response.ok) {
        throw new Error(data.message);
      }

      router.push(`/post/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发帖失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 card-shadow">
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">选择版块</label>
        <select
          value={categorySlug}
          onChange={(event) => setCategorySlug(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#002147]"
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

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">标题</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          type="text"
          placeholder="例如：COMP90054 期中复习资料求推荐"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#002147]"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">正文</label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          placeholder="写下你想分享或求助的内容..."
          className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#002147]"
          required
        />
      </div>

      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
        发帖提示：请尽量使用清晰标题，交易和租房信息建议注明时间、地点和联系方式。
      </div>

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-[#002147] px-4 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "发布中..." : "发布帖子"}
      </button>
    </form>
  );
}
