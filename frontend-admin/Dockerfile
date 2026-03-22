# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Add build-time arguments for environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Copy the build output from the build stage (Vite uses 'dist' by default)
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to handle SPA routing (important for React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
