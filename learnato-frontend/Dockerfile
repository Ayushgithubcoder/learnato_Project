# Dockerfile for learnato-frontend (React)

# --- STAGE 1: Build the React App ---
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all your app code
COPY . .

# Build argument for API URL (defaults to localhost for development)
ARG VITE_API_BASE_URL=http://localhost:5000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the static files
RUN npm run build

# --- STAGE 2: Serve the Static Files ---
# Use a lightweight Nginx server
FROM nginx:stable-alpine

# Copy the built files from STAGE 1
# The 'npm run build' command creates a 'dist' folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (if needed for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# Nginx will be started automatically
CMD ["nginx", "-g", "daemon off;"]