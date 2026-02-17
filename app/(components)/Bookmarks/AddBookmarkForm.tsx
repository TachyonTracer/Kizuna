"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type AddBookmarkFormProps = {
  userId: string;
  onToast: (message: string, type: "success" | "error") => void;
};

export default function AddBookmarkForm({ userId, onToast }: AddBookmarkFormProps) {
  const [urlInput, setUrlInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);

  const validateUrl = (str: string) => {
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
    try {
      const url = new URL(str);
      return domainRegex.test(url.hostname);
    } catch {
      return domainRegex.test(str);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    let targetUrl = urlInput.trim();

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    // STRICT VALIDATION
    if (!validateUrl(targetUrl)) {
      console.warn("Validation failed for URL:", targetUrl);
      onToast(
        "This seed cannot take root. A valid domain is required.",
        "error",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/metadata?url=${encodeURIComponent(targetUrl)}`,
      );
      const data = await res.json();

      const title = data.title || targetUrl;
      const icon_url = data.icon;
      const customCategory = categoryInput.trim().replace(/\s+/g, " ").slice(0, 32);
      const basePayload = {
        user_id: userId,
        url: targetUrl,
        title,
        icon_url,
      };

      let insertError: { message?: string } | null = null;
      if (customCategory) {
        const { error } = await supabase
          .from("bookmarks")
          .insert([{ ...basePayload, category: customCategory }]);

        if (error?.message?.toLowerCase().includes("category")) {
          const fallback = await supabase.from("bookmarks").insert([basePayload]);
          insertError = fallback.error;
        } else {
          insertError = error;
        }
      } else {
        const { error } = await supabase.from("bookmarks").insert([basePayload]);
        insertError = error;
      }

      if (insertError) throw insertError;

      setUrlInput("");
      setCategoryInput("");
      onToast("A new thread has been woven into the archive.", "success");
    } catch (error: any) {
      onToast(" The connection was severed: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
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
            placeholder="Paste Link (e.g. google.com)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-transparent border-b border-stone-300 focus:border-seal-red outline-none text-xs font-jp-serif placeholder:text-stone-300 py-1"
            required
          />
          <input
            type="text"
            list="bookmark-categories"
            placeholder="Custom Category (optional)"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className="w-full bg-transparent border-b border-stone-200 focus:border-seal-red outline-none text-[11px] font-jp-serif placeholder:text-stone-300 py-1"
            maxLength={32}
          />
          <datalist id="bookmark-categories">
            <option value="Work" />
            <option value="Learning" />
            <option value="Research" />
            <option value="Tools" />
            <option value="Inspiration" />
            <option value="Entertainment" />
          </datalist>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-sm border border-[#B33030] bg-[#FDF8F1] text-[#B33030] hover:bg-[#F8EEE4] hover:border-[#9E2F2F] disabled:bg-[#FDF8F1]/70 disabled:text-[#B33030]/60 disabled:border-[#B33030]/50 disabled:cursor-not-allowed transition-all duration-200 font-zen tracking-[0.18em] uppercase flex items-center justify-center gap-2 text-[11px] shadow-[0_1px_4px_rgba(43,40,37,0.08)] hover:shadow-[0_3px_10px_rgba(179,48,48,0.18)]"
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[17px]">
                bookmark_add
              </span>
              <span>ADD TO Hozon (保存)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
