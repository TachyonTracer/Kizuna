"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon_url?: string;
  category?: string | null;
  sort_order?: number | null;
  created_at: string;
}

type Notice = {
  message: string;
  type: "error" | "success";
};

const CATEGORY_ORDER = [
  "All",
  "Dev",
  "Docs",
  "Video",
  "Social",
  "News",
  "Shopping",
  "Reference",
  "Other",
] as const;

type BookmarkCategory = (typeof CATEGORY_ORDER)[number];

const CATEGORY_PATTERNS: Record<
  Exclude<BookmarkCategory, "All">,
  RegExp
> = {
  Dev: /(github|gitlab|bitbucket|stackoverflow|vercel|netlify|npmjs|medium\.com\/@|hashnode|dev\.to)/i,
  Docs: /(docs\.|readme|notion|confluence|wiki|developer\.mozilla|w3schools|mdn)/i,
  Video: /(youtube|youtu\.be|vimeo|twitch|dailymotion|netflix|primevideo)/i,
  Social: /(x\.com|twitter|instagram|facebook|linkedin|reddit|discord|threads\.net|tiktok)/i,
  News: /(news|times|post|herald|bbc|cnn|reuters|bloomberg|nytimes|thehindu)/i,
  Shopping: /(amazon|flipkart|ebay|etsy|shop|store|cart|aliexpress|walmart|target)/i,
  Reference: /(wikipedia|investopedia|dictionary|britannica|archive|scholar|arxiv|pubmed)/i,
  Other: /.^/,
};

const getAutoBookmarkCategory = (
  bookmark: Bookmark,
): Exclude<BookmarkCategory, "All"> => {
  const source = `${bookmark.title ?? ""} ${bookmark.url}`.toLowerCase();
  const orderedCategories = CATEGORY_ORDER.filter(
    (category): category is Exclude<BookmarkCategory, "All"> =>
      category !== "All" && category !== "Other",
  );

  for (const category of orderedCategories) {
    if (CATEGORY_PATTERNS[category].test(source)) return category;
  }

  return "Other";
};

const normalizeCustomCategory = (value?: string | null) =>
  value?.trim().replace(/\s+/g, " ");

const getBookmarkCategory = (bookmark: Bookmark): string => {
  const custom = normalizeCustomCategory(bookmark.category);
  return custom && custom.length > 0 ? custom : getAutoBookmarkCategory(bookmark);
};

