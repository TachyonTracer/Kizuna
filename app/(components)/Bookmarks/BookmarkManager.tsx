"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import BookmarkList from "./BookmarkList";
import AddBookmarkForm from "./AddBookmarkForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function BookmarkManager() {
  const [user, setUser] = useState<any>(null);

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
      <div className="flex-1 p-6 md:p-10 bg-[#FAF8F2]/50 flex items-center justify-center min-h-[400px]">
        <div className="text-center opacity-50">
          <span className="material-symbols-outlined text-4xl text-stone-300 mb-2">
            lock
          </span>
          <p className="font-jp-serif text-sm text-stone-400 tracking-wider">
            Authenticate to access memory archive.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#FAF8F2]/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {/* Add New Card */}
        <div className="tanzaku-card p-0 flex flex-col min-h-[160px] group border border-stone-300 border-dashed rounded-sm bg-white/30 hover:bg-white/60 transition-colors relative overflow-hidden">
          <AddBookmarkForm userId={user.id} />
        </div>

        {/* List */}
        <BookmarkList userId={user.id} />
      </div>
    </div>
  );
}
