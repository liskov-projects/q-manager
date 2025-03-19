# Stage 1: Build
FROM node:20 as builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy all source code into the container
COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Production container
FROM node:20 as runner
WORKDIR /app

# Copy the build files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port (Cloud Run will still override this)
EXPOSE 3000

# Start Next.js server
CMD ["npm", "run", "start"]
