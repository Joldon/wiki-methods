"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "./db";
import { Post } from "@prisma/client";

export const createPost = async (formData: FormData) => {
  try {
    const post: Post = await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string)
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase(),
        content: formData.get("content") as string,
        // This line to save the wikiArticle field
        wikiArticle: (formData.get("wikiArticle") as string) || null,
      },
    });
    revalidatePath("/posts");
    redirect("/posts");
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/posts?error=duplicate-title");
    }
    throw error;
  }
};

export const updatePost = async (formData: FormData, id: string) => {
  const post: Post = await prisma.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("title") as string)
        .replace(/\s+/g, "-")
        .toLowerCase(),
      content: formData.get("content") as string,
      wikiArticle: (formData.get("wikiArticle") as string) || undefined,
    },
  });
};

export const deletePost = async (id: string) => {
  try {
    const post = await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/posts");
    redirect("/posts");
  } catch (error) {
    throw error;
  }
};
