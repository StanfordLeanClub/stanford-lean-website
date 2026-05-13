import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog - Stanford Lean Club",
  description: "Latest updates and research from the Stanford Lean Club.",
};

export default function Blog() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-stone-900 mb-12">
        Blog
      </h1>
      <div className="space-y-12">
        {allPostsData.length > 0 ? (
          allPostsData.map(({ id, date, title, description }) => (
            <Link key={id} href={`/blog/${id}`} className="group block">
              <article className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <time dateTime={date}>{date}</time>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors">
                  {title}
                </h2>
                <p className="text-stone-600 leading-relaxed">
                  {description}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 group-hover:underline decoration-stone-400 underline-offset-4 transition-all">
                  Read more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            </Link>
          ))
        ) : (
          <p className="text-stone-500 italic">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
