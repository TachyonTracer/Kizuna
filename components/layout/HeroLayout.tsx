import {
  FallingPetals,
  HeroBackground,
  HeroSideDecorations,
} from "@/components/hero";
import { AuthButton, BookmarkManager } from "@/components/bookmarks";

export default function HeroLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="font-jp-serif text-ink-black min-h-screen kizuna-hero-bg">
        <div className="w-full washi-card flex shadow-2xl overflow-visible relative border border-stone-200">
          <aside className="w-16 md:w-20 h-screen border-r border-stone-200 flex flex-col items-center py-8 gap-10 bg-[#FAF9F6]/80 z-30 shrink-0 relative">
            <div className="tategaki font-zen text-xs tracking-[0.3em] opacity-60 text-seal-red font-bold">
              絆・アーカイブ
            </div>
            <nav className="flex flex-col gap-8 items-center mt-4">
              <button
                type="button"
                aria-label="View bookmarks"
                className="material-symbols-outlined text-indigo-dye hover:text-seal-red transition-colors text-2xl"
              >
                bookmarks
              </button>
              <button
                type="button"
                aria-label="Add new link"
                className="material-symbols-outlined text-indigo-dye hover:text-seal-red transition-colors text-2xl"
              >
                add_circle
              </button>
              <button
                type="button"
                aria-label="User settings"
                className="material-symbols-outlined text-indigo-dye hover:text-seal-red transition-colors text-2xl"
              >
                manage_accounts
              </button>
            </nav>
            <div className="mt-auto flex flex-col items-center gap-4">
              <div className="w-px h-12 bg-stone-300"></div>
              <span className="font-zen text-xl text-sakura-dark">桜</span>
            </div>
          </aside>

          <div className="flex-1 flex flex-col relative overflow-visible bg-transparent z-10">
            <section className="h-screen flex items-center justify-center p-8 md:p-12 rope-border relative z-10 backdrop-blur-sm overflow-hidden">
              <HeroBackground />
              <HeroSideDecorations />
              <FallingPetals />

              <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <svg
                  fill="none"
                  height="120"
                  stroke="#D68E9D"
                  strokeWidth="0.5"
                  viewBox="0 0 100 100"
                  width="120"
                >
                  <path d="M50 50 Q 70 20 90 50 T 50 90 T 10 50 T 50 10"></path>
                  <circle cx="50" cy="50" r="30" strokeDasharray="2 4"></circle>
                </svg>
              </div>

              <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
                <div className="flex flex-col items-center">
                  <span className="hero-subtitle font-zen text-sm mb-3 block uppercase">
                    Connection • Bond
                  </span>

                  <h1 className="hero-title font-zen text-5xl md:text-6xl mb-2">
                    Kizuna
                  </h1>

                  <span className="hero-tagline text-indigo-dye/80 font-jp-serif text-xl tracking-widest">
                    Digital Garden of Memories
                  </span>
                </div>

                <div className="py-8 px-8 border-y border-stone-200 bg-[#FDFBF7]/80 backdrop-blur-xl rounded-sm max-w-lg mx-auto shadow-sm hover:shadow-md transition-shadow duration-500">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-4">
                      <AuthButton />
                    </div>
                    <span className="text-[10px] uppercase font-jp-serif text-stone-400 tracking-widest mt-1">
                      Identity Verification Protocol
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <BookmarkManager />

            <footer className="p-6 border-t border-double border-stone-300 bg-[#FAF9F6] flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase text-stone-500 font-jp-serif">
              <div className="flex items-center gap-4">
                <span>© Kizuna Archive</span>
                <span className="opacity-30">|</span>
                <span>Real-Time Sync</span>
              </div>
              <div className="mt-2 md:mt-0 font-bold text-indigo-dye/60">
                Version 1.0 • Sakura Season
              </div>
            </footer>
          </div>

          <div
            className="fixed top-0 right-12 md:right-24 w-10 h-32 bg-seal-red shadow-lg z-50 pointer-events-none flex flex-col items-center pt-4"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
            }}
          >
            <div className="w-px h-full bg-black/10 absolute left-2"></div>
            <div className="w-px h-full bg-black/10 absolute right-2"></div>
            <span className="text-white/90 text-xs font-zen tategaki">
              保存
            </span>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