const sortBookmarks = (items: Bookmark[]) =>
  [...items].sort((a, b) => {
    const aOrder = a.sort_order;
    const bOrder = b.sort_order;

    if (aOrder == null && bOrder == null) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (aOrder == null) return -1;
    if (bOrder == null) return 1;
    if (aOrder !== bOrder) return aOrder - bOrder;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingCategoryFor, setEditingCategoryFor] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [savingCategoryFor, setSavingCategoryFor] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedBookmarkId, setDraggedBookmarkId] = useState<string | null>(null);
  const [dragOverBookmarkId, setDragOverBookmarkId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Bookmark | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const MIN_SYNC_ANIMATION_MS = 900;

  const showNotice = (message: string, type: Notice["type"]) => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 3200);
  };

  const fetchBookmarks = async () => {
    const startedAt = Date.now();
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else {
        if (data) setBookmarks(sortBookmarks(data as Bookmark[]));
      }
    } finally {
      const elapsed = Date.now() - startedAt;
      const waitMs = Math.max(0, MIN_SYNC_ANIMATION_MS - elapsed);
      if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookmarks();
    }

    // Realtime subscription with filter
    const subscription = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`, // Filter specifically for this user
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => sortBookmarks([payload.new as Bookmark, ...prev]));
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              sortBookmarks(
                prev.map((b) =>
                  b.id === payload.new.id ? (payload.new as Bookmark) : b,
                ),
              ),
            )
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const requestDelete = (bookmark: Bookmark, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingDelete(bookmark);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    const id = pendingDelete.id;
    setIsDeleting(true);
    setPendingDelete(null);

    // Optimistic update
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    setIsDeleting(false);
    if (error) {
      console.error("Error deleting bookmark:", error);
      showNotice("Could not prune this memory.", "error");
      fetchBookmarks(); // Revert on error
      return;
    }

    showNotice("Memory pruned from archive.", "success");
  };

  const startCategoryEdit = (bookmark: Bookmark, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCategoryFor(bookmark.id);
    setCategoryDraft(normalizeCustomCategory(bookmark.category) ?? "");
  };

  const cancelCategoryEdit = () => {
    setEditingCategoryFor(null);
    setCategoryDraft("");
  };

  const saveCategory = async (bookmarkId: string) => {
    const normalized = normalizeCustomCategory(categoryDraft)?.slice(0, 32) ?? "";
    setSavingCategoryFor(bookmarkId);

    const { error } = await supabase
      .from("bookmarks")
      .update({ category: normalized || null })
      .eq("id", bookmarkId)
      .eq("user_id", userId);

    setSavingCategoryFor(null);

    if (error) {
      console.error("Error updating category:", error);
      showNotice("Could not update category.", "error");
      return;
    }

    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === bookmarkId
          ? { ...bookmark, category: normalized || null }
          : bookmark,
      ),
    );
    cancelCategoryEdit();
  };

  const persistSortOrder = async (orderedIds: string[]) => {
    setIsReordering(true);

    const updates = orderedIds.map((id, index) =>
      supabase
        .from("bookmarks")
        .update({ sort_order: index + 1 })
        .eq("id", id)
        .eq("user_id", userId),
    );

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    setIsReordering(false);

    if (failed?.error) {
      console.error("Error updating sort order:", failed.error);
      showNotice("Could not save card order.", "error");
      fetchBookmarks();
    }
  };

  const swapBookmarkPositions = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;

    const ordered = sortBookmarks(bookmarks);
    const from = ordered.findIndex((bookmark) => bookmark.id === draggedId);
    const to = ordered.findIndex((bookmark) => bookmark.id === targetId);
    if (from === -1 || to === -1) return;

    const swapped = [...ordered];
    [swapped[from], swapped[to]] = [swapped[to], swapped[from]];
    const reordered = swapped.map((bookmark, index) => ({
      ...bookmark,
      sort_order: index + 1,
    }));

    setBookmarks(reordered);
    persistSortOrder(reordered.map((bookmark) => bookmark.id));
  };

  const handleDragStart = (bookmarkId: string) => {
    setDraggedBookmarkId(bookmarkId);
    setDragOverBookmarkId(null);
  };

  const handleDrop = (targetId: string) => {
    if (isReordering) {
      setDraggedBookmarkId(null);
      setDragOverBookmarkId(null);
      return;
    }

    if (draggedBookmarkId) {
      swapBookmarkPositions(draggedBookmarkId, targetId);
    }
    setDraggedBookmarkId(null);
    setDragOverBookmarkId(null);
  };

  const orderedBookmarks = sortBookmarks(bookmarks);

  const categorized = orderedBookmarks.reduce<Record<string, Bookmark[]>>(
    (acc, bookmark) => {
      const category = getBookmarkCategory(bookmark);
      if (!acc[category]) acc[category] = [];
      acc[category].push(bookmark);
      return acc;
    },
    {},
  );

  const detectedCategories = Object.keys(categorized);
  const orderedCategories = [
    ...CATEGORY_ORDER.filter(
      (category) => category !== "All" && categorized[category]?.length > 0,
    ),
    ...detectedCategories
      .filter((category) => !CATEGORY_ORDER.includes(category as BookmarkCategory))
      .sort((a, b) => a.localeCompare(b)),
  ];

  useEffect(() => {
    if (activeCategory !== "All" && !categorized[activeCategory]?.length) {
      setActiveCategory("All");
    }
  }, [activeCategory, bookmarks, categorized]);

  const visibleCategories =
    activeCategory === "All"
      ? orderedCategories
      : [activeCategory];

  return (
    <>
      <div className="md:col-span-full flex justify-end px-2 -mb-4 z-10">
        <button
          onClick={() => fetchBookmarks()}
          className={`group inline-flex min-w-[96px] justify-center items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] font-zen leading-none transition-colors ${
            isRefreshing
              ? "cursor-wait border-[#B33030]/40 bg-[#FFF3EE] text-[#B33030]"
              : "border-stone-300 bg-[#FFFCF7] text-stone-500 hover:border-[#B33030]/60 hover:text-[#B33030]"
          }`}
        >
          <span
            className={`inline-flex h-3.5 w-3.5 items-center justify-center shrink-0 ${
              isRefreshing ? "sync-breathe opacity-90" : "group-hover:opacity-80"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                d="M20 12a8 8 0 1 1-2.34-5.66"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M20 4v4h-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="leading-none">{isRefreshing ? "Syncing" : "Sync"}</span>
          {isRefreshing && (
            <span className="inline-flex items-center gap-0.5">
              <span className="sync-dot h-1 w-1 rounded-full bg-current"></span>
              <span className="sync-dot sync-dot-2 h-1 w-1 rounded-full bg-current"></span>
              <span className="sync-dot sync-dot-3 h-1 w-1 rounded-full bg-current"></span>
            </span>
          )}
        </button>
      </div>

      {bookmarks.length > 0 && (
        <div className="md:col-span-full flex flex-wrap gap-2 pt-6 pb-1">
          {["All", ...orderedCategories].map((category) => {
            const count = category === "All" ? bookmarks.length : categorized[category]?.length ?? 0;
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-[10px] font-zen tracking-[0.16em] uppercase border rounded-sm transition-colors ${
                  isActive
                    ? "bg-[#B33030] text-[#FFF9F2] border-[#B33030]"
                    : "bg-[#FDF8F1] text-stone-500 border-stone-300 hover:border-[#B33030] hover:text-[#B33030]"
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      )}

      {bookmarks.length === 0 && (
        <div className="col-span-1 md:col-span-2 text-center text-stone-400 font-jp-serif py-12 flex flex-col items-center gap-2 opacity-60">
          <span className="material-symbols-outlined text-4xl">eco</span>
          <span>The garden is empty. Sowing new seeds...</span>
        </div>
      )}
      {visibleCategories.map((category) => (
        <div key={category} className="md:col-span-full">
          <div className="flex items-center gap-3 mt-4 mb-3 px-1">
            <span className="font-zen text-xs uppercase tracking-[0.2em] text-seal-red">
              {category}
            </span>
            <span className="h-px flex-1 bg-stone-300/70"></span>
            <span className="font-jp-serif text-[10px] text-stone-500 uppercase tracking-wider">
              {categorized[category]?.length ?? 0} entries
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {(categorized[category] ?? []).map((bookmark) => (
              <div
                key={bookmark.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverBookmarkId !== bookmark.id) {
                    setDragOverBookmarkId(bookmark.id);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(bookmark.id);
                }}
                onDragLeave={() => {
                  if (dragOverBookmarkId === bookmark.id) {
                    setDragOverBookmarkId(null);
                  }
                }}
                className={`tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group shadow-sm hover:shadow-md transition-all relative ${
                  dragOverBookmarkId === bookmark.id
                    ? "ring-2 ring-[#B33030]/40"
                    : ""
                }`}
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

                  <div className="flex items-center gap-1.5">
                    <span
                      draggable={!isReordering}
                      onDragStart={() => handleDragStart(bookmark.id)}
                      onDragEnd={() => {
                        setDraggedBookmarkId(null);
                        setDragOverBookmarkId(null);
                      }}
                      className={`material-symbols-outlined text-base transition-colors ${
                        isReordering
                          ? "text-stone-300/40 cursor-not-allowed"
                          : "text-stone-300 hover:text-seal-red cursor-grab active:cursor-grabbing"
                      }`}
                      title="Drag to swap position"
                    >
                      {isReordering ? "sync" : "drag_indicator"}
                    </span>
                    <button
                      onClick={(e) => requestDelete(bookmark, e)}
                      className="sakura-btn material-symbols-outlined text-xl text-stone-300 hover:text-seal-red transition-colors z-20"
                      title="Prune (Delete) Entry"
                    >
                      local_florist
                    </button>
                  </div>
                </div>

                <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug group-hover:text-seal-red transition-colors line-clamp-2">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-2"
                  >
                    <span className="inline-block">{bookmark.title}</span>
                  </a>
                </h3>

                <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 pr-28 border-t border-stone-200 border-dashed">
                  <div className="flex items-center min-w-0">
                    {bookmark.icon_url ? (
                      <img
                        src={bookmark.icon_url}
                        alt=""
                        className="w-4 h-4 rounded-sm mr-2 shrink-0 opacity-80"
                      />
                    ) : (
                      <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
                    )}
                    <span className="italic tracking-wide truncate">
                      {new URL(bookmark.url).hostname}
                    </span>
                  </div>
                </div>

                <div className="absolute right-5 bottom-5 group">
                  <button
                    onClick={(e) => startCategoryEdit(bookmark, e)}
                    className="h-7 w-7 flex items-center justify-center border rounded-sm border-stone-300 hover:border-[#B33030] text-stone-500 hover:text-[#B33030] transition-colors bg-[#FFFCF7]/90"
                    title="Change category"
                    aria-label="Change category"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      sell
                    </span>
                  </button>
                  <span className="pointer-events-none absolute right-0 bottom-8 mb-1 whitespace-nowrap rounded-sm border border-stone-300 bg-[#FFFCF7] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-stone-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    {normalizeCustomCategory(bookmark.category) ?? "Set Category"}
                  </span>
                </div>

                {editingCategoryFor === bookmark.id && (
                  <div className="absolute right-5 bottom-14 bg-[#FFFCF7] border border-stone-300 rounded-sm shadow-md p-2 z-30 w-44">
                    <input
                      type="text"
                      value={categoryDraft}
                      onChange={(e) => setCategoryDraft(e.target.value)}
                      placeholder="Category name"
                      maxLength={32}
                      className="w-full bg-transparent border-b border-stone-300 focus:border-seal-red outline-none text-[10px] font-jp-serif py-1 mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelCategoryEdit}
                        className="text-[9px] uppercase tracking-[0.1em] text-stone-500 hover:text-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveCategory(bookmark.id)}
                        disabled={savingCategoryFor === bookmark.id}
                        className="text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm border border-[#B33030] text-[#B33030] hover:bg-[#F8EEE4] disabled:opacity-50"
                      >
                        {savingCategoryFor === bookmark.id ? "Saving" : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {pendingDelete &&
        isMounted &&
        createPortal(
          <div className="fixed inset-0 z-[140] bg-[#1A1614]/75 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#FFFCF7] border border-stone-300 shadow-xl rounded-sm p-5">
              <h3 className="font-zen text-sm tracking-wider text-ink-black uppercase">
                Prune Memory
              </h3>
              <p className="mt-2 text-sm font-jp-serif text-stone-600 leading-relaxed">
                Remove{" "}
                <span className="text-seal-red font-semibold">
                  {pendingDelete.title || "this memory"}
                </span>{" "}
                from your archive?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] border border-stone-300 text-stone-600 hover:border-stone-400 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] border border-[#B33030] text-[#B33030] hover:bg-[#F8EEE4] rounded-sm disabled:opacity-50"
                >
                  {isDeleting ? "Pruning..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {notice && (
        <div
          className={`fixed right-6 bottom-6 z-[85] px-4 py-2 rounded-sm border shadow-md text-[11px] font-jp-serif ${
            notice.type === "error"
              ? "bg-[#1F1B1A] text-[#FFF9F2] border-[#B33030]"
              : "bg-[#FDF8F1] text-[#2B2825] border-stone-300"
          }`}
        >
          {notice.message}
        </div>
      )}
    </>
  );
}
