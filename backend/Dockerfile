# --- Build Stage ---
FROM oven/bun AS builder

ENV NODE_ENV=production \
    JWT_SECRET="base64:m3zBmb0c6JmR0chXm6aPHzBokTSmPKnVvWmwHA26oJU=" \
    DATABASE_URL='mongodb://root:password@mongodb:27017/convey?authSource=admin' \
    REDIS_HOST=redis \
    REDIS_PASSWORD=awesomecoder \
    REDIS_PORT=6379

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

# --- Production Stage ---
FROM oven/bun AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy only built files and production dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/bun.lockb ./

# If you need .env or other config files, copy them here as well
# COPY --from=builder /usr/src/app/.env ./

RUN bun install --production

EXPOSE 3000

CMD [ "bun", "run", "dist/index.js" ]