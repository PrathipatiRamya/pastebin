import Redis from "ioredis";

let redis = null;

if (process.env.STORAGE_REDIS_URL) {
  redis = new Redis(process.env.STORAGE_REDIS_URL);
}

// Local fallback (dev only)
const memoryStore = new Map();
const key = (id) => `paste:${id}`;

export async function savePaste(id, data) {
  if (redis) {
    await redis.set(key(id), JSON.stringify(data));
  } else {
    memoryStore.set(key(id), data);
  }
}

export async function getPaste(id) {
  if (redis) {
    const value = await redis.get(key(id));
    return value ? JSON.parse(value) : null;
  }
  return memoryStore.get(key(id));
}

export async function deletePaste(id) {
  if (redis) {
    await redis.del(key(id));
  } else {
    memoryStore.delete(key(id));
  }
}
