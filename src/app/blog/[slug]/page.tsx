import { getPostData, getSortedPostsData } from "@/lib/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = await getPostData(slug);
  return {
    title: `${postData.title} - Stanford Lean Club`,
    description: postData.description,
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-16 md:py-24 max-w-3xl">
      <header className="mb-12 space-y-4">
        <time dateTime={postData.date} className="text-sm text-stone-500 block">
          {postData.date}
        </time>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-stone-900 leading-tight">
          {postData.title}
        </h1>
        {postData.description && (
          <p className="text-xl text-stone-600 leading-relaxed mt-4">
            {postData.description}
          </p>
        )}
      </header>
      <div
        className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-stone-900 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }}
      />
    </article>
  );
}
