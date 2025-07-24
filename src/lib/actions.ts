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
        wikiArticle: (formData.get("wikiArticle") as string) || null,
      },
    });

    revalidatePath("/posts");

    // Server-side redirect with success parameter
    redirect("/posts?success=created");
  } catch (error) {
    // Check if it's a Next.js redirect error - if so, re-throw it
    if (error && typeof error === "object" && "digest" in error) {
      throw error; // Next.js handles the redirect
    }
    // Handle actual Prisma errors
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/posts?error=duplicate-title");
    }

    // Redirect with generic error
    redirect("/posts?error=failed");
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
