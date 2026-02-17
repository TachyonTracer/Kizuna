import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KizunaArchive/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $("title").text() ||
      $('meta[property="og:title"]').attr("content") ||
      targetUrl;

    // Simple icon extraction logic (can be improved)
    let icon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    // Resolve relative URLs for icon
    if (icon && !icon.startsWith("http")) {
      const urlObj = new URL(targetUrl);
      icon = new URL(icon, urlObj.origin).href;
    }

    // Fallback to Google Favicon service if not found
    if (!icon) {
      const urlObj = new URL(targetUrl);
      icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    }

    return NextResponse.json({ title, icon });
  } catch (error) {
    console.error("Metadata fetch error:", error);
    // Fallback on error
    return NextResponse.json({
      title: targetUrl,
      icon: null,
    });
  }
}
