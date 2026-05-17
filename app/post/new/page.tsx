import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getCategories } from "@/lib/services/category-service";
import { CreatePostForm } from "@/components/posts/create-post-form";
import { SiteHeader } from "@/components/layout/site-header";

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
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <Link href="/" className="btn-ghost text-sm !px-3 !py-2 inline-flex items-center gap-1.5 mb-6">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div>
            <p className="text-sm font-medium text-[#CC8800]">欢迎发帖</p>
            <h1 className="mt-2 text-3xl font-bold text-[#002147]">发布新帖子</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              选择一个版块，写一个清晰的标题，剩下的内容尽情发挥吧。
            </p>
          </div>
        </div>

        <CreatePostForm categories={categories} />
      </main>
    </>
  );
}
