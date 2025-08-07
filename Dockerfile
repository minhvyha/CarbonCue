# Use a base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of your code
COPY . .

# Build the app (adjust if you're using nextjs, vite, etc.)
RUN pnpm build

# Set the start command if needed
CMD ["pnpm", "start"]
