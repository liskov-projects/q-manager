# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# ✅ Accept the MONGO_URI and Clerk keys as build args
ARG NEXT_PUBLIC_MONGO_URI
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MONGO_URI=$NEXT_PUBLIC_MONGO_URI
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# ✅ Debugging output
RUN echo "NEXT_PUBLIC_MONGO_URI from DOCKERFILE: $NEXT_PUBLIC_MONGO_URI"
RUN echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from DOCKERFILE: $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
RUN echo "CLERK_SECRET_KEY from DOCKERFILE: $CLERK_SECRET_KEY"

# Copy source code and build locally
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

# ✅ Copy pre-built app (no build needed at runtime)
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/public ./public

# ✅ Pass NODE_ENV to production
ENV NODE_ENV="production"
ENV NEXT_PUBLIC_MONGO_URI=$NEXT_PUBLIC_MONGO_URI
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# ✅ Expose port and start
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]

