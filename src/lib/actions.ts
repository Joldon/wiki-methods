"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import prisma from "./db";
// MethodArticle: Prisma-generated model type — needed as the explicit
// return type of getFilteredMethodsAction.
import type { Post, MethodArticle } from "../../prisma/generated/prisma/client";
// syncWiki: triggers incremental DB sync from wikiSync service.
// getFilteredMethods: queries DB with type-safe Prisma filter.
// MethodFilters: the exported filter type from wikiSync — needed as the
//       parameter type for getFilteredMethodsAction.
import { syncWiki, getFilteredMethods, type MethodFilters } from "./wikiSync";

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
        `/wiki/${encodeURIComponent(wikiArticle)}?success=feedback-created`,
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
          `/wiki/${encodeURIComponent(wikiArticle)}?error=duplicate-title`,
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
  const post = await prisma.post.delete({
    where: { id },
  });
  revalidatePath("/posts");
  redirect("/posts");
};

// syncWikiMethods
/**
 * Server Action: Triggers wiki sync from admin UI.
 * Can be called from a button in an admin panel.
 * * Wraps syncWiki() and revalidates all paths that render MethodArticle data.
 */
export const syncWikiMethods = async (): Promise<{
  synced: number;
  skipped: number;
  errors: string[];
  success: boolean;
  duration: number;
}> => {
  const startedAt = Date.now();
  const result = await syncWiki();
  const duration = Date.now() - startedAt;
  const success = result.errors.length === 0;

  // use the "layout" scope on "/wiki" to revalidate all nested routes,
  // and revalidate "/methods" where the MethodBrowser lives.
  revalidatePath("/methods");
  revalidatePath("/wiki", "layout");

  return { ...result, success, duration };
};

// ---- getFilteredMethodsAction ----
/**
 * Server Action: returns MethodArticle rows matching the given filter criteria.
 * Called by MethodBrowserClient to query the DB instead of the MediaWiki API.
 */

export const getFilteredMethodsAction = async (
  filters: MethodFilters,
): Promise<MethodArticle[]> => {
  return getFilteredMethods(filters);
};
