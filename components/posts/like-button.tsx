"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (disabled || loading) {
      return;
    }

    setLoading(true);

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: likedByViewer ? "DELETE" : "POST",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        likedByViewer ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
    >
      <Heart className={`h-4 w-4 ${likedByViewer ? "fill-current" : ""}`} />
      {loading ? "处理中..." : `点赞 ${likeCount}`}
    </button>
  );
}
