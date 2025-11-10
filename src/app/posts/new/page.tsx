import PostForm from "@/components/form/postForm";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ wiki?: string }>;
}) {
  const params = await searchParams;
  const wikiArticle = params?.wiki;

  // After submit/cancel, redirect to the relevant wiki page
  // This logic will be handled in the client component (PostForm)

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <PostForm wikiArticle={wikiArticle} />
    </div>
  );
}
