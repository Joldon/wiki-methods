"use server";

import prisma from "./db";

export const createPost = async (formData: FormData) => {
  const post = await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("title") as string)
        .replace(/\s+/g, "-")
        .toLowerCase(),
      content: formData.get("content") as string,
    },
  });
};

export const updatePost = async (formData: FormData, id: string) => {
  const post = await prisma.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("title") as string)
        .replace(/\s+/g, "-")
        .toLowerCase(),
      content: formData.get("content") as string,
    },
  });
};

export const deletePost = async (id: string) => {
  const post = await prisma.post.delete({
    where: { id },
  });
};
