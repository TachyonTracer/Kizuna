"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) setBookmarks(data);
    };

    fetchBookmarks();

    // Realtime subscription
    const subscription = supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Handle different events
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? (payload.new as Bookmark) : b,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <>
      {bookmarks.length === 0 && (
        <div className="col-span-1 md:col-span-2 text-center text-stone-400 font-jp-serif py-12 flex flex-col items-center gap-2 opacity-60">
          <span className="material-symbols-outlined text-4xl">eco</span>
          <span>The garden is empty. Sowing new seeds...</span>
        </div>
      )}
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group bg-white shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 opacity-70">
              <span className="material-symbols-outlined text-sm text-stone-500">
                schedule
              </span>
              <span className="font-jp-serif text-[10px] text-stone-500 tracking-wider uppercase">
                {new Date(bookmark.created_at).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="sakura-btn material-symbols-outlined text-xl text-stone-300 hover:text-seal-red transition-colors"
              title="Remove Entry"
            >
              local_florist
            </button>
          </div>
          <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug group-hover:text-seal-red transition-colors line-clamp-2">
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>
          </h3>
          <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 border-t border-stone-200 border-dashed">
            <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
            <span className="italic tracking-wide truncate">
              {new URL(bookmark.url).hostname}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
