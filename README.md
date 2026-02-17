# Kizuna - Smart Bookmark App

A real-time bookmark manager built with Next.js App Router and Supabase.

## Requirements Coverage
1. Google OAuth only login: implemented with Supabase Google provider (`components/bookmarks/AuthButton.tsx`).
2. Add bookmark (URL + title): URL is required, title is optional custom input; if blank, metadata title is used (`components/bookmarks/AddBookmarkForm.tsx`).
3. Private bookmarks per user: enforced using Supabase Row Level Security policies (`schema.sql`).
4. Real-time updates across tabs: implemented with Supabase Realtime subscription plus local tab sync fallback (`components/bookmarks/BookmarkList.tsx`, `components/bookmarks/bookmarkSync.ts`).
5. Delete own bookmarks: implemented in UI and constrained by RLS (`components/bookmarks/BookmarkList.tsx`, `schema.sql`).
6. Vercel deployment: supported; add your final live URL in the section above.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Supabase (Auth, Postgres, Realtime)
- Tailwind CSS v4
- TypeScript

## Features
- Google sign-in/sign-out
- Add bookmark with URL (required), custom title (optional), and custom category (optional)
- Auto metadata enrichment via `/api/metadata` (title + favicon fallback)
- Private per-user bookmark list
- Real-time updates without refresh
- Delete bookmarks
- Category editing and drag-based ordering

## Local Setup
1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up Supabase database:
Open Supabase SQL Editor and run `schema.sql` from this repo.
Ensure Realtime is enabled for `public.bookmarks`. If needed, run:

```sql
alter publication supabase_realtime add table public.bookmarks;
```

4. Configure Supabase Auth (Google):
In Supabase Dashboard -> Authentication -> Providers, enable Google and add OAuth Client ID/Secret.
In Supabase Auth URL config, include `http://localhost:3000` and `https://<your-project>.vercel.app`.

5. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel
1. Push repo to GitHub.
2. Import the project in Vercel.
3. Add environment variables in Vercel: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.
5. Copy deployed URL into this README under "Submission Links".
6. Add the deployed URL to Supabase Auth redirect/site URLs.

## Project Scripts
- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Problems Faced and Solutions
1. Realtime consistency between browser tabs
Problem: updates were not always immediate across separate tabs.
Solution: used Supabase Realtime `postgres_changes` subscription scoped by `user_id`, plus a BroadcastChannel/localStorage sync fallback for local tab events.

2. Bookmark metadata extraction reliability
Problem: some sites do not expose clean metadata or favicon paths.
Solution: added `/api/metadata` server route using `cheerio`, resolved relative icon URLs, and added safe fallbacks when fetch fails.

3. Data privacy guarantees
Problem: client-side filtering alone is not secure for user isolation.
Solution: enabled RLS and added strict `select/insert/update/delete` policies on `public.bookmarks` tied to `auth.uid()`.

4. Google OAuth redirect mismatches during setup
Problem: login can fail when callback/site URLs do not exactly match environment URLs.
Solution: explicitly configured both local and production URLs in Supabase Auth settings and Google provider config.


## Manual Test Checklist
1. Login with Google.
2. Add a bookmark with URL only.
3. Add a bookmark with URL + custom title.
4. Open a second tab and confirm new bookmark appears in real-time.
5. Delete a bookmark and verify it disappears in both tabs.
6. Confirm one user cannot see another user's bookmarks.
