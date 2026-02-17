"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import BookmarkList from "./BookmarkList";
import AddBookmarkForm from "./AddBookmarkForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const demoBookmarks = [
  {
    id: "demo-1",
    stamp: "OCT 14 • 10:23 AM",
    title: "The Library of Babel Analysis",
    host: "borges.library.edu/archive",
  },
  {
    id: "demo-2",
    stamp: "OCT 16 • 02:45 PM",
    title: "Digital Manuscript Conservation",
    host: "manuscripts.io/tech-spec",
  },
  {
    id: "demo-3",
    stamp: "OCT 17 • 09:12 AM",
    title: "Principles of Information Flow",
    host: "academic-ledger.net/flow",
  },
  {
    id: "demo-4",
    stamp: "OCT 18 • 04:55 PM",
    title: "Semantic Web Ontologies",
    host: "w3.org/standards/semantic",
  },
];

export default function BookmarkManager() {
  const [user, setUser] = useState<any>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex-1 p-6 md:p-10 bg-[#FAF8F2]/50">
        <div className="mb-4 flex items-center gap-2 opacity-70">
          <span className="material-symbols-outlined text-sm text-stone-500">
            visibility
          </span>
          <span className="font-zen text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Preview Mode • Sample Archive
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {demoBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 opacity-70">
                  <span className="material-symbols-outlined text-sm text-stone-500">
                    schedule
                  </span>
                  <span className="font-jp-serif text-[10px] text-stone-500 tracking-wider uppercase">
                    {bookmark.stamp}
                  </span>
                </div>
                <span className="sakura-btn material-symbols-outlined text-xl">
                  local_florist
                </span>
              </div>

              <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug">
                {bookmark.title}
              </h3>

              <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 border-t border-stone-200 border-dashed">
                <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
                <span className="italic tracking-wide truncate">
                  {bookmark.host}
                </span>
              </div>
            </div>
          ))}

          <div className="border border-stone-300 border-dashed p-4 min-h-[160px] flex items-center justify-center opacity-30 rounded-sm bg-[#FFFCF7]">
            <span className="material-symbols-outlined text-3xl text-stone-400">
              add
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#FAF8F2]/50 relative overflow-visible">
      {toast && (
        <div
          className={`absolute top-3 right-4 md:right-10 w-[min(420px,calc(100%-2rem))] md:w-[360px] rounded-sm border shadow-md backdrop-blur-sm transition-all z-50 animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-[#F7F2E8]/95 border-[#D7C7B2] text-[#2B2825]"
              : "bg-[#1F1B1A]/95 border-[#B33030] text-[#FAF8F2]"
          }`}
        >
          <div
            className={`h-0.5 w-full ${
              toast.type === "success" ? "bg-[#B8A78F]/70" : "bg-[#B33030]"
            }`}
          />
          <div className="flex items-center gap-3 px-3 py-2.5">
            <span
              className={`material-symbols-outlined text-base ${
                toast.type === "success" ? "text-[#8A7760]" : "text-[#E07366]"
              }`}
            >
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-jp-serif text-[12px] leading-snug">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {/* Add New Card */}
        <div className="tanzaku-card p-0 flex flex-col min-h-[160px] group border border-stone-300 border-dashed rounded-sm bg-white/30 hover:bg-white/60 transition-colors relative overflow-hidden">
          <AddBookmarkForm userId={user.id} onToast={showToast} />
        </div>

        {/* List */}
        <BookmarkList userId={user.id} />
      </div>
    </div>
  );
}
