# Stage 1: Build
FROM node:20 as builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20 as runner
WORKDIR /app

# Copy standalone output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# Expose the port for Cloud Run
EXPOSE 3000

# Start the app using the wrapper
CMD ["node", "server.js"]
