FROM oven/bun

# env
ENV NODE_ENV=production \
    JWT_SECRET="base64:m3zBmb0c6JmR0chXm6aPHzBokTSmPKnVvWmwHA26oJU=" \
    DATABASE_URL='mongodb://root:password@mongodb:27017/convey?authSource=admin' \
    REDIS_HOST=redis \
    REDIS_PASSWORD=awesomecoder \
    REDIS_PORT=6379

# Set working directory
WORKDIR /usr/src/app

# Set the working directory
COPY package*.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Build the application
EXPOSE 3000

# Run the application
CMD [ "bun", "start" ]

