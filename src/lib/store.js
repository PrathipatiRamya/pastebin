import { createClient } from "@vercel/kv";

const isVercel =
  process.env.STORAGE_REST_API_URL && process.env.STORAGE_REST_API_TOKEN;

// In-memory fallback (local only)
const memoryStore = new Map();

let kv = null;

if (isVercel) {
  kv = createClient({
    url: process.env.STORAGE_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN,
  });
}

const key = (id) => `paste:${id}`;

export async function savePaste(id, data) {
  if (kv) {
    await kv.set(key(id), data);
  } else {
    memoryStore.set(key(id), data);
  }
}

export async function getPaste(id) {
  if (kv) {
    return await kv.get(key(id));
  } else {
    return memoryStore.get(key(id));
  }
}

export async function deletePaste(id) {
  if (kv) {
    await kv.del(key(id));
  } else {
    memoryStore.delete(key(id));
  }
}
