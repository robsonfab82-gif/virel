const DB_NAME = "virel_storage";
const DB_VERSION = 1;
const STORE_NAME = "blobs";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(blob, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function loadBlob(key: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBlob(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function createBlobURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeBlobURL(url: string): void {
  URL.revokeObjectURL(url);
}

export interface VideoMeta {
  title: string;
  description: string;
  fileName: string;
  size: number;
  type: string;
  savedAt: string;
}

const VIDEO_META_KEY = "virel_demo_video_meta";

export function saveVideoMeta(meta: VideoMeta): void {
  localStorage.setItem(VIDEO_META_KEY, JSON.stringify(meta));
}

export function loadVideoMeta(): VideoMeta | null {
  try {
    const stored = localStorage.getItem(VIDEO_META_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function deleteVideoMeta(): void {
  localStorage.removeItem(VIDEO_META_KEY);
}
