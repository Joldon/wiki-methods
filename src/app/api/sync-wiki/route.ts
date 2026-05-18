// PURPOSE: Route Handler for cron/external trigger of wiki sync.
//          Secured with CRON_SECRET environment variable.

import { NextResponse, NextRequest } from "next/server";
import { syncWiki } from "@/lib/wikiSync";

// Auth helper
const isAuthorized = (request: NextRequest): boolean => {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false; // No secret set, deny all requests
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
};

const missingSecretResponse = () =>
  NextResponse.json({ error: "Server configuration error" }, { status: 500 });

const unauthorizedResponse = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// POST /api/sync-wiki
/**
 * Triggers incremental sync of wiki articles to database.
 * Protected by CRON_SECRET — used for manual curl triggers and testing.
 *
 * Usage:
 *   curl -X POST https://your-app.vercel.app/api/sync-wiki \
 *     -H "Authorization: Bearer YOUR_CRON_SECRET"
 */

export async function POST(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    console.error("[sync-wiki] CRON_SECRET environment variable not set");
    return missingSecretResponse();
  }
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  // Added local timing since syncWiki does not return a duration field.
  const startedAt = Date.now();

  try {
    console.log("[sync-wiki] Starting wiki sync...");
    // syncWiki returns { synced, skipped, errors } — no `success`
    // or `duration` field. Both are derived locally below.
    const result = await syncWiki();

    const duration = Date.now() - startedAt;
    // Success is true when no errors were encountered.
    const success = result.errors.length === 0;

    console.log(
      `[sync-wiki] Complete: ${result.synced} synced, ${result.skipped} skipped, ` +
        `${result.errors.length} errors, ${duration}ms`,
    );

    return NextResponse.json(
      { ...result, success, duration },
      // 207 Multi-Status when sync completed but some pages had errors.
      { status: success ? 200 : 207 },
    );
  } catch (error) {
    console.error("[sync-wiki] Fatal error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// GET /api/sync-wiki
/**
 * Vercel Cron uses GET requests. Same auth and sync logic as POST.
 *
 * vercel.json configuration:
 * {
 *   "crons": [{
 *     "path": "/api/sync-wiki",
 *     "schedule": "0 3 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return missingSecretResponse();
  }

  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const startedAt = Date.now();

  try {
    const result = await syncWiki();
    const duration = Date.now() - startedAt;
    const success = result.errors.length === 0;

    return NextResponse.json(
      { ...result, success, duration },
      { status: success ? 200 : 207 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
