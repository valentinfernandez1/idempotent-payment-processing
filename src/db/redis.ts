import { createClient, RedisClientType } from "redis";
import { config } from "../config";
import { RequestError } from "../utils/errors";

let client: RedisClientType;

export async function initRedis() {
  if (client) return client;

  client = createClient({
    url: config.db.redisUrl,
  });

  client.on("error", (err) => {
    console.error("Redis error", err);
  });

  await client.connect();
  console.log("Redis connected");

  return client;
}

export function getRedis(): RedisClientType{
    if (!client) {
        console.log("Redis not initialized")
        throw new Error("Redis not initialized");
    }
    return client
}