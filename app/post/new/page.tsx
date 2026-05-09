import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCategories } from "@/lib/services/category-service";
import { CreatePostForm } from "@/components/posts/create-post-form";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.needsProfileCompletion) {
    redirect("/login");
  }

  const categories = await getCategories();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#CC8800]">欢迎发帖</p>
          <h1 className="mt-2 text-3xl font-bold text-[#002147]">发布新帖子</h1>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          返回首页
        </Link>
      </div>

      <CreatePostForm categories={categories} />
    </main>
  );
}
