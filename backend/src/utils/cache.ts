import { Cache } from "@rediskit/cache";

export const cache = new Cache({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "awesomecoder",
});
