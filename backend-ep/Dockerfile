# Use Bun as the base image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install

COPY . .

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "dev"]
