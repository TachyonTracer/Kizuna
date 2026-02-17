const BOOKMARK_SYNC_STORAGE_KEY = "kizuna:bookmarks:sync";
const BOOKMARK_SYNC_CHANNEL = "kizuna:bookmarks:sync";
const BOOKMARK_SYNC_EVENT = "kizuna:bookmarks:sync-event";

export const broadcastBookmarkMutation = () => {
  if (typeof window === "undefined") return;

  const stamp = Date.now().toString();

  try {
    window.localStorage.setItem(BOOKMARK_SYNC_STORAGE_KEY, stamp);
  } catch {
    // Ignore storage quota/security errors; BroadcastChannel/custom event may still work.
  }

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(BOOKMARK_SYNC_CHANNEL);
    channel.postMessage(stamp);
    channel.close();
  }

  window.dispatchEvent(new CustomEvent(BOOKMARK_SYNC_EVENT));
};

export const subscribeToBookmarkMutations = (onChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === BOOKMARK_SYNC_STORAGE_KEY) {
      onChange();
    }
  };

  const onCustomEvent = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(BOOKMARK_SYNC_EVENT, onCustomEvent);

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(BOOKMARK_SYNC_CHANNEL);
    channel.onmessage = () => onChange();
  }

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(BOOKMARK_SYNC_EVENT, onCustomEvent);
    channel?.close();
  };
};
