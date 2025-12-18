"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import prisma from "./db";
import type { Post } from "../../prisma/generated/prisma/client";

export const createPost = async (formData: FormData) => {
  try {
    const wikiArticle = formData.get("wikiArticle") as string | null;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // generate base slug
    let slug = title
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    // check if slug already exists and append timestamp if it does
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      // append timestamp to make slug unique
      slug = `${slug}-${Date.now()}`;
    }

    const post: Post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        wikiArticle: wikiArticle || null,
      },
    });

    revalidatePath("/posts");

    // Redirect to relevant wiki page if wikiArticle is present
    if (wikiArticle) {
      redirect(
        `/wiki/${encodeURIComponent(wikiArticle)}?success=feedback-created`
      );
    } else {
      redirect("/posts?success=created");
    }
  } catch (error) {
    // Check if it's a Next.js redirect error - if so, re-throw it
    if (error && typeof error === "object" && "digest" in error) {
      throw error; // Next.js handles the redirect
    }
    // Handle actual Prisma errors
    if (
      error instanceof PrismaClientKnownRequestError &&
      (error as PrismaClientKnownRequestError).code === "P2002"
    ) {
      const wikiArticle = formData.get("wikiArticle") as string | null;
      if (wikiArticle) {
        redirect(
          `/wiki/${encodeURIComponent(wikiArticle)}?error=duplicate-title`
        );
      } else {
        redirect("/posts?error=duplicate-title");
      }
    }

    // Redirect with generic error
    const wikiArticle = formData.get("wikiArticle") as string | null;
    if (wikiArticle) {
      redirect(`/wiki/${encodeURIComponent(wikiArticle)}?error=failed`);
    } else {
      redirect("/posts?error=failed");
    }
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
