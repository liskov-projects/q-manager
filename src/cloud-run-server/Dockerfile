# Use an official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port 4000 (Cloud Run will map this automatically)
EXPOSE 4000

# Start the server
CMD ["node", "cloud-run-server.js"]
