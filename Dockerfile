# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# ✅ Accept the MONGO_URI and Clerk keys as build args
ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_FRONTEND_API
ENV NEXT_PUBLIC_CLERK_FRONTEND_API=$NEXT_PUBLIC_CLERK_FRONTEND_API
ARG TAILWIND_CONFIG
ENV TAILWIND_CONFIG=$TAILWIND_CONFIG
ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

# ✅ Debugging output
RUN echo "MONGO_URI from DOCKERFILE: $MONGO_URI"
RUN echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from DOCKERFILE: $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
RUN echo "TAILWIND_CONFIG from DOCKERFILE: $TAILWIND_CONFIG"
RUN echo "NEXT_PUBLIC_SOCKET_URL from DOCKERFILE: $NEXT_PUBLIC_SOCKET_URL"
RUN echo "NEXT_PUBLIC_CLERK_FRONTEND_API from DOCKERFILE: $NEXT_PUBLIC_CLERK_FRONTEND_API"


# Copy source code and build locally
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

# ✅ Copy pre-built app (no build needed at runtime)
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static 


# ✅ Pass NODE_ENV to production
ENV NODE_ENV="qa"

# ✅ Expose port and start
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]

