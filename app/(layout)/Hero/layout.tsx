import FallingPetals from "@/app/(components)/FallingPetals";
import HeroBackground from "@/app/(components)/HeroBackground";
import HeroSideDecorations from "@/app/(components)/HeroSideDecorations";

export default function HeroLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      {/* Google fonts + Material Symbols for icons (kept simple for the demo) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Noto+Serif+JP:wght@300;400;600;900&family=Zen+Antique&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* preload petal SVG to avoid visible delay for falling petals */}
      <link rel="preload" href="/petals/petal.svg" as="image" />

      <div className="font-jp-serif text-ink-black min-h-screen kizuna-hero-bg">
        <div className="w-full washi-card flex shadow-2xl overflow-visible relative border border-stone-200">
          <aside className="w-16 md:w-20 h-screen border-r border-stone-200 flex flex-col items-center py-8 gap-10 bg-[#FAF9F6]/80 z-30 shrink-0 relative">
            <div className="tategaki font-zen text-xs tracking-[0.3em] opacity-60 text-seal-red font-bold">
              絆・アーカイブ
            </div>
            <nav className="flex flex-col gap-8 items-center mt-4">
              <a
                className="material-symbols-outlined text-indigo-dye hover:text-seal-red transition-colors text-2xl"
                href="#"
                title="View Bookmarks"
              >
                bookmarks
              </a>
              <a
                className="material-symbols-outlined text-indigo-dye hover:text-seal-red transition-colors text-2xl"
                href="#"
                title="Add New Link"
              >
                add_circle
              </a>
              <a
                className="material-symbols-outlined text-indigo-dye hover:text-seal-red transition-colors text-2xl"
                href="#"
                title="User Settings"
              >
                manage_accounts
              </a>
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
                  <p className="font-jp-serif text-base text-ink-black/70 mb-8 leading-loose">
                    To preserve the threads of knowledge, verify your seal.
                    Authenticate your ledger to access the archive.
                  </p>

                  <div className="flex flex-col items-center gap-4">
                    <a
                      className="hanko-seal group px-8 py-3 flex items-center gap-3 cursor-pointer"
                      href="#"
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
                    </a>
                    <span className="text-[10px] uppercase font-jp-serif text-stone-400 tracking-widest mt-1">
                      Identity Verification Protocol
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex-1 p-6 md:p-10 bg-[#FAF8F2]/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                {/* tanzaku cards (sample) */}
                <div className="tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 opacity-70">
                      <span className="material-symbols-outlined text-sm text-stone-500">
                        schedule
                      </span>
                      <span className="font-jp-serif text-[10px] text-stone-500 tracking-wider">
                        OCT 14 • 10:23 AM
                      </span>
                    </div>
                    <button
                      className="sakura-btn material-symbols-outlined text-xl"
                      title="Remove Entry"
                    >
                      local_florist
                    </button>
                  </div>
                  <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug group-hover:text-seal-red transition-colors">
                    The Library of Babel Analysis
                  </h3>
                  <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 border-t border-stone-200 border-dashed">
                    <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
                    <span className="italic tracking-wide truncate">
                      borges.library.edu/archive
                    </span>
                  </div>
                </div>

                <div className="tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 opacity-70">
                      <span className="material-symbols-outlined text-sm text-stone-500">
                        schedule
                      </span>
                      <span className="font-jp-serif text-[10px] text-stone-500 tracking-wider">
                        OCT 16 • 02:45 PM
                      </span>
                    </div>
                    <button
                      className="sakura-btn material-symbols-outlined text-xl"
                      title="Remove Entry"
                    >
                      local_florist
                    </button>
                  </div>
                  <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug group-hover:text-seal-red transition-colors">
                    Digital Manuscript Conservation
                  </h3>
                  <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 border-t border-stone-200 border-dashed">
                    <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
                    <span className="italic tracking-wide truncate">
                      manuscripts.io/tech-spec
                    </span>
                  </div>
                </div>

                <div className="tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 opacity-70">
                      <span className="material-symbols-outlined text-sm text-stone-500">
                        schedule
                      </span>
                      <span className="font-jp-serif text-[10px] text-stone-500 tracking-wider">
                        OCT 17 • 09:12 AM
                      </span>
                    </div>
                    <button
                      className="sakura-btn material-symbols-outlined text-xl"
                      title="Remove Entry"
                    >
                      local_florist
                    </button>
                  </div>
                  <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug group-hover:text-seal-red transition-colors">
                    Principles of Information Flow
                  </h3>
                  <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 border-t border-stone-200 border-dashed">
                    <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
                    <span className="italic tracking-wide truncate">
                      academic-ledger.net/flow
                    </span>
                  </div>
                </div>

                <div className="tanzaku-card p-5 flex flex-col justify-between min-h-[160px] group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 opacity-70">
                      <span className="material-symbols-outlined text-sm text-stone-500">
                        schedule
                      </span>
                      <span className="font-jp-serif text-[10px] text-stone-500 tracking-wider">
                        OCT 18 • 04:55 PM
                      </span>
                    </div>
                    <button
                      className="sakura-btn material-symbols-outlined text-xl"
                      title="Remove Entry"
                    >
                      local_florist
                    </button>
                  </div>
                  <h3 className="font-zen text-lg mb-2 text-ink-black leading-snug group-hover:text-seal-red transition-colors">
                    Semantic Web Ontologies
                  </h3>
                  <div className="flex items-center text-xs font-jp-serif text-stone-500 truncate mt-auto pt-4 border-t border-stone-200 border-dashed">
                    <div className="w-4 h-4 bg-stone-300 rounded-sm mr-2 shrink-0 opacity-50"></div>
                    <span className="italic tracking-wide truncate">
                      w3.org/standards/semantic
                    </span>
                  </div>
                </div>

                <div className="border border-stone-300 border-dashed p-4 min-h-[160px] flex items-center justify-center opacity-30 rounded-sm">
                  <span className="material-symbols-outlined text-3xl text-stone-400">
                    add
                  </span>
                </div>
              </div>
            </div>

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
