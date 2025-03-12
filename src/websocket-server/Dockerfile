# 👉 Use a lightweight Node.js Alpine image (x86-64 for Cloud Run)
FROM --platform=linux/amd64 node:20-alpine

# ✅ Set the working directory at the app level (no src)
WORKDIR /app

# ✅ Install curl and netcat for debugging and health checks
RUN apk add --no-cache curl netcat-openbsd

# ✅ Copy package.json files to root and install dependencies
COPY src/websocket-server/package*.json ./
RUN npm install --production

# ✅ Copy server code into the right place
COPY src/websocket-server websocket-server/

# ✅ Copy models and lib directly at app level so ../models works
COPY src/models models/
COPY src/lib lib/

# ✅ Ensure permissions are correct
RUN chmod -R 755 /app

# ✅ Enable HTTP/2 for Cloud Run
ENV HTTP2=1

# ✅ Expose port for Cloud Run
EXPOSE 4000

# ✅ Start the WebSocket server
CMD ["node", "websocket-server/websocket-server.js"]
