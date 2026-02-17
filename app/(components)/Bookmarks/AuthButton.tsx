"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Initialize client explicitly or use a context/hook if preferred
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
          <span className="text-xs font-jp-serif text-ink-black/60 tracking-wider">
            {user.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 border border-seal-red text-seal-red text-xs font-zen tracking-widest hover:bg-seal-red hover:text-white transition-all uppercase rounded-sm"
        >
          Sign Out of Archive
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="hanko-seal group px-8 py-3 flex items-center gap-3 cursor-pointer"
    >
      <div className="bg-white p-1 rounded-full shadow-sm border border-stone-100">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          ></path>
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.67l-3.57-2.77c-1.01.69-2.28 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          ></path>
          <path
            d="M5.84 14.13c-.22-.66-.35-1.36-.35-2.13s.13-1.47.35-2.13V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.83z"
            fill="#FBBC05"
          ></path>
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          ></path>
        </svg>
      </div>
      <span className="font-zen font-bold text-base tracking-widest text-seal-red">
        GOOGLE OAUTH
      </span>
    </button>
  );
}
