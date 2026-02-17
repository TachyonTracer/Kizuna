"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AddBookmarkForm({ userId }: { userId: string }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    setLoading(true);
    const { error } = await supabase.from("bookmarks").insert([
      {
        user_id: userId,
        url,
        title,
      },
    ]);
    setLoading(false);

    if (error) {
      alert("Error adding bookmark: " + error.message);
    } else {
      setUrl("");
      setTitle("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full justify-between p-5"
    >
      <div className="flex items-center gap-2 mb-2 opacity-50">
        <span className="material-symbols-outlined text-xl text-stone-400">
          add_circle
        </span>
        <span className="font-zen text-xs tracking-widest text-stone-500 uppercase">
          New Memory
        </span>
      </div>

      <div className="flex flex-col gap-3 my-auto">
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-b border-stone-300 focus:border-seal-red outline-none text-sm font-zen placeholder:text-stone-300"
          required
        />
        <input
          type="url"
          placeholder="URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-transparent border-b border-stone-300 focus:border-seal-red outline-none text-xs font-jp-serif placeholder:text-stone-300"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-indigo-dye text-white/90 hover:bg-seal-red text-xs py-2 rounded-sm transition-colors font-zen tracking-widest uppercase flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="animate-pulse">Saving...</span>
        ) : (
          <>
            <span>Archive</span>
          </>
        )}
      </button>
    </form>
  );
}
