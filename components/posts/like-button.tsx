"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function LikeButton({
  postId,
  likedByViewer,
  likeCount,
  disabled,
}: {
  postId: string;
  likedByViewer: boolean;
  likeCount: number;
  disabled: boolean;
}) {
  const [optimisticLiked, setOptimisticLiked] = useState(likedByViewer);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);
  const [pending, setPending] = useState(false);

  // 同步服务端初始值
  if (!pending) {
    const actualLiked = likedByViewer;
    const actualCount = likeCount;
    if (actualLiked !== optimisticLiked || actualCount !== optimisticCount) {
      setOptimisticLiked(actualLiked);
      setOptimisticCount(actualCount);
    }
  }

  async function handleToggle() {
    if (disabled || pending) return;

    const nextLiked = !optimisticLiked;
    const nextCount = optimisticCount + (nextLiked ? 1 : -1);

    // 立即更新 UI
    setOptimisticLiked(nextLiked);
    setOptimisticCount(nextCount);
    setPending(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: nextLiked ? "POST" : "DELETE",
      });

      if (!response.ok) {
        // 失败则回滚
        setOptimisticLiked(!nextLiked);
        setOptimisticCount(optimisticCount);
      }
    } catch {
      setOptimisticLiked(!nextLiked);
      setOptimisticCount(optimisticCount);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
        optimisticLiked
          ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200/60 hover:bg-rose-100"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
      } disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-0`}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-200 ${
          optimisticLiked ? "fill-rose-500 stroke-rose-500 scale-110" : ""
        }`}
      />
      点赞 {optimisticCount}
    </button>
  );
}
