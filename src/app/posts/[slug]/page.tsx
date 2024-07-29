import prisma from "@/lib/db";

interface Params {
  slug: string;
}

const Post = async ({ params }: { params: Params }) => {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </div>
  );
};

export default Post;
